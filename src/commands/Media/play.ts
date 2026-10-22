import { progressMessage } from '../../lib/progress.js'
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

		const progress = await progressMessage(client, m, `🎧 Downloading *${song.title}* by *${song.artists}*...`)
		const { buffer, mimetype } = await downloadAudio(song.id, { onProgress: p => progress.update(p) }).catch(async err => {
			await progress.fail('❌ Download failed')
			throw err
		})
		await progress.done('📤 Sending...')
		// Plain audio, no externalAdReply card: audio sent with one never showed up in chat.
		await m.reply({ audio: buffer, mimetype, fileName: `${song.title}.m4a` })
	}
})
