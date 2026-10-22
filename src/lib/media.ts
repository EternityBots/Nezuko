import { fileTypeFromBuffer } from 'file-type'
import sharp from 'sharp'
import { convert } from './ffmpeg.js'

export const detectType = async (buffer: Buffer) => (await fileTypeFromBuffer(buffer)) ?? { ext: 'bin', mime: 'application/octet-stream' }

/** GIF (or any short clip) to an MP4 WhatsApp can play as a GIF. */
export const gifToMp4 = (gif: Buffer) =>
	convert(gif, 'gif', 'mp4', (i, o) => [
		'-i',
		i,
		'-movflags',
		'faststart',
		'-pix_fmt',
		'yuv420p',
		'-vf',
		'scale=trunc(iw/2)*2:trunc(ih/2)*2',
		'-an',
		o
	])

export const isAnimatedWebp = async (webp: Buffer) => ((await sharp(webp).metadata()).pages ?? 1) > 1

/** Static sticker to PNG. */
export const webpToPng = (webp: Buffer) => sharp(webp).png().toBuffer()

/** Animated sticker to MP4 (via GIF, because ffmpeg can't decode animated WebP). */
export const webpToMp4 = async (webp: Buffer) => {
	const gif = await sharp(webp, { animated: true }).gif().toBuffer()
	return gifToMp4(gif)
}
