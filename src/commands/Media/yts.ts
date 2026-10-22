import { search } from '../../lib/youtube.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'yts',
	alias: ['ytsearch'],
	usage: '%prefix%command <query>',
	desc: 'Searches videos on YouTube',
	category: 'Media',
	react: '✅',
	cool: 5,
	start: async (client, m, { text }) => {
		if (!text) return m.reply('What do you want to search?')
		const results = await search(text, 10)
		if (!results.length) return m.reply(`No results for *${text}*`)

		let caption = `*━━『 📽️ YouTube Search 📽️』━━*\n\n *📮 Results for*: ${text}\n\n`
		results.forEach((v, i) => {
			caption +=
				`*📓 No :* ${i + 1}\n*🎯 Title :* ${v.title}\n*📺 Channel :* ${v.channel}\n` +
				`*🌸 Views :* ${v.views}\n*🎗️ Duration :* ${v.duration}\n*🍁 Uploaded :* ${v.published}\n*🌐 Url :* ${v.url}\n\n` +
				` *---------------------------------------* \n\n`
		})
		await m.reply({ image: { url: results[0].thumbnail }, caption })
	}
})
