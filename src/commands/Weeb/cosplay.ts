import { fetchBuffer } from '../../lib/http.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'cosplay',
	alias: ['cos'],
	desc: 'A random cosplay image',
	category: 'Weeb',
	react: '✅',
	cool: 3,
	start: async (client, m) => {
		const image = await fetchBuffer('https://cosplay-lovers-4pnv.onrender.com/cosplay').catch(() => null)
		if (!image) return m.reply('The cosplay service is not responding right now, try again later')
		await m.reply({ image })
	}
})
