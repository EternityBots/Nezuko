import { makeSticker, type StickerShape } from '../../lib/sticker.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'sticker',
	alias: ['s'],
	desc: 'Makes a sticker from an image, GIF or short video. Flags: --crop, --circle, --stretch',
	usage: 'Send or reply to media with %prefix%command [--crop|--circle|--stretch] [pack|author]',
	category: 'Utils',
	react: '✅',
	cool: 3,
	start: async (client, m, { target, mime, flags, args }) => {
		if (!/image|video/.test(mime)) return m.reply('❌ Send or reply to an image/video')
		if (/video/.test(mime) && (target.msg?.seconds ?? 0) > 10) return m.reply('🕐 Videos must be 10 seconds or shorter')

		const shape: StickerShape = flags.some(f => /--c(rop(ped)?)?$/.test(f))
			? 'crop'
			: flags.includes('--circle')
				? 'circle'
				: flags.some(f => /--s(tretch(ed)?)?$/.test(f))
					? 'stretch'
					: 'full'
		const [pack = 'ETERNITY', author = m.pushName || ''] = args
			.filter(a => !a.startsWith('--'))
			.join(' ')
			.split('|')
			.map(s => s.trim())
			.map(s => s || undefined) as (string | undefined)[]

		const sticker = await makeSticker(await target.download(), { pack, author, shape })
		await m.reply({ sticker })
	}
})
