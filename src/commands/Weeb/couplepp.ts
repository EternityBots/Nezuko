import { fetchJson } from '../../lib/http.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'couplepp',
	alias: ['ppcouple'],
	desc: 'Matching couple profile pictures',
	category: 'Weeb',
	react: '💞',
	cool: 3,
	start: async (client, m) => {
		const data = await fetchJson<{ male: string; female: string }>('https://neko-couple-api.onrender.com').catch(() => null)
		if (!data?.male) return m.reply('The couple picture service is not responding right now, try again later')
		await m.reply({ image: { url: data.male }, caption: '_For Him..._' })
		await m.reply({ image: { url: data.female }, caption: '_For Her..._' })
	}
})
