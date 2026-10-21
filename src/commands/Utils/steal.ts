import { addStickerExif } from '../../lib/sticker.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'steal',
	alias: ['take'],
	desc: 'Re-brands a sticker with your own pack name and author',
	usage: 'Reply to a sticker with %prefix%command [pack|author]',
	category: 'Utils',
	react: '✅',
	cool: 3,
	start: async (client, m, { text }) => {
		if (!m.quoted || !/webp/.test(m.quoted.mimetype)) return m.reply('❌ Reply to a sticker')
		const [pack, author] = text.split('|').map(s => s.trim())
		const sticker = await addStickerExif(await m.quoted.download(), {
			pack: pack || 'ETERNITY',
			author: author || 'THE BEST IS YET TO BE'
		})
		await m.reply({ sticker })
	}
})
