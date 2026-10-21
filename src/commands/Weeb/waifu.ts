import { fetchJson } from '../../lib/http.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'waifu',
	alias: ['wife'],
	desc: 'Gives you a random waifu image',
	category: 'Weeb',
	react: '✅',
	cool: 3,
	start: async (client, m) => {
		const { url } = await fetchJson<{ url: string }>('https://api.waifu.pics/sfw/waifu')
		await m.reply({ image: { url }, caption: '*✈ Here you go*' })
	}
})
