import { isAnimatedWebp, webpToMp4, webpToPng } from '../../lib/media.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'toimg',
	alias: ['togif', 'tovid'],
	desc: 'Turns a sticker back into an image (or a GIF for animated stickers)',
	usage: 'Reply to a sticker with %prefix%command',
	category: 'Utils',
	react: '✅',
	cool: 5,
	start: async (client, m) => {
		if (!m.quoted || !/webp/.test(m.quoted.mimetype)) return m.reply("❌ Couldn't find any sticker in context")
		const sticker = await m.quoted.download()
		if (await isAnimatedWebp(sticker)) {
			await m.reply({ video: await webpToMp4(sticker), gifPlayback: true, caption: 'ETERNITY' })
		} else {
			await m.reply({ image: await webpToPng(sticker), caption: 'ETERNITY' })
		}
	}
})
