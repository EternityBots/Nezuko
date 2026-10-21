import type { CommandContext, Message } from '../types.js'

/** The user a command is aimed at: first @mention, otherwise the author of the quoted message. */
export const targetUser = (m: Message, ctx: CommandContext): string | undefined => ctx.mentions[0] ?? m.quoted?.sender

/** Like targetUser, but falls back to the sender. */
export const targetOrSelf = (m: Message, ctx: CommandContext): string => targetUser(m, ctx) ?? m.sender
