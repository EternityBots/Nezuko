import { getSpotifyTrack } from '../../lib/spotify.js'
import { progressMessage } from '../../lib/progress.js'
import { downloadAudio, searchSong } from '../../lib/youtube.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'spotify',
	alias: ['sp'],
	usage: '%prefix%command <spotify track link>',
	desc: 'Sends a Spotify track (audio is found on YouTube Music)',
	category: 'Media',
	react: '🎧',
	cool: 10,
	start: async (client, m, { args }) => {
		if (!args[0]) return m.reply('Where is the Spotify link?')
		const track = await getSpotifyTrack(args[0])
		const details =
			`🎧 *Title:* ${track.name}\n` +
			(track.artists.length ? `🎤 *Artists:* ${track.artists.join(', ')}\n` : '') +
			(track.album ? `💽 *Album:* ${track.album}\n` : '') +
			(track.releaseDate ? `📆 *Release Date:* ${track.releaseDate}` : '')
		const card = track.cover ? await m.reply({ image: { url: track.cover }, caption: details }) : await m.reply(details)

		const song = await searchSong(`${track.name} ${track.artists.join(' ')}`.trim())
		if (!song) return m.reply("Couldn't find this track on YouTube Music")
		const progress = await progressMessage(client, m, '🎧 Downloading audio...')
		const { buffer, mimetype } = await downloadAudio(song.id, { onProgress: p => progress.update(p) }).catch(async err => {
			await progress.fail('❌ Download failed')
			throw err
		})
		await progress.done('📤 Sending...')
		await client.sendMessage(m.from, { audio: buffer, mimetype, fileName: `${track.name}.m4a` }, { quoted: card ?? m.raw })
	}
})
