import { getLyrics } from '../../lib/youtube.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'lyrics',
	alias: ['ly'],
	usage: '%prefix%command <song name>',
	desc: 'Finds the lyrics of a song (from YouTube Music)',
	category: 'Media',
	react: '🎶',
	cool: 5,
	start: async (client, m, { text }) => {
		if (!text) return m.reply('❌ No query provided!')
		const result = await getLyrics(text)
		if (!result) return m.reply(`Couldn't find lyrics for *${text}*`)
		const { song, lyrics, source } = result
		await m.reply(`*🎶 ${song.title}* — ${song.artists}\n\n${lyrics}${source ? `\n\n_${source}_` : ''}`)
	}
})
