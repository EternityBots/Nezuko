import { Boom } from '@hapi/boom'
import makeWASocket, {
	Browsers,
	DisconnectReason,
	downloadMediaMessage,
	isLidUser,
	jidNormalizedUser,
	makeCacheableSignalKeyStore,
	type AnyMessageContent,
	type BaileysEventMap,
	type GroupMetadata,
	type MiscMessageGenerationOptions,
	type WAMessage,
	type WAMessageKey,
	type proto
} from 'baileys'
import chalk from 'chalk'
import pino from 'pino'
import qrTerminal from 'qrcode-terminal'
import { config } from '../config.js'
import { User } from '../db/models.js'
import { fetchBuffer } from '../lib/http.js'
import { userPart } from '../lib/utils.js'
import type { Client, ClientHelpers } from '../types.js'
import { useMongoAuthState, type AuthCollection } from './auth-state.js'
import { TtlCache } from './cache.js'

const logger = pino({ level: config.logLevel })

export const DEFAULT_AVATAR = 'https://i.pinimg.com/564x/84/09/12/840912dd744e6662ab211b8070b5d84c.jpg'

/** Shared status for the web QR page. */
export const connectionState = {
	status: 'connecting' as 'connecting' | 'open' | 'close',
	qr: null as string | null,
	pairingCode: null as string | null
}

// Caches live outside the socket so they survive reconnects.
const groupCache = new TtlCache(5 * 60_000, 1_000)
const msgRetryCounterCache = new TtlCache(10 * 60_000)
/** Recent messages, so Baileys can re-send them when a recipient asks for a retry. */
const recentMessages = new TtlCache(30 * 60_000, 2_000)
/** IDs of messages this bot sent, so it never reacts to its own output. */
export const sentByBot = new TtlCache(10 * 60_000, 2_000)

const rememberMessage = (msg: WAMessage | undefined) => {
	if (msg?.key.id && msg.message) recentMessages.set(`${msg.key.remoteJid}:${msg.key.id}`, msg.message)
}

interface StartOptions {
	onMessages: (client: Client, messages: WAMessage[]) => void
	onParticipants: (client: Client, update: BaileysEventMap['group-participants.update']) => void
	onReady?: (client: Client) => void
	/** Override where the session is stored (used by tests; defaults to MongoDB). */
	authCollection?: AuthCollection
}

let reconnectAttempts = 0
let current: Client | null = null

export const getClient = () => current

