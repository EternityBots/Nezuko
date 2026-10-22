import { describe, expect, test } from 'bun:test'
import webp from 'node-webpmux'
import sharp from 'sharp'
import { effects } from '../src/lib/effects.ts'
import { readFile } from 'node:fs/promises'
import { runFfmpeg, tempFile } from '../src/lib/ffmpeg.ts'
import { gifToMp4, isAnimatedWebp, webpToMp4, webpToPng } from '../src/lib/media.ts'
import { makeSticker } from '../src/lib/sticker.ts'
import { getVideoId, isYouTubeUrl } from '../src/lib/youtube.ts'

const png = await sharp({ create: { width: 300, height: 200, channels: 4, background: '#e0457b' } }).png().toBuffer()
/** A short clip with real motion, made by ffmpeg's built-in test source. */
const testClip = async (ext: 'mp4' | 'gif') => {
	const out = await tempFile(ext)
	await runFfmpeg(['-f', 'lavfi', '-i', 'testsrc=size=320x240:rate=10', '-t', '1', ...(ext === 'mp4' ? ['-pix_fmt', 'yuv420p'] : []), out])
	return readFile(out)
}
const mp4 = await testClip('mp4')
const gif = await testClip('gif')

const exifOf = async (buf: Buffer) => {
	const img = new webp.Image()
	await img.load(buf)
	return JSON.parse(img.exif!.subarray(22).toString())
}

describe('stickers', () => {
	test('image -> 512x512 WebP with pack metadata', async () => {
		for (const shape of ['full', 'crop', 'circle', 'stretch'] as const) {
			const sticker = await makeSticker(png, { pack: 'Pack', author: 'Me', shape })
			const meta = await sharp(sticker).metadata()
			expect(meta.format).toBe('webp')
			expect([meta.width, meta.height]).toEqual([512, 512])
		}
		const exif = await exifOf(await makeSticker(png, { pack: 'Pack', author: 'Me' }))
		expect(exif['sticker-pack-name']).toBe('Pack')
		expect(exif['sticker-pack-publisher']).toBe('Me')
	}, 30_000)

	test('video and GIF -> animated WebP sticker', async () => {
		for (const input of [mp4, gif]) {
			const sticker = await makeSticker(input)
			expect(await isAnimatedWebp(sticker)).toBe(true)
		}
	}, 30_000)

	test('sticker -> image / video', async () => {
		const still = await makeSticker(png)
		expect((await sharp(await webpToPng(still)).metadata()).format).toBe('png')
		const animated = await makeSticker(gif)
		const video = await webpToMp4(animated)
		expect(video.subarray(4, 8).toString()).toBe('ftyp')
		expect((await gifToMp4(gif)).subarray(4, 8).toString()).toBe('ftyp')
	}, 30_000)
})

describe('image effects', () => {
	test('every effect renders', async () => {
		for (const name of ['hitler', 'rainbow', 'rip', 'trash', 'wanted', 'shit', 'sepia', 'wasted', 'triggered'] as const) {
			const out = await effects[name](png)
			expect(out.length).toBeGreaterThan(100)
		}
		expect((await effects.slap(png, png)).length).toBeGreaterThan(100)
	}, 60_000)
})

describe('youtube links', () => {
	test('extracts video ids', () => {
		const id = 'dQw4w9WgXcQ'
		for (const url of [
			`https://www.youtube.com/watch?v=${id}`,
			`https://youtu.be/${id}?si=abc`,
			`https://youtube.com/shorts/${id}`,
			`https://music.youtube.com/watch?v=${id}&list=RD`,
			`https://www.youtube.com/watch?feature=share&v=${id}`,
			id
		]) {
			expect(getVideoId(url)).toBe(id)
		}
		expect(isYouTubeUrl('https://example.com')).toBe(false)
		expect(() => getVideoId('not a link')).toThrow()
	}, 30_000)
})
