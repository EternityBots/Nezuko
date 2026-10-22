import { config as loadEnv } from 'dotenv'

// Bun loads .env on its own; Node needs dotenv. Calling it under Bun is harmless.
loadEnv({ quiet: true })

const env = (name: string): string | undefined => {
	const value = process.env[name]?.trim()
	return value ? value : undefined
}

const int = (name: string, fallback: number): number => {
	const parsed = Number.parseInt(env(name) ?? '', 10)
	return Number.isFinite(parsed) ? parsed : fallback
}

/** Phone numbers (digits only, with country code) of the bot owners. */
const owners = (env('MODS') ?? '')
	.split(',')
	.map(n => n.replace(/[^0-9]/g, ''))
	.filter(Boolean)

export const config = {
	owners,
	mongodb: env('MONGODB'),
	prefix: env('PREFIX') ?? '.',
	sessionId: env('SESSION_ID') ?? 'NEZUKO',
	port: int('PORT', 8080),
	logLevel: env('LOG_LEVEL') ?? 'silent',

	/** If set, link with an 8-digit pairing code instead of a QR code. */
	pairingNumber: env('PAIRING_NUMBER')?.replace(/[^0-9]/g, ''),

	googleApiKey: env('GOOGLE_API'),
	googleCx: env('GOOGLE_CX') ?? 'baf9bdb0c631236e5',
	weatherApiKey: env('WEATHER_API'),
	spotifyClientId: env('SPOTIFY_CLIENT_ID'),
	spotifyClientSecret: env('SPOTIFY_CLIENT_SECRET'),

	/** Optional YouTube cookie string for signed-in requests (use a throwaway account). */
	youtubeCookie: env('YT_COOKIE'),
	/** Optional Proof-of-Origin token for YouTube streaming. */
	youtubePoToken: env('YT_PO_TOKEN'),
	/** Generate PO tokens automatically with BotGuard (on unless YT_AUTO_PO_TOKEN=false or YT_COOKIE is set). */
	youtubeAutoPoToken: env('YT_AUTO_PO_TOKEN') !== 'false' && !env('YT_COOKIE') && !env('YT_PO_TOKEN'),
	/** auto: yt-dlp if installed, then youtubei.js | youtubei: never use yt-dlp | yt-dlp: always use yt-dlp */
	youtubeDownloader: (['auto', 'youtubei', 'yt-dlp'].includes(env('YT_DOWNLOADER') ?? '') ? env('YT_DOWNLOADER') : 'auto') as
		| 'auto'
		| 'youtubei'
		| 'yt-dlp',
	maxAudioMinutes: int('MAX_AUDIO_MINUTES', 20),
	maxVideoMinutes: int('MAX_VIDEO_MINUTES', 10),
	maxVideoHeight: int('MAX_VIDEO_HEIGHT', 720)
} as const

export type Config = typeof config
