import { fetchJson } from '../../lib/http.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'manga',
	alias: ['comic', 'mnga'],
	desc: 'Details of a manga (MyAnimeList via Jikan, no account needed)',
	usage: '%prefix%command <manga name>',
	category: 'Weeb',
	react: '✅',
	cool: 3,
	start: async (client, m, { text }) => {
		if (!text) return m.reply('❌ No query provided!')
		const { data } = await fetchJson(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(text)}&limit=1&sfw=true`)
		const x = data?.[0]
		if (!x) return m.reply(`*${text}* is not a valid manga`)

		const authors = (x.authors ?? []).map((a: { name: string }) => a.name).join(', ') || 'Unknown'
		let caption = `🎀 *Title: ${x.title}*\n📈 *Status: ${x.status ?? 'Unknown'}*\n🌸 *Total Volumes: ${x.volumes ?? '?'}*\n`
		caption += `🎗 *Total Chapters: ${x.chapters ?? '?'}*\n✨ *Published: ${x.published?.string ?? 'Unknown'}*\n🌟 *Score: ${x.score ?? '?'}*\n`
		caption += `✍ *Author: ${authors}*\n\n🌐 *MyAnimeList URL: ${x.url}*\n\n`
		caption += `❄️ *Description:* ${(x.synopsis ?? 'No synopsis').replace(/\[Written by MAL Rewrite]/g, '').trim()}`
		await m.reply({ image: { url: x.images?.jpg?.large_image_url ?? x.images?.jpg?.image_url }, caption })
	}
})
