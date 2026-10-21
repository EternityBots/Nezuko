import type { GroupMetadata, GroupParticipant, WAMessage } from 'baileys'
import chalk from 'chalk'
import { config } from '../config.js'
import type { CommandRegistry } from '../core/commands.js'
import { canonicalId, findParticipant, isAdminParticipant, isOwner } from '../core/identity.js'
import { serialize } from '../core/serialize.js'
import { sentByBot } from '../core/socket.js'
import { levels } from '../db/levels.js'
import { User } from '../db/models.js'
import { settings } from '../db/settings.js'
import { errorMessage, userPart } from '../lib/utils.js'
import type { Client, CommandContext, Message } from '../types.js'

const INVALID_COMMAND_IMAGE = 'https://i.ibb.co/c33ZHCx/wallpaperflare-com-wallpaper.jpg'
const INVITE_LINK = /(chat\.whatsapp\.com\/|api\.whatsapp\.com\/|wa\.me\/[^\s]*\?text)/i

/** sender -> command name -> last use */
const cooldowns = new Map<string, Map<string, number>>()
/** Names we already saved this run, to avoid a DB write per message. */
const knownNames = new Map<string, string>()

const log = (m: Message, body: string, groupName: string) => {
	const tag = m.isGroup ? chalk.black.bgWhite('[ GROUP ]') + ' ' + chalk.black.bgBlueBright(groupName) : chalk.black.bgRedBright('[ PRIVATE ]')
	const who = `${m.pushName || 'Unknown'} @${userPart(m.senderPn ?? m.sender)}`
	console.log(`${tag} ${chalk.gray(new Date().toLocaleTimeString())} ${chalk.cyan(who)}: ${body}`)
}

const rememberName = (m: Message) => {
	const id = canonicalId(m.senderPn, m.sender)
	if (!m.pushName || knownNames.get(id) === m.pushName) return
	knownNames.set(id, m.pushName)
	User.updateOne({ id }, { $set: { name: m.pushName } }, { upsert: true }).catch(() => {})
}

const deleteAndKick = async (client: Client, m: Message) => {
	await client.sendMessage(m.from, { delete: m.key })
	await client.groupParticipantsUpdate(m.from, [m.sender], 'remove')
}

export const createMessageHandler = (commands: CommandRegistry) => async (client: Client, raws: WAMessage[]) => {
	for (const raw of raws) {
		try {
			if (!raw.message || raw.key.remoteJid === 'status@broadcast') continue
			if (raw.key.id && sentByBot.get(raw.key.id)) continue
			const m = await serialize(client, raw)
			if (!m || m.type === 'protocolMessage' || m.type === 'reactionMessage') continue
			await handle(client, m, commands)
		} catch (err) {
			console.error('[message] Handler error:', err)
		}
	}
}

const handle = async (client: Client, m: Message, commands: CommandRegistry) => {
	const { prefix } = config
	const body = m.text ?? ''
	const senderIds = [m.sender, m.senderPn, m.senderLid]
	const owner = isOwner(senderIds)
	rememberName(m)

	let metadata: GroupMetadata | undefined
	let participants: GroupParticipant[] = []
	let isAdmin = false
	let isBotAdmin = false
	const [antilink, nsfw, events] = await Promise.all([
		settings.has('mods', m.from),
		settings.has('nsfw', m.from),
		settings.has('events', m.from)
	])

	if (m.isGroup) {
		metadata = await client.getGroupMetadata(m.from).catch(() => undefined)
		participants = metadata?.participants ?? []
		isAdmin = isAdminParticipant(findParticipant(participants, senderIds))
		isBotAdmin = isAdminParticipant(findParticipant(participants, [client.user?.id, client.user?.lid]))
	}

	// Anti-link: remove members who post WhatsApp invite links in protected groups.
	if (m.isGroup && antilink && !m.fromMe && INVITE_LINK.test(body)) {
		if (owner) return void m.reply('*Ohhh you are a mod*')
		if (isAdmin) return void m.reply('*Ohhh you are an admin*')
		if (isBotAdmin) return void (await deleteAndKick(client, m).catch(() => {}))
	}

	if (!body.startsWith(prefix)) return
	const [rawName = '', ...args] = body.slice(prefix.length).trim().split(/\s+/)
	const name = rawName.toLowerCase()
	if (!name) return
	const cmd = commands.get(name)
	const text = args.join(' ')
	log(m, body, metadata?.subject ?? '')

	if (!cmd) {
		return void m.reply({
			image: { url: INVALID_COMMAND_IMAGE },
			caption: `*${prefix}${name}* is an ⛔ invalid command\nuse *${prefix}help* to see the help menu`
		})
	}

	if (text.endsWith('--info')) {
		const info = [`*Command :* ${cmd.name}`]
		if (cmd.alias?.length) info.push(`*Alias :* ${cmd.alias.join(', ')}`)
		if (cmd.desc) info.push(`*Description :* ${cmd.desc}`)
		if (cmd.usage) info.push(`*Example :* ${cmd.usage.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd.name)}`)
		return void m.reply(`*ℹ️ Command Info*\n\n${info.join('\n')}`)
	}

	if (!m.isGroup && !owner) return void m.reply('*You can\'t use commands in DM*')
	const userId = canonicalId(m.senderPn, m.sender)
	if (await settings.has('ban', userId)) return void m.reply('You are banned from using commands ❌')

	if (cmd.ownerOnly && !owner) return void m.reply('*👑 Only mods can use this command*')
	if (cmd.groupOnly && !m.isGroup) return void m.reply('*This command only works in groups*')
	if (cmd.adminOnly && !isAdmin && !owner) return void m.reply('*This is an admin-only command*')
	if (cmd.botAdmin && !isBotAdmin) return void m.reply('*Make me an admin to use this command*')

	// Cooldown per user per command.
	if (cmd.cool && !owner) {
		const userCooldowns = cooldowns.get(userId) ?? new Map<string, number>()
		cooldowns.set(userId, userCooldowns)
		const last = userCooldowns.get(cmd.name) ?? 0
		const remaining = last + cmd.cool * 1000 - Date.now()
		if (remaining > 0) return void m.reply(`You are on cooldown, please wait another _${(remaining / 1000).toFixed(1)} second(s)_`)
		userCooldowns.set(cmd.name, Date.now())
	}

	if (cmd.react) m.react(cmd.react).catch(() => {})
	levels.append(userId, Math.floor(Math.random() * 3) + 1).catch(() => {})

	const target = m.quoted ?? m
	const ctx: CommandContext = {
		prefix,
		command: name,
		args,
		text,
		flags: args.filter(a => a.startsWith('--')),
		isOwner: owner,
		isAdmin,
		isBotAdmin,
		metadata,
		groupName: metadata?.subject ?? '',
		participants,
		groupAdmins: participants.filter(p => isAdminParticipant(p)),
		mentions: m.mentions,
		target,
		mime: target.mimetype || '',
		commands,
		settings: { antilink, nsfw, events }
	}

	try {
		await cmd.start(client, m, ctx)
	} catch (err) {
		console.error(`[command:${cmd.name}]`, err)
		await m.reply(`❌ Something went wrong: ${errorMessage(err)}`).catch(() => {})
	}
}
