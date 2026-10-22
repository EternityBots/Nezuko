import {
	extractMessageContent,
	getContentType,
	isLidUser,
	isPnUser,
	jidNormalizedUser,
	type AnyMessageContent,
	type WAMessage,
	type WAMessageKey,
	type proto
} from 'baileys'
import type { Client, Message, QuotedMessage } from '../types.js'

const textOf = (msg: any, message?: proto.IMessage | null): string =>
	message?.conversation ||
	msg?.text ||
	msg?.caption ||
	msg?.contentText ||
	msg?.selectedDisplayText ||
	msg?.title ||
	(typeof msg === 'string' ? msg : '') ||
	''

/** Turns a raw Baileys message into the shape commands use, resolving LID/phone-number JIDs. */
export const serialize = async (client: Client, raw: WAMessage): Promise<Message | null> => {
	if (!raw.message || !raw.key.remoteJid) return null

	const key = raw.key
	const from = jidNormalizedUser(key.remoteJid!)
	const isGroup = from.endsWith('@g.us')
	const fromMe = Boolean(key.fromMe)

	// Who sent it. In LID-addressed chats Baileys v7 puts the phone number in the *Alt field.
	const selfPn = client.user?.id ? jidNormalizedUser(client.user.id) : undefined
	const selfLid = client.user?.lid ? jidNormalizedUser(client.user.lid) : undefined
	let sender: string
	let alt: string | undefined
	if (fromMe) {
		sender = isGroup && key.participant ? jidNormalizedUser(key.participant) : (selfPn ?? from)
		alt = isLidUser(sender) ? selfPn : selfLid
	} else if (isGroup) {
		sender = jidNormalizedUser(key.participant ?? '')
		alt = key.participantAlt ? jidNormalizedUser(key.participantAlt) : undefined
	} else {
		sender = from
		alt = key.remoteJidAlt ? jidNormalizedUser(key.remoteJidAlt) : undefined
	}
	let senderPn = isPnUser(sender) ? sender : alt && isPnUser(alt) ? alt : undefined
	const senderLid = isLidUser(sender) ? sender : alt && isLidUser(alt) ? alt : undefined
	if (!senderPn && senderLid) senderPn = await client.toPn(senderLid)

	const message = extractMessageContent(raw.message) ?? raw.message
	const type = getContentType(message)
	const msg: any = type ? message[type] : undefined
	const contextInfo: proto.IContextInfo | undefined = msg?.contextInfo ?? undefined

	const reply: Message['reply'] = (content, options = {}) =>
		client.sendMessage(from, typeof content === 'string' ? { text: content } : (content as AnyMessageContent), { quoted: raw, ...options })

	let quoted: QuotedMessage | null = null
	if (contextInfo?.quotedMessage && contextInfo.stanzaId) {
		const qMessage = extractMessageContent(contextInfo.quotedMessage) ?? contextInfo.quotedMessage
		const qType = getContentType(qMessage)
		const qMsg: any = qType ? qMessage[qType] : undefined
		const qSender = jidNormalizedUser(contextInfo.participant || sender)
		const qFromMe = Boolean((selfPn && qSender === selfPn) || (selfLid && qSender === selfLid))
		const qKey: WAMessageKey = {
			remoteJid: from,
			fromMe: qFromMe,
			id: contextInfo.stanzaId,
			...(isGroup ? { participant: qSender } : {})
		}
		const qRaw: WAMessage = { key: qKey, message: qMessage }
		quoted = {
			key: qKey,
			id: contextInfo.stanzaId,
			sender: qSender,
			senderPn: isPnUser(qSender) ? qSender : await client.toPn(qSender),
			fromMe: qFromMe,
			type: qType,
			message: qMessage,
			msg: qMsg,
			text: textOf(qMsg, qMessage),
			mimetype: qMsg?.mimetype ?? '',
			raw: qRaw,
			download: () => client.downloadMedia({ raw: qRaw }),
			delete: () => client.sendMessage(from, { delete: qKey })
		}
	}

	return {
		raw,
		key,
		id: key.id ?? '',
		from,
		isGroup,
		fromMe,
		sender,
		senderPn,
		senderLid,
		pushName: raw.pushName ?? '',
		type,
		message,
		msg,
		text: textOf(msg, message),
		mimetype: msg?.mimetype ?? '',
		mentions: (contextInfo?.mentionedJid ?? []).map(j => jidNormalizedUser(j)),
		quoted,
		reply,
		react: emoji => client.sendMessage(from, { react: { text: emoji, key } }),
		download: () => client.downloadMedia({ raw: { ...raw, message } })
	}
}
