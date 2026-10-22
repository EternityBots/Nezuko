import { Font, RankCardBuilder } from 'canvacord'
import { canonicalId } from '../../core/identity.js'
import { levels } from '../../db/levels.js'
import { rankRole, userPart } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

let fontLoaded = false

export default defineCommand({
	name: 'rank',
	desc: 'Shows your rank card',
	category: 'General',
	react: '✅',
	cool: 5,
	start: async (client, m) => {
		const id = canonicalId(m.senderPn, m.sender)
		const stats = await levels.fetch(id)
		const role = rankRole(stats.level)
		const name = m.pushName || userPart(id)
		const tag = userPart(id).slice(-4)

		if (!fontLoaded) {
			Font.loadDefault()
			fontLoaded = true
		}
		const card = (await new RankCardBuilder()
			.setAvatar(await client.getAvatar(m.sender))
			.setDisplayName(name)
			.setUsername(`#${tag} • ${role}`)
			.setLevel(stats.level)
			.setCurrentXP(stats.xp)
			.setRequiredXP(levels.xpFor(stats.level + 1))
			.setStatus('online')
			.build({ format: 'png' })) as Buffer

		const caption = `*${name}#${tag}'s* Exp\n\n*🎯️ XP*: ${stats.xp} / ${levels.xpFor(stats.level + 1)}\n*❤️ Level*: ${stats.level}\n*🔮️ Role*: ${role}`
		await m.reply({ image: card, caption })
	}
})
