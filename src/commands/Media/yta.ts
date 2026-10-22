import { progressMessage } from '../../lib/progress.js'
import { downloadAudio, getVideoId, isYouTubeUrl } from '../../lib/youtube.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'yta',
	alias: ['ytmp3'],
	usage: '%prefix%command <youtube link>',
	desc: 'Downloads the audio from a YouTube link',
	category: 'Media',
	react: '📀',
	cool: 10,
	start: async (client, m, { args }) => {
		const link = args[0]
		if (!link || !isYouTubeUrl(link)) return m.reply('Where is the YouTube link?')
		const progress = await progressMessage(client, m, '⏳ Downloading audio...')
		const { buffer, mimetype, details } = await downloadAudio(getVideoId(link), { onProgress: p => progress.update(p) }).catch(async err => {
			await progress.fail('❌ Download failed')
			throw err
		})
		await progress.done(`🎵 *${details.title}*\n📺 ${details.channel}\n\n📤 Sending...`)
		// Plain audio, no externalAdReply card: audio sent with one never showed up in chat.
		await m.reply({ audio: buffer, mimetype, fileName: `${details.title}.m4a` })
	}
})
