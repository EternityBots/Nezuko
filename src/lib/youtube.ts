import vm from 'node:vm'
import { Innertube, Log, Platform, UniversalCache, YTNodes, type Types, type YT } from 'youtubei.js'
import { config } from '../config.js'
import { muxAudioVideo } from './ffmpeg.js'
import { streamToBuffer } from './http.js'
import { applyPoToken, generatePoToken, type PoToken } from './po-token.js'
import { ytdlpAudio, ytdlpVersion, ytdlpVideo, type OnProgress, type YtdlpResult } from './ytdlp.js'

export type { DownloadProgress, OnProgress } from './ytdlp.js'

type VideoInfo = YT.VideoInfo
type InnerTubeClient = NonNullable<NonNullable<Parameters<Innertube["getInfo"]>[1]>["client"]>

// YouTube.js prints a long warning every time YouTube adds a UI element it doesn't know yet.
// They are harmless, so only show real errors (set LOG_LEVEL=debug to see everything).
Log.setLevel(config.logLevel === 'debug' ? Log.Level.DEBUG : Log.Level.ERROR)

/**
 * youtubei.js needs a JavaScript evaluator to decipher stream URLs.
 * The extracted player code is run in a separate VM context rather than the bot's own scope.
 */
Platform.shim.eval = async (data: Types.BuildScriptResult) => {
	try {
		return vm.runInNewContext(`(function () {\n${data.output}\n})()`, {}, { timeout: 5_000 })
	} catch (err) {
		if (err instanceof Error && /timed out/i.test(err.message)) throw err
		// Some runtimes lack full node:vm support; fall back to an isolated function scope.
		return new Function(data.output)()
	}
}

let instance: Promise<Innertube> | null = null

/** Shared Innertube session (player and session data are cached on disk between restarts). */
export const getYouTube = () => {
	instance ??= Innertube.create({
		cache: new UniversalCache(true),
		// Real visitor data from YouTube (cached on disk), so PO tokens bound to it are accepted.
		generate_session_locally: false,
		cookie: config.youtubeCookie,
		po_token: config.youtubePoToken
	}).catch(err => {
		instance = null
		throw err
	})
	return instance
}

let autoToken: PoToken | null = null
let tokenJob: Promise<void> | null = null
let lastTokenError: string | null = null

export type PoTokenStatus = { source: 'manual' | 'auto' | 'none'; error?: string }

/** Make sure the session carries a valid PO token (generated automatically unless one is configured). */
export const ensurePoToken = async (): Promise<PoTokenStatus> => {
	if (config.youtubePoToken) return { source: 'manual' }
	if (!config.youtubeAutoPoToken) return { source: 'none' }
	if (autoToken && autoToken.expires > Date.now()) return { source: 'auto' }
	tokenJob ??= (async () => {
		try {
			const yt = await getYouTube()
			autoToken = await generatePoToken(yt)
			applyPoToken(yt, autoToken.token)
			lastTokenError = null
			console.log('[youtube] Generated a PO token')
		} catch (err) {
			autoToken = null
			lastTokenError = err instanceof Error ? err.message : String(err)
			console.warn(`[youtube] Could not generate a PO token: ${lastTokenError}`)
		}
	})().finally(() => {
		tokenJob = null
	})
	await tokenJob
	return autoToken ? { source: 'auto' } : { source: 'none', error: lastTokenError ?? undefined }
}

/** Forget the current auto token (e.g. after YouTube rejects it); the next download mints a new one. */
const dropAutoToken = () => {
	autoToken = null
}

const ID_REGEX = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/|music\.youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/

export const isYouTubeUrl = (text: string) => ID_REGEX.test(text)

export const getVideoId = (urlOrId: string) => {
	const match = ID_REGEX.exec(urlOrId)
	if (match) return match[1]
	if (/^[\w-]{11}$/.test(urlOrId)) return urlOrId
	throw new Error('That is not a YouTube link')
}

export interface VideoResult {
	id: string
	url: string
	title: string
	channel: string
	duration: string
	seconds: number
	views: string
	published: string
	thumbnail: string
}

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

