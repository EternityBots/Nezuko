import { fetchBuffer } from '../../lib/http.js'
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
		const { buffer, mimetype, details } = await downloadAudio(getVideoId(link))
		await m.reply({
			audio: buffer,
			mimetype,
			fileName: `${details.title}.m4a`,
			contextInfo: {
				externalAdReply: {
					title: details.title,
					body: details.channel,
					thumbnail: await fetchBuffer(details.thumbnail).catch(() => undefined),
					mediaType: 2,
					sourceUrl: details.url
				}
			}
		})
	}
})
