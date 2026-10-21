import { isSameUser } from '../../core/identity.js'
import { targetUser } from '../../lib/targets.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'remove',
	alias: ['boom'],
	desc: 'Removes a member from the group',
	usage: '%prefix%command @user (or reply to them)',
	category: 'Group',
	react: '✅',
	groupOnly: true,
	adminOnly: true,
	botAdmin: true,
	start: async (client, m, ctx) => {
		const user = targetUser(m, ctx)
		if (!user) return m.reply("❌ Couldn't find any user in context")
		if (isSameUser([user], [client.user?.id, client.user?.lid])) return m.reply("I can't remove myself, use leave instead")
		await client.groupParticipantsUpdate(m.from, [user], 'remove')
		await m.reply('Successfully removed')
	}
})
