import { progressMessage } from '../../lib/progress.js'
import { downloadVideo, getVideoId, isYouTubeUrl } from '../../lib/youtube.js'
import { formatBytes, formatDuration } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'ytv',
	alias: ['ytmp4'],
	usage: '%prefix%command <youtube link>',
	desc: 'Downloads the video from a YouTube link',
	category: 'Media',
	react: '🎞',
	cool: 15,
	start: async (client, m, { args }) => {
		const link = args[0]
		if (!link || !isYouTubeUrl(link)) return m.reply('Where is the YouTube link?')
		const progress = await progressMessage(client, m, '⏳ Downloading, this can take a minute...')
		const { buffer, quality, details } = await downloadVideo(getVideoId(link), { onProgress: p => progress.update(p) }).catch(async err => {
			await progress.fail('❌ Download failed')
			throw err
		})
		await progress.done('📤 Sending...')
		const caption =
			`*🎬 Title:* ${details.title}\n*📺 Channel:* ${details.channel}\n` +
			(details.published ? `*📅 Date:* ${details.published}\n` : '') +
			`*⏱️ Duration:* ${formatDuration(details.seconds)}\n*🎞 Quality:* ${quality}\n*📦 Size:* ${formatBytes(buffer.length)}`
		await m.reply({ video: buffer, mimetype: 'video/mp4', caption })
	}
})
