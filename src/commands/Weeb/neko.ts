import { fetchJson } from '../../lib/http.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'neko',
	alias: ['nyaa', 'cat', 'nya'],
	desc: 'Gives you a random neko image',
	category: 'Weeb',
	react: '✅',
	cool: 3,
	start: async (client, m) => {
		const { url } = await fetchJson<{ url: string }>('https://api.waifu.pics/sfw/neko')
		await m.reply({ image: { url }, caption: '*Nyaa*' })
	}
})
