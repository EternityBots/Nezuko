import { fetchBuffer } from '../../lib/http.js'
import { downloadAudio, searchSong } from '../../lib/youtube.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'play',
	alias: ['song'],
	usage: '%prefix%command <song name>',
	desc: 'Finds a song on YouTube Music and sends the audio',
	category: 'Media',
	react: '🎵',
	cool: 10,
	start: async (client, m, { text }) => {
		if (!text) return m.reply('What do you want to play?')
		const song = await searchSong(text)
		if (!song) return m.reply(`Couldn't find *${text}*`)

		await m.reply(`🎧 Downloading *${song.title}* by *${song.artists}*...`)
		const { buffer, mimetype } = await downloadAudio(song.id)
		await m.reply({
			audio: buffer,
			mimetype,
			fileName: `${song.title}.m4a`,
			contextInfo: {
				externalAdReply: {
					title: song.title,
					body: song.artists,
					thumbnail: await fetchBuffer(song.thumbnail).catch(() => undefined),
					mediaType: 2,
					sourceUrl: song.url
				}
			}
		})
	}
})
