import { fetchBuffer } from '../../lib/http.js'
import { downloadVideo, search } from '../../lib/youtube.js'
import { formatBytes, formatDuration } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'playv',
	alias: ['video'],
	usage: '%prefix%command <query>',
	desc: 'Searches YouTube and sends the first video',
	category: 'Media',
	react: '📼',
	cool: 15,
	start: async (client, m, { text }) => {
		if (!text) return m.reply('What do you want to play?')
		const [first] = await search(text, 1)
		if (!first) return m.reply(`Couldn't find *${text}*`)

		await m.reply(`⏳ Downloading *${first.title}*...`)
		const { buffer, quality, details } = await downloadVideo(first.id)
		const caption =
			`*🎬 Title:* ${details.title}\n*📺 Channel:* ${details.channel}\n*⏱️ Duration:* ${formatDuration(details.seconds)}\n` +
			`*🎞 Quality:* ${quality}\n*📦 Size:* ${formatBytes(buffer.length)}\n*📝 Description:* ${details.description.slice(0, 300)}`
		await m.reply({
			document: buffer,
			mimetype: 'video/mp4',
			fileName: `${details.title}.mp4`,
			caption,
			contextInfo: {
				externalAdReply: {
					title: details.title,
					body: details.channel,
					thumbnail: await fetchBuffer(first.thumbnail).catch(() => undefined),
					mediaType: 2,
					sourceUrl: details.url
				}
			}
		})
	}
})
