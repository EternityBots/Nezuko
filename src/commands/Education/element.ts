import { fetchJson } from '../../lib/http.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'element',
	alias: ['e'],
	desc: 'Information about a chemical element',
	usage: '%prefix%command <name | number | symbol>',
	category: 'Education',
	react: '🧪',
	start: async (client, m, { text }) => {
		if (!text) return m.reply('*Please give me an element name*')
		const e = await fetchJson(`https://api.popcat.xyz/periodic-table?element=${encodeURIComponent(text)}`).catch(() => null)
		if (!e?.name) return m.reply(`*${text}* isn't a valid element.`)
		const caption =
			`🔴 *Element:* ${e.name}\n⬜ *Atomic Number:* ${e.atomic_number}\n🟡 *Atomic Mass:* ${e.atomic_mass}\n` +
			`⬛ *Symbol:* ${e.symbol}\n*📖 Summary:* ${e.summary}`
		await m.reply(e.image ? { image: { url: e.image }, caption } : { text: caption })
	}
})
