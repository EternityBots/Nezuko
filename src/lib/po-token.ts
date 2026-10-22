import { createCanvas, type Canvas } from '@napi-rs/canvas'
import { BotGuardClient } from 'bgutils-js/botguard'
import { buildURL, getHeaders } from 'bgutils-js/utils'
import { WebPoMinter } from 'bgutils-js/webpo'
import { JSDOM } from 'jsdom'
import type { Innertube } from 'youtubei.js'

/**
 * Generates a YouTube Proof-of-Origin (PO) token the same way youtube.com does: it runs
 * Google's BotGuard challenge (via LuanRT's bgutils-js) in a minimal browser-like
 * environment, exchanges the result for an integrity token, and mints a token bound to
 * the session's visitor data. Web clients (MWEB, WEB_EMBEDDED) need it to download.
 */

/** YouTube's BotGuard request key (the one youtube.com uses). */
const REQUEST_KEY = 'O43z0dpjhgX20SCx4KAo'

let domReady = false
/** BotGuard expects window/document. Only add what is missing so Node/Bun globals stay intact. */
const ensureDom = () => {
	if (domReady) return
	const dom = new JSDOM('<!DOCTYPE html><html lang="en"><head><title></title></head><body></body></html>', {
		url: 'https://www.youtube.com/',
		referrer: 'https://www.youtube.com/'
	})
	// jsdom has no canvas, but BotGuard draws on one. Back <canvas> with @napi-rs/canvas so the
	// environment looks like a real browser (an incomplete one gets tokens YouTube rejects).
	const proto = dom.window.HTMLCanvasElement.prototype as any
	const backing = (el: any): Canvas => (el.__napiCanvas ??= createCanvas(el.width || 300, el.height || 150))
	proto.getContext = function (type: string) {
		return type === '2d' ? backing(this).getContext('2d') : null
	}
	proto.toDataURL = function (type?: string) {
		return backing(this).toDataURL((type as 'image/png') ?? 'image/png')
	}
	proto.toBlob = function (callback: (blob: Blob | null) => void, type?: string) {
		const buf = type === 'image/jpeg' ? backing(this).toBuffer('image/jpeg') : backing(this).toBuffer('image/png')
		callback(new dom.window.Blob([new Uint8Array(buf)], { type: type ?? 'image/png' }))
	}

	const g = globalThis as Record<string, unknown>
	if (!('window' in g)) g.window = dom.window
	if (!('document' in g)) g.document = dom.window.document
	if (!('location' in g)) g.location = dom.window.location
	if (!('origin' in g)) g.origin = dom.window.origin
	domReady = true
}

export interface PoToken {
	/** Session-bound token (visitor data), used for stream URLs. */
	token: string
	visitorData: string
	/** Mints video-bound tokens for player requests. */
	mintFor: (contentBinding: string) => Promise<string>
	/** Epoch ms after which a new token should be minted. */
	expires: number
}

export const generatePoToken = async (yt: Innertube): Promise<PoToken> => {
	ensureDom()
	const visitorData = yt.session.context.client.visitorData
	if (!visitorData) throw new Error('Session has no visitor data to bind the PO token to')

	// 1. Get the BotGuard challenge and load its interpreter (Google's VM script).
	const { bg_challenge: challenge } = await yt.getAttestationChallenge('ENGAGEMENT_TYPE_UNBOUND')
	if (!challenge) throw new Error('YouTube did not return a BotGuard challenge')
	const interpreterUrl = challenge.interpreter_url.private_do_not_access_or_else_trusted_resource_url_wrapped_value
	if (!interpreterUrl) throw new Error('BotGuard challenge has no interpreter URL')
	const script = await (await fetch(interpreterUrl.startsWith('//') ? `https:${interpreterUrl}` : interpreterUrl)).text()
	new Function(script)()

	// 2. Run the program and take a snapshot.
	const botguard = await BotGuardClient.create({
		program: challenge.program,
		globalName: challenge.global_name,
		globalObject: globalThis
	})
	const webPoSignalOutput: Parameters<typeof WebPoMinter.create>[1] = []
	const botguardResponse = await botguard.snapshot({ webPoSignalOutput })

	// 3. Exchange the snapshot for an integrity token.
	const res = await fetch(buildURL('GenerateIT', true), {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify([REQUEST_KEY, botguardResponse])
	})
	if (!res.ok) throw new Error(`Integrity token request failed (HTTP ${res.status})`)
	const [integrityToken, ttlSecs, mintRefreshThreshold, websafeFallbackToken] = (await res.json()) as [string, number, number, string]
	if (!integrityToken) throw new Error('No integrity token in the response')

	// 4. Mint a PO token bound to the visitor data.
	const minter = await WebPoMinter.create({ integrityToken, estimatedTtlSecs: ttlSecs, mintRefreshThreshold, websafeFallbackToken }, webPoSignalOutput)
	const token = await minter.mintAsWebsafeString(visitorData)
	const lifetimeMs = Math.max(10 * 60, (ttlSecs || 6 * 3600) - (mintRefreshThreshold || 0) - 300) * 1000
	return {
		token,
		visitorData,
		mintFor: binding => minter.mintAsWebsafeString(binding),
		expires: Date.now() + lifetimeMs
	}
}

/** Put a token on an existing session so every player request and stream URL carries it. */
export const applyPoToken = (yt: Innertube, token: string) => {
	yt.session.po_token = token
	if (yt.session.player) yt.session.player.po_token = token
}
