import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const TMP = join(tmpdir(), 'nezuko')

export const tempFile = async (ext: string) => {
	await mkdir(TMP, { recursive: true })
	return join(TMP, `${Date.now()}-${randomBytes(4).toString('hex')}.${ext}`)
}

/** Run ffmpeg with the given arguments. Rejects with ffmpeg's last output lines on failure. */
export const runFfmpeg = (args: string[], timeoutMs = 180_000) =>
	new Promise<void>((resolve, reject) => {
		const proc = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'pipe'] })
		let stderr = ''
		const timer = setTimeout(() => proc.kill('SIGKILL'), timeoutMs)
		proc.stderr.on('data', d => (stderr += d.toString()))
		proc.on('error', err => {
			clearTimeout(timer)
			reject(err.message.includes('ENOENT') ? new Error('ffmpeg is not installed on this server') : err)
		})
		proc.on('close', code => {
			clearTimeout(timer)
			if (code === 0) resolve()
			else reject(new Error(`ffmpeg failed: ${stderr.trim().split('\n').slice(-3).join(' | ') || `exit code ${code}`}`))
		})
	})

/**
 * Convert a buffer with ffmpeg using temp files.
 * `build(input, output)` returns the ffmpeg arguments.
 */
export const convert = async (input: Buffer, inExt: string, outExt: string, build: (input: string, output: string) => string[]) => {
	const inPath = await tempFile(inExt)
	const outPath = await tempFile(outExt)
	try {
		await writeFile(inPath, input)
		await runFfmpeg(build(inPath, outPath))
		return await readFile(outPath)
	} finally {
		await Promise.all([rm(inPath, { force: true }), rm(outPath, { force: true })])
	}
}

/** Merge a separate video and audio track into one MP4 without re-encoding. */
export const muxAudioVideo = async (video: Buffer, audio: Buffer) => {
	const v = await tempFile('mp4')
	const a = await tempFile('m4a')
	const out = await tempFile('mp4')
	try {
		await Promise.all([writeFile(v, video), writeFile(a, audio)])
		await runFfmpeg(['-i', v, '-i', a, '-map', '0:v:0', '-map', '1:a:0', '-c', 'copy', '-movflags', '+faststart', out])
		return await readFile(out)
	} finally {
		await Promise.all([v, a, out].map(p => rm(p, { force: true })))
	}
}
