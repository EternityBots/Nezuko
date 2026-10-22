import { fetchJson } from '../../lib/http.js'
import { isUrl } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'shorturl',
	alias: ['srurl', 'surl', 'short'],
	desc: 'Shortens a long URL',
	usage: '%prefix%command <url>',
	category: 'Utils',
	react: '✅',
	start: async (client, m, { args }) => {
		if (!args[0] || !isUrl(args[0])) return m.reply('Please provide a valid URL')
		const data = await fetchJson(`https://v.gd/create.php?format=json&url=${encodeURIComponent(args[0])}`)
		if (!data.shorturl) return m.reply(data.errormessage ?? 'Something went wrong')
		await m.reply(`🌐 *Your URL :* ${data.shorturl}`)
	}
})
