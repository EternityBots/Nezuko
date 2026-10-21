import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'join',
	alias: ['jn'],
	desc: 'Makes the bot join a group from an invite link',
	usage: '%prefix%command <group link>',
	category: 'Mods',
	react: '✅',
	ownerOnly: true,
	start: async (client, m, { text }) => {
		const code = /chat\.whatsapp\.com\/([\w-]{10,})/.exec(text)?.[1]
		if (!code) return m.reply('🔍 Please provide a valid group link')
		const jid = await client.groupAcceptInvite(code)
		await m.reply(jid ? 'Joined ✅' : 'Request sent, waiting for admin approval')
	}
})
