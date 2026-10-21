import { fetchJson } from '../../lib/http.js'
import { pickRandom } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

const IMAGES = [
	'https://images6.alphacoders.com/103/1037400.png',
	'https://images3.alphacoders.com/110/1105901.jpg',
	'https://images5.alphacoders.com/102/1028689.jpg',
	'https://images4.alphacoders.com/102/1029828.png',
	'https://images8.alphacoders.com/120/1206602.png'
]

export default defineCommand({
	name: 'repo',
	alias: ['nezuko', 'script'],
	desc: 'Details of the bot repository',
	category: 'General',
	react: '✅',
	start: async (client, m) => {
		const repo = await fetchJson('https://api.github.com/repos/EternityBots/Nezuko')
		const caption =
			`✨ _*🅽︎🅴︎🆉︎🆄︎🅺︎🅾︎*_ ✨\n\n🍀 *Description:* ${repo.description}\n\n📎 *Repo Link:* ${repo.html_url}\n\n` +
			`🌠 *Total Stars:* ${repo.stargazers_count}\n\n💕 *Total Forks:* ${repo.forks}\n\n💁🏻‍♂️ *Tutorial:* https://www.youtube.com/watch?v=KqgyScOlvV8`
		await m.reply({ image: { url: pickRandom(IMAGES) }, caption })
	}
})
