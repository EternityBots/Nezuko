import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'delete',
	alias: ['del'],
	desc: "Deletes the quoted message (the bot's own, or anyone's if the bot is admin)",
	usage: 'Reply to a message with %prefix%command',
	category: 'Group',
	react: '✅',
	groupOnly: true,
	adminOnly: true,
	start: async (client, m, { isBotAdmin }) => {
		if (!m.quoted) return m.reply('Reply to the message you want to delete')
		if (!m.quoted.fromMe && !isBotAdmin) return m.reply('I need to be an admin to delete other members\' messages')
		await m.quoted.delete()
	}
})
