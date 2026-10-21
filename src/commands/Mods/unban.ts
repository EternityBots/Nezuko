import { canonicalId } from '../../core/identity.js'
import { settings } from '../../db/settings.js'
import { targetUser } from '../../lib/targets.js'
import { userPart } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'unban',
	desc: 'Lets a banned user use commands again',
	usage: '%prefix%command @user',
	category: 'Mods',
	react: '✅',
	ownerOnly: true,
	start: async (client, m, ctx) => {
		const user = targetUser(m, ctx)
		if (!user) return m.reply("❌ Couldn't find any user in context")
		const id = canonicalId(await client.toPn(user), user)
		const removed = await settings.remove('ban', id)
		await m.reply({
			text: removed ? `Successfully unbanned @${userPart(user)}` : `@${userPart(user)} is not banned`,
			mentions: [user]
		})
	}
})
