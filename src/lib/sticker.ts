import webp from 'node-webpmux'
import sharp from 'sharp'
import { convert } from './ffmpeg.js'
import { detectType } from './media.js'

export type StickerShape = 'full' | 'crop' | 'circle' | 'stretch'

export interface StickerOptions {
	pack?: string
	author?: string
	shape?: StickerShape
	quality?: number
	emojis?: string[]
}

const SIZE = 512

const circleMask = Buffer.from(`<svg width="${SIZE}" height="${SIZE}"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="#fff"/></svg>`)

const imageToWebp = async (input: Buffer, shape: StickerShape, quality: number, animated: boolean) => {
	const fit = shape === 'stretch' ? 'fill' : shape === 'full' ? 'contain' : 'cover'
	let img = sharp(input, { animated }).resize(SIZE, SIZE, { fit, background: { r: 0, g: 0, b: 0, alpha: 0 } })
	if (shape === 'circle' && !animated) {
		img = sharp(await img.png().toBuffer()).composite([{ input: circleMask, blend: 'dest-in' }])
	}
	return img.webp({ quality, effort: 4 }).toBuffer()
}

const videoToWebp = (input: Buffer, ext: string, shape: StickerShape, quality: number) => {
	const scale =
		shape === 'stretch'
			? `scale=${SIZE}:${SIZE}`
			: shape === 'full'
				? `scale=${SIZE}:${SIZE}:force_original_aspect_ratio=decrease,pad=${SIZE}:${SIZE}:-1:-1:color=0x00000000`
				: `scale=${SIZE}:${SIZE}:force_original_aspect_ratio=increase,crop=${SIZE}:${SIZE}`
	return convert(input, ext, 'webp', (i, o) => [
		'-i',
		i,
		'-t',
		'10',
		'-vf',
		`fps=15,${scale}`,
		'-c:v',
		'libwebp',
		'-loop',
		'0',
		'-q:v',
		String(quality),
		'-preset',
		'default',
		'-an',
		'-fps_mode',
		'passthrough',
		o
	])
}

/** Write WhatsApp sticker metadata (pack name and author) into a WebP. */
export const addStickerExif = async (sticker: Buffer, { pack = '', author = '', emojis = ['🤩', '🎉'] }: StickerOptions) => {
	const json = {
		'sticker-pack-id': `nezuko-${Date.now()}`,
		'sticker-pack-name': pack,
		'sticker-pack-publisher': author,
		emojis
	}
	const header = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
	const body = Buffer.from(JSON.stringify(json), 'utf8')
	const exif = Buffer.concat([header, body])
	exif.writeUIntLE(body.length, 14, 4)

	const img = new webp.Image()
	await img.load(sticker)
	img.exif = exif
	return img.save(null)
}

/** Turn an image, GIF or short video into a WhatsApp sticker. */
export const makeSticker = async (input: Buffer, options: StickerOptions = {}) => {
	const shape = options.shape ?? 'full'
	const { ext, mime } = await detectType(input)
	let out: Buffer
	if (ext === 'webp' || ext === 'gif') {
		const animated = ((await sharp(input).metadata()).pages ?? 1) > 1
		out = await imageToWebp(input, shape, options.quality ?? (animated ? 50 : 80), animated)
	} else if (mime.startsWith('image/')) {
		out = await imageToWebp(input, shape, options.quality ?? 80, false)
	} else if (mime.startsWith('video/')) {
		out = await videoToWebp(input, ext, shape, options.quality ?? 40)
	} else {
		throw new Error(`Unsupported media type: ${mime}`)
	}
	return addStickerExif(out, options)
}
