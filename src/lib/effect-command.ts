import { makeSticker } from './sticker.js'
import { targetOrSelf } from './targets.js'
import { defineCommand, type Command } from '../types.js'

interface EffectOptions {
	name: string
	alias?: string[]
	desc: string
	effect: (avatar: Buffer) => Promise<Buffer>
	/** Send as a sticker instead of an image. */
	asSticker?: string
}

/** A Fun command that applies an image effect to a tagged/quoted user's profile picture (or yours). */
export const effectCommand = ({ name, alias, desc, effect, asSticker }: EffectOptions): Command =>
	defineCommand({
		name,
		alias,
		desc,
		usage: '%prefix%command [@user or reply]',
		category: 'Fun',
		react: '🎉',
		cool: 5,
		start: async (client, m, ctx) => {
			const avatar = await client.getAvatar(targetOrSelf(m, ctx))
			const image = await effect(avatar)
			if (asSticker) {
				await m.reply({ sticker: await makeSticker(image, { pack: asSticker, shape: 'full' }) })
			} else {
				await m.reply({ image })
			}
		}
	})
