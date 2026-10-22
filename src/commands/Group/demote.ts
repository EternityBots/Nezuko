import { targetUser } from '../../lib/targets.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'demote',
	alias: ['dm'],
	desc: 'Turns an admin back into a member',
	usage: '%prefix%command @user (or reply to them)',
	category: 'Group',
	react: '✅',
	groupOnly: true,
	adminOnly: true,
	botAdmin: true,
	start: async (client, m, ctx) => {
		const user = targetUser(m, ctx)
		if (!user) return m.reply("❌ Couldn't find any user in context")
		await client.groupParticipantsUpdate(m.from, [user], 'demote')
		await m.reply(`Successfully demoted ${await client.getName(user)}`)
	}
})
