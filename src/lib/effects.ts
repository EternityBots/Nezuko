import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas'
import { canvacord, Fonts } from 'canvacord'

/**
 * Image effects for the Fun commands. All but "wasted" come from canvacord;
 * canvacord's own wasted template crashes the process (upstream bug), so it is drawn here.
 */

let fontReady = false
const ensureFont = () => {
	if (!fontReady) {
		GlobalFonts.register(Fonts.Geist, 'Geist')
		fontReady = true
	}
}

const wasted = async (image: Buffer) => {
	ensureFont()
	const img = await loadImage(image)
	const size = 512
	const canvas = createCanvas(size, size)
	const ctx = canvas.getContext('2d')
	ctx.filter = 'grayscale(100%)'
	ctx.drawImage(img, 0, 0, size, size)
	ctx.filter = 'none'
	ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
	ctx.fillRect(0, size / 2 - 60, size, 120)
	ctx.fillStyle = '#c0101a'
	ctx.font = 'bold 96px Geist'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillText('WASTED', size / 2, size / 2 + 4)
	return canvas.encode('png')
}

export const effects = {
	hitler: (img: Buffer) => canvacord.hitler(img),
	rainbow: (img: Buffer) => canvacord.rainbow(img),
	rip: (img: Buffer) => canvacord.rip(img),
	trash: (img: Buffer) => canvacord.trash(img),
	wanted: (img: Buffer) => canvacord.wanted(img),
	shit: (img: Buffer) => canvacord.shit(img),
	sepia: async (img: Buffer) => {
		const { width, height } = await loadImage(img)
		return canvacord.filters(width, height).drawImage(img).sepia(100).encode()
	},
	/** Returns an animated GIF. */
	triggered: (img: Buffer) => canvacord.triggered(img, true),
	slap: (from: Buffer, to: Buffer) => canvacord.slap(from, to),
	wasted
}
