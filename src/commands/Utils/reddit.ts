import { fetchJson } from '../../lib/http.js'
import { pickRandom } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

interface Post {
	title: string
	url: string
	over_18: boolean
	post_hint?: string
	permalink: string
}

export default defineCommand({
	name: 'reddit',
	alias: ['sr', 're', 'subreddit'],
	desc: 'Sends a random image from a subreddit (NSFW posts only in groups with nsfw enabled)',
	usage: '%prefix%command <subreddit>',
	category: 'Utils',
	react: '✅',
	cool: 5,
	start: async (client, m, { args, settings }) => {
		const sub = args[0]?.replace(/^\/?r\//i, '')
		if (!sub || !/^\w{2,21}$/.test(sub)) return m.reply('*Please give me a subreddit name*')

		const data = await fetchJson(`https://www.reddit.com/r/${sub}/hot.json?limit=50&raw_json=1`).catch(() => null)
		const posts: Post[] = (data?.data?.children ?? []).map((c: { data: Post }) => c.data)
		const images = posts.filter(p => (p.post_hint === 'image' || /\.(jpe?g|png|gif)$/i.test(p.url)) && (settings.nsfw || !p.over_18))
		if (!images.length) {
			return m.reply(settings.nsfw ? "*⚠ That subreddit isn't valid or has no images*" : "*⚠ Either it's an NSFW subreddit or it isn't valid*")
		}
		const post = pickRandom(images)
		await m.reply({ image: { url: post.url }, caption: `*${post.title}*\nhttps://reddit.com${post.permalink}` })
	}
})
