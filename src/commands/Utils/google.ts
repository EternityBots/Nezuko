import { config } from '../../config.js'
import { fetchJson } from '../../lib/http.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'google',
	alias: ['g'],
	desc: 'Search results from Google',
	usage: '%prefix%command <query>',
	category: 'Utils',
	react: '✅',
	cool: 20,
	start: async (client, m, { text }) => {
		if (!text) return m.reply('Please give me something to search')
		if (!config.googleApiKey) return m.reply('*❤️ Ask the owner to set GOOGLE_API*')
		const data = await fetchJson(
			`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(text)}&key=${config.googleApiKey}&cx=${config.googleCx}`
		)
		const items: { title: string; link: string; snippet: string }[] = data.items ?? []
		if (!items.length) return m.reply(`No results for *${text}*`)
		const result = items.map(i => `*📒 Title* : ${i.title}\n*🔗 Link* : ${i.link}\n*🎯 Description* : ${i.snippet}`).join('\n\n')
		await m.reply({ image: { url: 'https://i.ibb.co/26d2K4d/kindpng-209846.png' }, caption: result })
	}
})
