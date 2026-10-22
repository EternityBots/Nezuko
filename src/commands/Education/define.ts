import { fetchJson } from '../../lib/http.js'
import { defineCommand } from '../../types.js'

const clean = (s: string) => s.replace(/[[\]]/g, '')

export default defineCommand({
	name: 'define',
	alias: ['dictionary', 'urban'],
	desc: 'Meaning of a word (Urban Dictionary)',
	usage: '%prefix%command <word>',
	category: 'Education',
	react: '📖',
	start: async (client, m, { text }) => {
		if (!text) return m.reply('Please give me a word.')
		const data = await fetchJson(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(text)}`)
		const entry = data.list?.[0]
		if (!entry) return m.reply(`*${text}* isn't a valid word`)
		await m.reply(`*🔠 Word:* ${text}\n*📖 Definition:* ${clean(entry.definition)}\n*💭 Example:* ${clean(entry.example)}`)
	}
})
