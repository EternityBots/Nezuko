/**
 * Checks which YouTube clients can download a video from this machine.
 * It runs the bot's real audio download (the whole file) with each client,
 * so a ✓ here means `yta`/`play` will work with that client.
 *
 * Usage: bun run yt-check <youtube link or id>
 */
import { config } from '../config.js'
import { formatBytes } from '../lib/utils.js'
import { downloadAudio, ensurePoToken, getVideoId, streamClients } from '../lib/youtube.js'
import { ytdlpAudio, ytdlpVersion } from '../lib/ytdlp.js'

const CLIENTS = ['MWEB', 'WEB_EMBEDDED', 'IOS', 'ANDROID_VR', 'TV'] as const

const input = process.argv[2]
if (!input) {
	console.log('Usage: bun run yt-check <youtube link or id>')
	process.exit(1)
}

// Per-client failures are printed below; silence the bot's own warnings.
console.warn = () => {}

const id = getVideoId(input)
console.log(`Video: ${id}`)
console.log(`Cookie: ${config.youtubeCookie ? 'set' : 'not set'}`)
const token = await ensurePoToken()
console.log(
	`PO token: ${token.source === 'manual' ? 'from YT_PO_TOKEN' : token.source === 'auto' ? 'generated automatically ✓' : `none${token.error ? ` (generation failed: ${token.error})` : ''}`}`
)
console.log(`The bot will try: ${streamClients().join(', ')}\n`)

const working: string[] = []
for (const client of CLIENTS) {
	const started = Date.now()
	try {
		const { buffer } = await downloadAudio(id, { clients: [client] })
		console.log(`${client.padEnd(13)} ✓ full audio downloaded (${formatBytes(buffer.length)}, ${((Date.now() - started) / 1000).toFixed(1)}s)`)
		working.push(client)
	} catch (err) {
		console.log(`${client.padEnd(13)} ✗ ${err instanceof Error ? err.message : err}`)
	}
}

// yt-dlp fallback
const version = await ytdlpVersion()
let ytdlpWorks = false
if (!version) {
	console.log(`${'yt-dlp'.padEnd(13)} – not installed (optional fallback, see README)`)
} else {
	const started = Date.now()
	try {
		const { buffer } = await ytdlpAudio(id)
		console.log(`${'yt-dlp'.padEnd(13)} ✓ full audio downloaded (${formatBytes(buffer.length)}, ${((Date.now() - started) / 1000).toFixed(1)}s) [v${version}]`)
		ytdlpWorks = true
	} catch (err) {
		console.log(`${'yt-dlp'.padEnd(13)} ✗ ${err instanceof Error ? err.message : err} [v${version}]`)
	}
}

console.log('')
if (working.length) {
	console.log(`Working youtubei.js clients: ${working.join(', ')}`)
	console.log(`Put this in .env: YT_CLIENTS=${working.join(',')}`)
} else if (ytdlpWorks) {
	console.log('youtubei.js is blocked here, but yt-dlp works. The bot falls back to it automatically.')
	console.log('To skip the failing youtubei.js attempts, put this in .env: YT_DOWNLOADER=yt-dlp')
} else {
	console.log('Nothing could download this video from this machine.')
	if (!version) console.log('Next step: install yt-dlp (see README) and run this again.')
	else console.log('Next step: update with "yt-dlp -U" and "bun update youtubei.js bgutils-js", or send the output above.')
}
process.exit(0)
