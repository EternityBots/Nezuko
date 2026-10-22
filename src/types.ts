import type { GroupMetadata, GroupParticipant, WAMessage, WAMessageKey, proto, AnyMessageContent, MiscMessageGenerationOptions, WASocket } from 'baileys'
import type { CommandRegistry } from './core/commands.js'

export type Category = 'General' | 'Group' | 'Mods' | 'Media' | 'Utils' | 'Fun' | 'Weeb' | 'Education'

/** Extra helpers attached to the Baileys socket. */
export interface ClientHelpers {
	/** Send a text message, optionally quoting another message. */
	sendText(jid: string, text: string, quoted?: WAMessage, mentions?: string[]): Promise<WAMessage | undefined>
	/** Download the media of a (serialized) message or quoted message. */
	downloadMedia(target: { raw: WAMessage }): Promise<Buffer>
	/** Display name we know for a user, falling back to the number. */
	getName(jid: string): Promise<string>
	/** Resolve a LID to a phone-number JID when Baileys has seen the mapping. */
	toPn(jid: string | undefined): Promise<string | undefined>
	/** Group metadata, served from cache when possible. */
	getGroupMetadata(jid: string): Promise<GroupMetadata>
	/** Profile picture as a Buffer, or the fallback image. */
	getAvatar(jid: string): Promise<Buffer>
}

export type Client = WASocket & ClientHelpers

export interface QuotedMessage {
	key: WAMessageKey
	id: string
	/** JID as WhatsApp addressed it (may be a LID). */
	sender: string
	/** Phone-number JID when known. */
	senderPn?: string
	fromMe: boolean
	type?: keyof proto.IMessage
	message: proto.IMessage
	/** Inner content of the message type (e.g. the imageMessage). */
	msg: any
	text: string
	mimetype: string
	raw: WAMessage
	download(): Promise<Buffer>
	delete(): Promise<unknown>
}

export interface Message {
	raw: WAMessage
	key: WAMessageKey
	id: string
	/** Chat JID (group or user). */
	from: string
	isGroup: boolean
	fromMe: boolean
	/** Sender JID as WhatsApp addressed it (may be a LID). */
	sender: string
	/** Sender phone-number JID when known (always set for PN-addressed chats). */
	senderPn?: string
	/** Sender LID when known. */
	senderLid?: string
	pushName: string
	type?: keyof proto.IMessage
	message: proto.IMessage
	/** Inner content of the message type (e.g. the imageMessage). */
	msg: any
	text: string
	mimetype: string
	mentions: string[]
	quoted: QuotedMessage | null
	reply(content: string | AnyMessageContent, options?: MiscMessageGenerationOptions): Promise<WAMessage | undefined>
	react(emoji: string): Promise<WAMessage | undefined>
	download(): Promise<Buffer>
}

export interface CommandContext {
	prefix: string
	/** Name the user typed (could be an alias). */
	command: string
	args: string[]
	/** Everything after the command name. */
	text: string
	/** Arguments that start with `--`. */
	flags: string[]
	isOwner: boolean
	isAdmin: boolean
	isBotAdmin: boolean
	metadata?: GroupMetadata
	groupName: string
	participants: GroupParticipant[]
	groupAdmins: GroupParticipant[]
	/** JIDs mentioned in the message. */
	mentions: string[]
	/** The quoted message if any, otherwise the message itself. */
	target: Message | QuotedMessage
	/** Mime type of the target media, or ''. */
	mime: string
	commands: CommandRegistry
	settings: {
		antilink: boolean
		nsfw: boolean
		events: boolean
	}
}

export interface Command {
	name: string
	alias?: string[]
	desc?: string
	/** `%prefix` and `%command` are replaced when shown to users. */
	usage?: string
	category: Category
	react?: string
	/** Cooldown in seconds. */
	cool?: number
	ownerOnly?: boolean
	groupOnly?: boolean
	adminOnly?: boolean
	botAdmin?: boolean
	/** Hidden from the help menu. */
	hidden?: boolean
	start(client: Client, m: Message, ctx: CommandContext): Promise<unknown>
}

export const defineCommand = (command: Command): Command => command
