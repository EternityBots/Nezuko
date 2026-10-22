declare module 'node-webpmux' {
	class Image {
		exif: Buffer | null
		load(source: string | Buffer): Promise<void>
		save(path: string | null): Promise<Buffer>
	}
	const webp: { Image: typeof Image }
	export default webp
}
