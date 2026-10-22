import { effects } from '../../lib/effects.js'
import { targetUser } from '../../lib/targets.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'slap',
	desc: 'Slaps someone (Batman meme with both profile pictures)',
	usage: '%prefix%command @user (or reply to them)',
	category: 'Fun',
	react: '🎉',
	cool: 5,
	start: async (client, m, ctx) => {
		const user = targetUser(m, ctx)
		if (!user) return m.reply('*❄️ Tag someone*')
		const [me, them] = await Promise.all([client.getAvatar(m.sender), client.getAvatar(user)])
		await m.reply({ image: await effects.slap(me, them) })
	}
})
