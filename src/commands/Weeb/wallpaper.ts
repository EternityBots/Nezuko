import { fetchJson } from '../../lib/http.js'
import { pickRandom } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'wallpaper',
	alias: ['animewallpaper'],
	desc: 'Anime wallpapers from Wallhaven (SFW only). Add #N for up to 5 results.',
	usage: '%prefix%command <query>[#count]',
	category: 'Weeb',
	react: '✅',
	cool: 5,
	start: async (client, m, { text }) => {
		const [query, countText] = text.split('#')
		if (!query?.trim()) return m.reply('No query found...')
		const count = Math.min(Math.max(Number.parseInt(countText ?? '1', 10) || 1, 1), 5)

		const { data } = await fetchJson(
			`https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query.trim())}&categories=010&purity=100&sorting=relevance`
		)
		const walls: { path: string }[] = data ?? []
		if (!walls.length) return m.reply(`No wallpapers found for *${query.trim()}*`)

		const picks = count === 1 ? [pickRandom(walls)] : walls.slice(0, count)
		for (const w of picks) await m.reply({ image: { url: w.path } })
	}
})
