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
		const { items } = await fetchJson<{ items: { url: string }[] }>('https://api.waifu.im/images?IncludedTags=waifu')
		const url = items?.[0]?.url
		if (!url) throw new Error('No waifu image found')
		await m.reply({ image: { url }, caption: '*✈ Here you go*' })
	}
})
