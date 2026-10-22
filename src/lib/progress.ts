import type { WAMessageKey } from 'baileys'
import type { Client, Message } from '../types.js'
import type { DownloadProgress } from './ytdlp.js'

/** WhatsApp rate-limits edits, so update the message at most this often. */
const EDIT_INTERVAL_MS = 2500
const BAR_WIDTH = 12
const MIN_FIRST_EDIT_MS = 1000
/** Never let a slow edit hold up the command (and the file it is about to send). */
const EDIT_WAIT_MS = 5000

const withTimeout = <T>(promise: Promise<T>, ms: number) =>
	Promise.race([promise, new Promise<void>(resolve => setTimeout(resolve, ms).unref?.())])

const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1)

const bar = (ratio: number) => {
	const filled = Math.round(Math.min(Math.max(ratio, 0), 1) * BAR_WIDTH)
	return '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled)
}

const formatEta = (seconds: number) => (seconds >= 60 ? `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s` : `${Math.round(seconds)}s`)

const trackLabel = (track: 'video' | 'audio') => (track === 'audio' ? '🔊 Audio' : '🎞 Video')

const render = (title: string, p: DownloadProgress) => {
	if (p.stage === 'processing') return `${title}\n\n⚙️ Processing...`
	const label = trackLabel(p.track)
	if (!p.total) return `${title}\n\n${label}: ${mb(p.downloaded)} MB downloaded`
	const ratio = p.downloaded / p.total
	const details = [`${mb(p.downloaded)} / ${mb(p.total)} MB`]
	// Speed and time left are guesswork in the first moments of a download.
	if (ratio >= 0.02) {
		if (p.speed) details.push(`${mb(p.speed)} MB/s`)
		if (p.eta !== undefined && ratio < 1) details.push(`${formatEta(p.eta)} left`)
	}
	return `${title}\n\n${label}\n${bar(ratio)} ${Math.floor(ratio * 100)}%\n${details.join(' · ')}`
}

/**
 * Sends `title` as a reply, then edits that message in place to show download progress.
 * Pass `update` as the download's onProgress callback, then call `done` or `fail`.
 */
export const progressMessage = async (client: Client, m: Message, title: string) => {
	// yt-dlp spends ~10s fetching info before any bytes arrive, so say so up front.
	const firstText = `${title}\n\n🔎 Getting info...`
	const sent = await withTimeout(m.reply(firstText), EDIT_WAIT_MS).catch(() => undefined)
	const key: WAMessageKey | undefined = sent?.key
	let lastText = firstText
	let lastEdit = Date.now()
	let latest: DownloadProgress | null = null
	let timer: ReturnType<typeof setTimeout> | null = null
	let queue = Promise.resolve()
	let closed = false
	// Final size of each track, for the summary once the download is done.
	const sizes = new Map<'video' | 'audio', number>()

	const edit = (text: string) => {
		if (!key || text === lastText) return
		lastText = text
		lastEdit = Date.now()
		// Run edits one at a time so they arrive in order.
		queue = queue.then(() => withTimeout(client.sendMessage(m.from, { text, edit: key }), EDIT_WAIT_MS)).then(() => undefined, () => undefined)
	}

	const flush = () => {
		timer = null
		if (!closed && latest) edit(render(title, latest))
	}

	return {
		update(progress: DownloadProgress) {
			if (closed) return
			latest = progress
			if (progress.stage === 'download') sizes.set(progress.track, progress.total ?? progress.downloaded)
			// Wait at least a second after bytes start flowing, so the first bar isn't stuck at 0%.
			const wait = Math.max(EDIT_INTERVAL_MS - (Date.now() - lastEdit), MIN_FIRST_EDIT_MS)
			timer ??= setTimeout(flush, wait)
		},
		/** Download finished: show a full bar per track, then `text`. */
		async done(text: string) {
			closed = true
			if (timer) clearTimeout(timer)
			const summary = [...sizes].map(([track, size]) => `${trackLabel(track)}\n${bar(1)} 100% · ${mb(size)} MB`)
			edit([title, ...summary, text].join('\n\n'))
			await withTimeout(queue, EDIT_WAIT_MS)
		},
		/** Download failed: replace the progress with `text`. */
		async fail(text: string) {
			closed = true
			if (timer) clearTimeout(timer)
			edit(`${title}\n\n${text}`)
			await withTimeout(queue, EDIT_WAIT_MS)
		}
	}
}
