import { canonicalId } from '../../core/identity.js'
import { levels } from '../../db/levels.js'
import { targetUser } from '../../lib/targets.js'
import { profileRole, userPart } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'profile',
	alias: ['p'],
	desc: 'Shows your profile (mods can view others by tagging them)',
	usage: '%prefix%command [@user]',
	category: 'General',
	react: '✅',
	cool: 5,
	start: async (client, m, ctx) => {
		const { isAdmin, groupName } = ctx
		const other = ctx.isOwner ? targetUser(m, ctx) : undefined
		const jid = other ?? m.sender
		const pn = other ? await client.toPn(other) : m.senderPn
		const id = canonicalId(pn, jid)

		const stats = await levels.fetch(id)
		const name = other ? await client.getName(jid) : m.pushName || (await client.getName(jid))
		const status = await client
			.fetchStatus(pn ?? jid)
			.then(r => (r?.[0]?.status as { status?: string } | undefined)?.status)
			.catch(() => undefined)

		let caption = `*🪪 Name*: ${name}\n\n*🍥 Number*: ${userPart(pn ?? jid)}\n\n*🎌 Bio*: ${status || 'None'}\n\n`
		caption += `*🎯 XP*: ${stats.xp} / ${levels.xpFor(stats.level + 1)}\n\n*🔮 Level*: ${stats.level}\n\n*🏮 Role*: ${profileRole(stats.level)}\n`
		if (groupName) caption += `\n*🌊 Group*: ${groupName}\n`
		if (!other && isAdmin) caption += `*〽️ Admin*: true\n`

		await m.reply({ image: await client.getAvatar(jid), caption })
	}
})
