import { instagramGetUrl } from 'instagram-url-direct'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'igdl',
	alias: ['instagram', 'insta'],
	usage: '%prefix%command <instagram post/reel link>',
	desc: 'Downloads Instagram posts and reels',
	category: 'Media',
	react: '✅',
	cool: 10,
	start: async (client, m, { args, prefix }) => {
		const url = args[0]
		if (!url) return m.reply(`❌ URL is empty!\nSend ${prefix}igdl <url>`)
		if (!/instagram\.com\/(p|reel|reels|tv)\//.test(url)) {
			return m.reply('❌ Wrong URL! Only Instagram posts, reels and TV videos can be downloaded.')
		}

		const result = await instagramGetUrl(url.split('?')[0]).catch(() => null)
		const media = result?.media_details ?? []
		if (!media.length) return m.reply('Error: the post is private or was not found')

		for (const item of media.slice(0, 10)) {
			await m.reply(item.type === 'video' ? { video: { url: item.url } } : { image: { url: item.url } })
		}
	}
})
