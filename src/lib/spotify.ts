import { config } from '../config.js'
import { fetchJson } from './http.js'

export interface SpotifyTrack {
	name: string
	artists: string[]
	album?: string
	releaseDate?: string
	cover?: string
}

const TRACK_REGEX = /open\.spotify\.com\/(?:intl-[a-z]+\/)?track\/([A-Za-z0-9]{22})/

export const getTrackId = (url: string) => TRACK_REGEX.exec(url)?.[1]

let token: { value: string; expires: number } | null = null

const getToken = async () => {
	if (token && token.expires > Date.now()) return token.value
	const auth = Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64')
	const data = await fetchJson<{ access_token: string; expires_in: number }>('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
		body: 'grant_type=client_credentials'
	})
	token = { value: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 }
	return token.value
}

/**
 * Track metadata. Uses the Spotify Web API when SPOTIFY_CLIENT_ID/SECRET are set,
 * otherwise Spotify's public oEmbed endpoint (title and cover only).
 */
export const getSpotifyTrack = async (url: string): Promise<SpotifyTrack> => {
	const id = getTrackId(url)
	if (!id) throw new Error('Provide a valid Spotify track link')

	if (config.spotifyClientId && config.spotifyClientSecret) {
		const t = await fetchJson<any>(`https://api.spotify.com/v1/tracks/${id}`, {
			headers: { Authorization: `Bearer ${await getToken()}` }
		})
		return {
			name: t.name,
			artists: (t.artists ?? []).map((a: { name: string }) => a.name),
			album: t.album?.name,
			releaseDate: t.album?.release_date,
			cover: t.album?.images?.[0]?.url
		}
	}

	const o = await fetchJson<{ title: string; thumbnail_url?: string }>(
		`https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${id}`)}`
	)
	return { name: o.title, artists: [], cover: o.thumbnail_url }
}