export const startSocket = async (options: StartOptions): Promise<Client> => {
	const { state, saveCreds, clearState, migrated } = await useMongoAuthState(config.sessionId, options.authCollection)
	if (migrated) console.log(chalk.green('[auth] Imported your existing session from the old version, no need to re-link.'))

	const sock = makeWASocket({
		auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
		logger,
		browser: Browsers.macOS('Chrome'),
		markOnlineOnConnect: false,
		syncFullHistory: false,
		shouldSyncHistoryMessage: () => false,
		generateHighQualityLinkPreview: false,
		msgRetryCounterCache,
		getMessage: async (key: WAMessageKey) => recentMessages.get<proto.IMessage>(`${key.remoteJid}:${key.id}`),
		cachedGroupMetadata: async jid => groupCache.get<GroupMetadata>(jid)
	})

	// Remember everything we send (for retries) and mark it as ours.
	const send = sock.sendMessage.bind(sock)
	sock.sendMessage = (async (jid: string, content: AnyMessageContent, options?: MiscMessageGenerationOptions) => {
		// Baileys has no upload time limit by default, so a stalled media upload would hang
		// the command forever with no error. Fail after 2 minutes instead.
		const sent = await send(jid, content, { mediaUploadTimeoutMs: 120_000, ...options })
		if (sent?.key.id) sentByBot.set(sent.key.id, true)
		rememberMessage(sent)
		return sent
	}) as typeof send

	const helpers: ClientHelpers = {
		sendText: (jid, text, quoted, mentions) => sock.sendMessage(jid, { text, mentions }, { quoted }),

		downloadMedia: ({ raw }) =>
			downloadMediaMessage(raw, 'buffer', {}, { logger, reuploadRequest: sock.updateMediaMessage }) as Promise<Buffer>,

		toPn: async jid => {
			if (!jid) return undefined
			if (!isLidUser(jid)) return jidNormalizedUser(jid)
			const pn = await sock.signalRepository.lidMapping.getPNForLID(jid).catch(() => null)
			return pn ? jidNormalizedUser(pn) : undefined
		},

		getName: async jid => {
			const pn = await helpers.toPn(jid)
			const ids = [jidNormalizedUser(jid), pn].filter((id): id is string => Boolean(id))
			const doc = await User.findOne({ id: { $in: ids } }).lean()
			return doc?.name || userPart(pn ?? jid)
		},

		getGroupMetadata: async jid => {
			const cached = groupCache.get<GroupMetadata>(jid)
			if (cached) return cached
			const metadata = await sock.groupMetadata(jid)
			groupCache.set(jid, metadata)
			return metadata
		},

		getAvatar: async jid => {
			const url = await sock.profilePictureUrl(jid, 'image').catch(() => undefined)
			return fetchBuffer(url ?? DEFAULT_AVATAR).catch(() => fetchBuffer(DEFAULT_AVATAR))
		}
	}
	const client = Object.assign(sock, helpers) as Client
	current = client

	client.ev.on('creds.update', saveCreds)

	// Keep the group cache fresh instead of refetching metadata on every message.
	client.ev.on('groups.update', updates => {
		for (const u of updates) if (u.id) groupCache.del(u.id)
	})
	client.ev.on('group-participants.update', update => {
		groupCache.del(update.id)
		options.onParticipants(client, update)
	})

	client.ev.on('messages.upsert', ({ messages, type }) => {
		for (const msg of messages) rememberMessage(msg)
		if (type === 'notify') options.onMessages(client, messages)
	})

	let pairingRequested = false
	client.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
		if (qr) {
			connectionState.qr = qr
			if (config.pairingNumber && !client.authState.creds.registered && !pairingRequested) {
				pairingRequested = true
				try {
					const code = await client.requestPairingCode(config.pairingNumber)
					connectionState.pairingCode = code
					console.log(chalk.cyan(`\n[pairing] On your phone: Linked devices > Link with phone number, then enter: ${chalk.bold(code)}\n`))
				} catch (err) {
					console.error('[pairing] Could not get a pairing code:', err)
				}
			} else if (!config.pairingNumber) {
				console.log(chalk.cyan('[qr] Scan this QR in WhatsApp > Linked devices (it is also served at /qr):'))
				qrTerminal.generate(qr, { small: true })
			}
		}

		if (connection) connectionState.status = connection === 'open' ? 'open' : connection === 'close' ? 'close' : 'connecting'

		if (connection === 'open') {
			reconnectAttempts = 0
			connectionState.qr = null
			connectionState.pairingCode = null
			console.log(chalk.green(`[connection] Connected as ${client.user?.name ?? ''} (${userPart(client.user?.id ?? '')})`))
			options.onReady?.(client)
			return
		}

		if (connection !== 'close') return
		const code = (lastDisconnect?.error as Boom | undefined)?.output?.statusCode
		const restart = (delayMs: number) => setTimeout(() => startSocket(options).catch(err => console.error('[connection] Restart failed:', err)), delayMs)

		switch (code) {
			case DisconnectReason.restartRequired:
				// Normal right after linking a device.
				console.log('[connection] Restart required, reconnecting...')
				restart(0)
				break
			case DisconnectReason.loggedOut:
				console.log(chalk.red('[connection] Logged out from WhatsApp. Clearing the session; link the bot again.'))
				await clearState()
				restart(1_000)
				break
			case DisconnectReason.forbidden:
				console.log(chalk.red('[connection] WhatsApp refused the connection (403). The number may be banned or restricted. Not reconnecting.'))
				break
			case DisconnectReason.connectionReplaced:
				console.log(
					chalk.red('[connection] Another instance logged in with this session (440). Stop the other instance, then restart this one. Not reconnecting.')
				)
				break
			default: {
				// Includes 500 ("bad session"): under Bun, plain network failures are also reported as 500,
				// so it is retried instead of treated as fatal. The session is never wiped automatically.
				reconnectAttempts++
				const delay = Math.min(60_000, 2_000 * 2 ** Math.min(reconnectAttempts - 1, 5))
				const reason = lastDisconnect?.error?.message ? `: ${lastDisconnect.error.message}` : ''
				console.log(`[connection] Closed (${code ?? 'unknown'}${reason}), reconnecting in ${delay / 1000}s...`)
				const sessionProblem = code === DisconnectReason.badSession || code === DisconnectReason.multideviceMismatch
				if (sessionProblem && reconnectAttempts >= 5) {
					console.log(
						chalk.yellow(
							'[connection] Still failing. If your internet is fine, the saved session may be broken: run "bun run reset-session" and link again.'
						)
					)
				}
				restart(delay)
			}
		}
	})

	return client
}
