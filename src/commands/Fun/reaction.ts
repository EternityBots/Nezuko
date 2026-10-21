import { fetchBuffer, fetchJson } from '../../lib/http.js'
import { gifToMp4 } from '../../lib/media.js'
import { targetUser } from '../../lib/targets.js'
import { capitalize, userPart } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

const WORDS: Record<string, string> = {
	bite: 'Bit', blush: 'Blushed at', bonk: 'Bonked', bully: 'Bullied', cringe: 'Cringed at', cry: 'Cried in front of',
	cuddle: 'Cuddled', dance: 'Danced with', glomp: 'Glomped at', handhold: 'Held the hands of', happy: 'is Happy with',
	highfive: 'High-fived', hug: 'Hugged', kick: 'Kicked', kill: 'Killed', kiss: 'Kissed', lick: 'Licked', nom: 'Nomed',
	pat: 'Patted', poke: 'Poked', slap: 'Slapped', smile: 'Smiled at', smug: 'Smugged', wave: 'Waved at', wink: 'Winked at',
	yeet: 'Yeeted at'
}
const REACTIONS = Object.keys(WORDS)

export default defineCommand({
	name: 'reaction',
	alias: ['r', ...REACTIONS],
	desc: "React to someone with an anime GIF (e.g. %prefix%pat @user)",
	usage: '%prefix%reaction <reaction> [@user] or %prefix%<reaction> [@user]',
	category: 'Fun',
	react: '😗',
	cool: 3,
	start: async (client, m, ctx) => {
		const { command, args, prefix } = ctx
		const direct = command !== 'r' && command !== 'reaction'
		const reaction = direct ? command : args[0]?.toLowerCase()
		if (!reaction) {
			return m.reply(
				`🎃 *Available Reactions:*\n\n- ${REACTIONS.map(capitalize).join('\n- ')}\n\n🛠️ *Usage:* ${prefix}reaction <reaction> [tag/quote user] | ${prefix}<reaction> [tag/quote user]\nExample: ${prefix}pat`
			)
		}
		if (!WORDS[reaction]) return m.reply(`Invalid reaction. Use *${prefix}reaction* to see all of them`)

		const target = targetUser(m, ctx) ?? m.sender
		const self = target === m.sender
		const { url } = await fetchJson<{ url: string }>(`https://api.waifu.pics/sfw/${reaction}`)
		const video = await gifToMp4(await fetchBuffer(url))
		await m.reply({
			video,
			gifPlayback: true,
			caption: `*@${userPart(m.sender)} ${WORDS[reaction]} ${self ? 'Themselves' : `@${userPart(target)}`}*`,
			mentions: [m.sender, target]
		})
	}
})