/** Search YouTube videos. */
export const search = async (query: string, limit = 10): Promise<VideoResult[]> => {
	const yt = await getYouTube()
	const results = await yt.search(query, { type: 'video' })
	return results.videos
		.filterType(YTNodes.Video)
		.slice(0, limit)
		.map(v => ({
			id: v.video_id,
			url: `https://youtu.be/${v.video_id}`,
			title: v.title.toString(),
			channel: v.author?.name ?? 'Unknown',
			duration: v.duration?.text ?? 'Live',
			seconds: v.duration?.seconds ?? 0,
			views: v.view_count?.toString() ?? '',
			published: v.published?.toString() ?? '',
			thumbnail: v.best_thumbnail?.url ?? thumb(v.video_id)
		}))
}

export interface SongResult {
	id: string
	url: string
	title: string
	artists: string
	album?: string
	duration: string
	seconds: number
	thumbnail: string
}

/** Search YouTube Music for a song, falling back to a regular video search. */
export const searchSong = async (query: string): Promise<SongResult | null> => {
	const yt = await getYouTube()
	try {
		const music = await yt.music.search(query, { type: 'song' })
		const item = music.songs?.contents?.[0]
		if (item?.id) {
			return {
				id: item.id,
				url: `https://youtu.be/${item.id}`,
				title: item.title ?? query,
				artists: item.artists?.map(a => a.name).join(', ') ?? item.author?.name ?? 'Unknown',
				album: item.album?.name,
				duration: item.duration?.text ?? '',
				seconds: item.duration?.seconds ?? 0,
				thumbnail: item.thumbnail?.contents?.at(-1)?.url?.replace(/w\d+-h\d+/, 'w544-h544') ?? thumb(item.id)
			}
		}
	} catch {
		// YouTube Music search can fail in some regions; use the normal search instead.
	}
	const [video] = await search(query, 1)
	if (!video) return null
	return { ...video, artists: video.channel }
}

/** Lyrics from YouTube Music. */
export const getLyrics = async (query: string) => {
	const song = await searchSong(query)
	if (!song) return null
	const yt = await getYouTube()
	const shelf = await yt.music.getLyrics(song.id).catch(() => undefined)
	const lyrics = shelf?.description?.toString()
	if (!lyrics) return null
	return { song, lyrics, source: shelf?.footer?.toString() }
}

/**
 * Clients to try for downloads, in order. Which ones work depends on the network: YouTube's
 * bot check blocks some clients on some IPs and not others, so the bot tries several.
 *
 * - MWEB and WEB_EMBEDDED work with a PO token, which the bot generates automatically (po-token.ts).
 * - IOS sometimes works without one.
 * - ANDROID_VR can't play "made for kids" videos; WEB_EMBEDDED only plays embeddable ones.
 * - TV needs account cookies (YT_COOKIE), otherwise YouTube asks it to sign in.
 * - WEB only returns SABR formats with no download URL, so it is never used here.
 *
 * Run `bun run yt-check <link>` to see which work for you, and set YT_CLIENTS=... to pin them.
 */
export const streamClients = (): InnerTubeClient[] => {
	const custom = process.env.YT_CLIENTS?.split(',').map(c => c.trim().toUpperCase()).filter(Boolean)
	if (custom?.length) return custom as InnerTubeClient[]
	// With a PO token the web clients work, and MWEB gives the most formats.
	const hasToken = Boolean(config.youtubePoToken || autoToken)
	const clients: InnerTubeClient[] = hasToken ? ['MWEB', 'WEB_EMBEDDED', 'IOS', 'ANDROID_VR'] : ['IOS', 'MWEB', 'ANDROID_VR', 'WEB_EMBEDDED']
	if (config.youtubeCookie) clients.push('TV')
	return clients
}

/** Formats that can actually be downloaded (SABR-only formats have neither a URL nor a cipher). */
const hasDirectUrls = (info: VideoInfo) => {
	const formats = [...(info.streaming_data?.formats ?? []), ...(info.streaming_data?.adaptive_formats ?? [])]
	return formats.some(f => f.url || f.signature_cipher || f.cipher)
}

