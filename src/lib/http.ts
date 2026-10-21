const UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'

export class HttpError extends Error {
	constructor(
		public status: number,
		url: string
	) {
		super(`Request to ${new URL(url).host} failed with status ${status}`)
	}
}

const request = async (url: string, init: RequestInit = {}, timeoutMs = 30_000) => {
	const res = await fetch(url, {
		...init,
		headers: { 'User-Agent': UA, ...(init.headers as Record<string, string> | undefined) },
		signal: init.signal ?? AbortSignal.timeout(timeoutMs)
	})
	if (!res.ok) throw new HttpError(res.status, url)
	return res
}

export const fetchJson = async <T = any>(url: string, init?: RequestInit): Promise<T> => (await request(url, init)).json() as Promise<T>

export const fetchText = async (url: string, init?: RequestInit): Promise<string> => (await request(url, init)).text()

export const fetchBuffer = async (url: string, init?: RequestInit, maxBytes = 100 * 1024 * 1024): Promise<Buffer> => {
	const res = await request(url, init, 120_000)
	const length = Number(res.headers.get('content-length') ?? 0)
	if (length > maxBytes) throw new Error(`File is too large (${(length / 1024 / 1024).toFixed(1)} MB)`)
	return Buffer.from(await res.arrayBuffer())
}

/** Read a web ReadableStream into a Buffer, failing once it passes `maxBytes`. */
export const streamToBuffer = async (stream: ReadableStream<Uint8Array>, maxBytes = 100 * 1024 * 1024): Promise<Buffer> => {
	const chunks: Uint8Array[] = []
	let size = 0
	const reader = stream.getReader()
	for (;;) {
		const { done, value } = await reader.read()
		if (done) break
		size += value.byteLength
		if (size > maxBytes) {
			await reader.cancel()
			throw new Error(`File is too large (over ${Math.round(maxBytes / 1024 / 1024)} MB)`)
		}
		chunks.push(value)
	}
	return Buffer.concat(chunks)
}
