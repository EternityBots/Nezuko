import { fetchJson } from '../../lib/http.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'anime',
	alias: ['ani'],
	desc: 'Details of an anime (MyAnimeList via Jikan, no account needed)',
	usage: '%prefix%command <anime name>',
	category: 'Weeb',
	react: '✅',
	cool: 3,
	start: async (client, m, { text }) => {
		if (!text) return m.reply('❌ No query provided!')
		const { data } = await fetchJson(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=1&sfw=true`)
		const a = data?.[0]
		if (!a) return m.reply(`*${text}* is not a valid anime`)

		let caption = `🎀 *Title: ${a.title}*\n`
		if (a.title_english && a.title_english !== a.title) caption += `🌐 *English: ${a.title_english}*\n`
		caption += `🎋 *Format: ${a.type ?? 'Unknown'}*\n📈 *Status: ${a.status ?? 'Unknown'}*\n🍥 *Total episodes: ${a.episodes ?? '?'}*\n`
		caption += `🧧 *Genres:* ${(a.genres ?? []).map((g: { name: string }) => g.name).join(', ') || 'None'}\n`
		caption += `✨ *Based on: ${a.source ?? 'Unknown'}*\n📍 *Studios:* ${(a.studios ?? []).map((s: { name: string }) => s.name).join(', ') || 'Unknown'}\n`
		caption += `💫 *Aired: ${a.aired?.string ?? 'Unknown'}*\n🎐 *Popularity: #${a.popularity ?? '?'}*\n🏅 *Rank: #${a.rank ?? '?'}*\n⭐ *Score: ${a.score ?? '?'}*\n\n`
		caption += `🌐 *URL: ${a.url}*\n\n❄ *Description:* ${(a.synopsis ?? 'No synopsis').replace(/\[Written by MAL Rewrite]/g, '').trim()}`
		await m.reply({ image: { url: a.images?.jpg?.large_image_url ?? a.images?.jpg?.image_url }, caption })
	}
})