export class YouTubeDownloadError extends Error {
	declare attempts: { client: string; reason: string }[]
	constructor(attempts: { client: string; reason: string }[]) {
		const unique = [...new Set(attempts.map(a => a.reason))]
		super(unique.length === 1 ? unique[0] : attempts.map(a => `${a.client}: ${a.reason}`).join(' | '))
		// Non-enumerable, so console logs don't dump the whole array.
		Object.defineProperty(this, 'attempts', { value: attempts, enumerable: false })
	}
}

/** Readable reason, including the HTTP status when YouTube refused the download. */
const describeError = (err: unknown) => {
	if (!(err instanceof Error)) return String(err)
	const status = (err as { info?: { response?: { status?: number } } }).info?.response?.status
	if (status === 403) return 'HTTP 403: YouTube refused the download'
	return status ? `${err.message} (HTTP ${status})` : err.message
}

const withStreamingInfo = async <T>(id: string, task: (info: VideoInfo) => Promise<T>, clients?: InnerTubeClient[]): Promise<T> => {
	await ensurePoToken()
	clients ??= streamClients()
	const yt = await getYouTube()
	const attempts: { client: string; reason: string }[] = []
	for (const client of clients) {
		const fail = (reason: string) => {
			attempts.push({ client, reason })
			console.warn(`[youtube] ${id} via ${client}: ${reason}`)
		}
		try {
			// Player requests take a token bound to the video; stream URLs use the session token.
			const po_token = autoToken ? await autoToken.mintFor(id).catch(() => undefined) : undefined
			const info = await yt.getInfo(id, { client, po_token })
			const status = info.playability_status?.status
			if (status && status !== 'OK') {
				fail(info.playability_status?.reason || `not playable (${status})`)
				continue
			}
			if (!info.streaming_data || !hasDirectUrls(info)) {
				fail('no downloadable formats (SABR only)')
				continue
			}
			return await task(info)
		} catch (err) {
			// Our own limits (too long / too big) won't change with another client.
			if (err instanceof Error && /longer than|too large/i.test(err.message)) throw err
			fail(describeError(err))
		}
	}
	// If YouTube rejected the token everywhere, mint a fresh one next time.
	if (attempts.some(a => a.reason.startsWith('HTTP 403'))) dropAutoToken()
	throw new YouTubeDownloadError(attempts)
}

const isLimitError = (err: unknown) => err instanceof Error && /longer than|too large/i.test(err.message)

/**
 * Pick the downloader. auto: yt-dlp first when installed, falling back to youtubei.js;
 * without yt-dlp, youtubei.js only. Passing explicit clients (yt-check) always uses youtubei.js.
 */
const withFallback = async <T>(id: string, viaYoutubei: () => Promise<T>, viaYtdlp: () => Promise<T>, explicitClients?: boolean): Promise<T> => {
	if (explicitClients || config.youtubeDownloader === 'youtubei') return viaYoutubei()
	if (config.youtubeDownloader === 'yt-dlp') return viaYtdlp()
	if (await ytdlpVersion()) {
		try {
			return await viaYtdlp()
		} catch (err) {
			if (isLimitError(err) || /skipped the video/.test(String(err))) throw err
			console.warn(`[youtube] ${id}: yt-dlp failed (${err instanceof Error ? err.message : err}), trying youtubei.js`)
		}
	}
	return viaYoutubei()
}

const detailsFromYtdlp = (id: string, meta: YtdlpResult['meta']): VideoDetails => ({
	id,
	url: `https://youtu.be/${id}`,
	title: meta.title ?? id,
	channel: meta.channel ?? 'Unknown',
	seconds: meta.duration ?? 0,
	views: 0,
	description: '',
	thumbnail: thumb(id),
	published: meta.upload_date?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
})

export interface VideoDetails {
	id: string
	url: string
	title: string
	channel: string
	seconds: number
	views: number
	description: string
	thumbnail: string
	published?: string
}

