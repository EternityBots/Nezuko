import { spawn } from 'node:child_process'
import { readdir, readFile, rm, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { config } from '../config.js'
import { tempFile } from './ffmpeg.js'

/**
 * Fallback downloader using yt-dlp (https://github.com/yt-dlp/yt-dlp), for networks where
 * YouTube refuses youtubei.js. Optional: only used when the yt-dlp binary is installed.
 * yt-dlp needs a JavaScript runtime for YouTube; we hand it the Bun/Node running the bot.
 */

const bin = () => process.env.YTDLP_PATH || 'yt-dlp'

const jsRuntime = () => {
	const isBun = Boolean((globalThis as { Bun?: unknown }).Bun)
	return `${isBun ? 'bun' : 'node'}:${process.execPath}`
}

/** Extra yt-dlp options from .env, e.g. YTDLP_ARGS=--cookies-from-browser firefox */
const extraArgs = () => (process.env.YTDLP_ARGS?.match(/"[^"]*"|'[^']*'|\S+/g) ?? []).map(a => a.replace(/^(["'])(.*)\1$/, '$2'))

export type DownloadProgress =
	| { stage: 'download'; track: 'video' | 'audio'; downloaded: number; total?: number; speed?: number; eta?: number }
	| { stage: 'processing' }

export type OnProgress = (progress: DownloadProgress) => void

/** Marks our progress lines on stdout, so they can be told apart from --print output. */
const PROGRESS_TAG = 'NZPROG'
const PROGRESS_TEMPLATE = `download:${PROGRESS_TAG} %(info.vcodec)s %(progress.downloaded_bytes)s %(progress.total_bytes)s %(progress.total_bytes_estimate)s %(progress.speed)s %(progress.eta)s`

const num = (value?: string) => {
	const n = Number(value)
	return value && value !== 'NA' && Number.isFinite(n) ? n : undefined
}

const parseProgress = (line: string): DownloadProgress | null => {
	const [tag, vcodec, downloaded, total, estimate, speed, eta] = line.trim().split(/\s+/)
	if (tag !== PROGRESS_TAG) return null
	return {
		stage: 'download',
		track: vcodec === 'none' ? 'audio' : 'video',
		downloaded: num(downloaded) ?? 0,
		total: num(total) ?? num(estimate),
		speed: num(speed),
		eta: num(eta)
	}
}

const run = (args: string[], timeoutMs = 180_000, log = false, onProgress?: OnProgress) =>
	new Promise<string>((resolve, reject) => {
		const proc = spawn(bin(), args, { stdio: ['ignore', 'pipe', 'pipe'] })
		let stdout = ''
		let pending = ''
		let stderr = ''
		let timedOut = false
		const timer = setTimeout(() => {
			timedOut = true
			proc.kill('SIGKILL')
		}, timeoutMs)
		proc.stdout.on('data', d => {
			// Split out progress lines; everything else is the --print output we return.
			const lines = (pending + d.toString()).split('\n')
			pending = lines.pop() ?? ''
			for (const line of lines) {
				const progress = parseProgress(line)
				if (!progress) stdout += line + '\n'
				else if (onProgress) onProgress(progress)
			}
		})
		proc.stderr.on('data', d => {
			const text = d.toString()
			stderr += text
			// Show what yt-dlp is doing, so a slow download doesn't look like a hang.
			for (const line of text.split('\n')) {
				if (!line.trim()) continue
				if (log) console.log(`[yt-dlp] ${line.trim()}`)
				// Merging tracks / converting audio after the download finished.
				if (onProgress && /^\[(Merger|ExtractAudio|VideoConvertor|FixupM4a)\]/.test(line.trim())) onProgress({ stage: 'processing' })
			}
		})
		proc.on('error', err => {
			clearTimeout(timer)
			reject(err.message.includes('ENOENT') ? new Error('yt-dlp is not installed') : err)
		})
		proc.on('close', code => {
			clearTimeout(timer)
			if (pending && !parseProgress(pending)) stdout += pending
			if (code === 0) return resolve(stdout)
			if (timedOut) return reject(new Error(`yt-dlp timed out after ${timeoutMs / 1000}s (YouTube kept refusing or was too slow)`))
			const lines = stderr.split('\n').filter(Boolean)
			const error = lines.filter(l => l.startsWith('ERROR')).pop() ?? lines.pop()
			reject(new Error(`yt-dlp: ${error?.replace(/^ERROR:\s*/, '') || `exit code ${code}`}`))
		})
	})

let available: Promise<string | null> | null = null

/** yt-dlp version if installed, otherwise null. Checked once. */
export const ytdlpVersion = () =>
	(available ??= run(['--version'], 15_000)
		.then(v => v.trim())
		.catch(() => null))

export interface YtdlpResult {
	buffer: Buffer
	ext: string
	meta: { title?: string; channel?: string; duration?: number; upload_date?: string }
}

const download = async (id: string, format: string, extra: string[], maxMinutes: number, onProgress?: OnProgress): Promise<YtdlpResult> => {
	const dir = (await tempFile('d')).replace(/\.d$/, '')
	await mkdir(dir, { recursive: true })
	try {
		const stdout = await run(
			[
			'--js-runtimes',
			jsRuntime(),
			// Let yt-dlp fetch its YouTube challenge solver. Distro builds of yt-dlp ship
			// without it, and YouTube then refuses the download ("page needs to be reloaded").
			...(extraArgs().includes('--remote-components') ? [] : ['--remote-components', 'ejs:github']),
			'--no-playlist',
			...(onProgress ? ['--progress', '--newline', '--progress-template', PROGRESS_TEMPLATE] : ['--no-progress']),
			// Fail fast instead of retrying for minutes when YouTube refuses.
			'--retries',
			'2',
			'--fragment-retries',
			'2',
			'--extractor-retries',
			'1',
			'--socket-timeout',
			'20',
			'--match-filter',
			`duration <= ${maxMinutes * 60}`,
			'--max-filesize',
			'100M',
			'-f',
			format,
			...extra,
			'--print',
			'after_move:%(.{title,channel,duration,upload_date})j',
			...extraArgs(),
			'-o',
			join(dir, 'media.%(ext)s'),
			`https://www.youtube.com/watch?v=${id}`
			],
			180_000,
			true,
			onProgress
		)
		const file = (await readdir(dir)).find(f => f.startsWith('media.') && !f.endsWith('.part'))
		if (!file) throw new Error(`yt-dlp skipped the video (longer than ${maxMinutes} minutes or over 100 MB)`)
		let meta: YtdlpResult['meta'] = {}
		try {
			meta = JSON.parse(stdout.trim().split('\n').pop() ?? '{}')
		} catch {}
		return { buffer: await readFile(join(dir, file)), ext: file.split('.').pop() ?? '', meta }
	} finally {
		await rm(dir, { recursive: true, force: true })
	}
}

/** Best audio, preferring m4a (plays in WhatsApp without conversion). */
export const ytdlpAudio = (id: string, onProgress?: OnProgress) =>
	download(id, 'bestaudio[ext=m4a]/bestaudio', ['-x', '--audio-format', 'm4a'], config.maxAudioMinutes, onProgress)

/** H.264 MP4 video up to the given height, merged with m4a audio. */
export const ytdlpVideo = (id: string, maxHeight: number, onProgress?: OnProgress) =>
	download(
		id,
		`bv*[ext=mp4][vcodec^=avc1][height<=${maxHeight}]+ba[ext=m4a]/b[ext=mp4][height<=${maxHeight}]/b[height<=${maxHeight}]`,
		['--merge-output-format', 'mp4'],
		config.maxVideoMinutes,
		onProgress
	)
