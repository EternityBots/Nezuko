import vm from 'node:vm'
import { Innertube, Platform, UniversalCache, YTNodes, type Types, type YT } from 'youtubei.js'

type VideoInfo = YT.VideoInfo
import { config } from '../config.js'
import { muxAudioVideo } from './ffmpeg.js'
import { streamToBuffer } from './http.js'

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
		generate_session_locally: true,
		cookie: config.youtubeCookie,
		po_token: config.youtubePoToken
	}).catch(err => {
		instance = null
		throw err
	})
	return instance
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
 * Clients to try for streaming, in order. YouTube regularly changes which clients
 * need a PO token; trying several keeps downloads working when one breaks.
 */
const STREAM_CLIENTS = ['ANDROID_VR', 'TV', 'WEB_EMBEDDED', 'IOS', 'WEB'] as const

const withStreamingInfo = async <T>(id: string, task: (info: VideoInfo) => Promise<T>): Promise<T> => {
	const yt = await getYouTube()
	let lastError: unknown
	for (const client of STREAM_CLIENTS) {
		try {
			const info = await yt.getInfo(id, { client })
			const status = info.playability_status?.status
			if (status && status !== 'OK') {
				lastError = new Error(info.playability_status?.reason || `Video is not playable (${status})`)
				continue
			}
			if (!info.streaming_data) {
				lastError = new Error('No streaming data')
				continue
			}
			return await task(info)
		} catch (err) {
			lastError = err
		}
	}
	throw lastError instanceof Error ? lastError : new Error('Could not download this video')
}

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

/** Download the best AAC (m4a) audio track. WhatsApp plays it as-is, no conversion needed. */
export const downloadAudio = async (id: string) =>
	withStreamingInfo(id, async info => {
		const details = detailsOf(info)
		assertDuration(details.seconds, config.maxAudioMinutes)
		const stream = await info.download({ type: 'audio', quality: 'best', format: 'mp4' })
		const buffer = await streamToBuffer(stream, MAX_BYTES)
		return { buffer, mimetype: 'audio/mp4', details }
	})

/** Download a video up to MAX_VIDEO_HEIGHT, muxing separate tracks with ffmpeg when needed. */
export const downloadVideo = async (id: string, maxHeight = config.maxVideoHeight) =>
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