const detailsOf = (info: VideoInfo): VideoDetails => {
	const b = info.basic_info
	const id = b.id ?? ''
	return {
		id,
		url: `https://youtu.be/${id}`,
		title: b.title ?? 'Untitled',
		channel: b.author ?? b.channel?.name ?? 'Unknown',
		seconds: b.duration ?? 0,
		views: b.view_count ?? 0,
		description: b.short_description ?? '',
		thumbnail: thumb(id),
		published: info.primary_info?.published?.toString()
	}
}

export const getDetails = async (id: string) => detailsOf(await (await getYouTube()).getBasicInfo(id))

const MAX_BYTES = 100 * 1024 * 1024

const assertDuration = (seconds: number, maxMinutes: number) => {
	if (seconds > maxMinutes * 60) throw new Error(`Video is longer than ${maxMinutes} minutes`)
}

/**
 * Download the best AAC (m4a) audio track. WhatsApp plays it as-is, no conversion needed.
 * onProgress only fires when yt-dlp does the download.
 */
export const downloadAudio = async (id: string, { clients, onProgress }: { clients?: InnerTubeClient[]; onProgress?: OnProgress } = {}) =>
	withFallback(
		id,
		() =>
			withStreamingInfo(
				id,
				async info => {
					const details = detailsOf(info)
					assertDuration(details.seconds, config.maxAudioMinutes)
					const stream = await info.download({ type: 'audio', quality: 'best', format: 'mp4' })
					const buffer = await streamToBuffer(stream, MAX_BYTES)
					return { buffer, mimetype: 'audio/mp4', details }
				},
				clients
			),
		async () => {
			const r = await ytdlpAudio(id, onProgress)
			return { buffer: r.buffer, mimetype: r.ext === 'm4a' ? 'audio/mp4' : `audio/${r.ext}`, details: detailsFromYtdlp(id, r.meta) }
		},
		Boolean(clients)
	)

/**
 * Download a video up to MAX_VIDEO_HEIGHT, muxing separate tracks with ffmpeg when needed.
 * onProgress only fires when yt-dlp does the download.
 */
export const downloadVideo = async (id: string, { maxHeight = config.maxVideoHeight, onProgress }: { maxHeight?: number; onProgress?: OnProgress } = {}) =>
	withFallback(
		id,
		() => videoViaYoutubei(id, maxHeight),
		async () => {
			const r = await ytdlpVideo(id, maxHeight, onProgress)
			return { buffer: r.buffer, quality: `up to ${maxHeight}p`, details: detailsFromYtdlp(id, r.meta) }
		}
	)

const videoViaYoutubei = (id: string, maxHeight: number) =>
	withStreamingInfo(id, async info => {
		const details = detailsOf(info)
		assertDuration(details.seconds, config.maxVideoMinutes)
		const formats = info.streaming_data?.adaptive_formats ?? []

		const video = formats
			.filter(f => f.has_video && !f.has_audio && f.mime_type.startsWith('video/mp4') && f.mime_type.includes('avc1') && (f.height ?? 0) <= maxHeight)
			.sort((a, b) => (b.height ?? 0) - (a.height ?? 0) || (b.bitrate ?? 0) - (a.bitrate ?? 0))[0]
		const audio = formats
			.filter(f => f.has_audio && !f.has_video && f.mime_type.startsWith('audio/mp4'))
			.sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))[0]

		if (video && audio) {
			const [v, a] = await Promise.all([
				info.download({ itag: video.itag, type: 'video' }).then(s => streamToBuffer(s, MAX_BYTES)),
				info.download({ itag: audio.itag, type: 'audio' }).then(s => streamToBuffer(s, MAX_BYTES))
			])
			return { buffer: await muxAudioVideo(v, a), quality: video.quality_label ?? `${video.height}p`, details }
		}

		// Fall back to a progressive (already muxed) format, usually 360p.
		const stream = await info.download({ type: 'video+audio', quality: 'best', format: 'mp4' })
		return { buffer: await streamToBuffer(stream, MAX_BYTES), quality: 'best available', details }
	})
