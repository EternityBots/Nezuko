import { config } from '../../config.js'
import { pickRandom } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

const VIDEOS = [
	'https://static.moewalls.com/videos/preview/2022/neko-nezuko-kimetsu-no-yaiba-preview.mp4',
	'https://static.moewalls.com/videos/preview/2022/nezuko-lying-on-the-water-kimetsu-no-yaiba-preview.mp4',
	'https://static.moewalls.com/videos/preview/2022/nezuko-kamado-demon-slayer-preview.mp4'
]

export default defineCommand({
	name: 'mods',
	alias: ['mod', 'owner'],
	desc: 'Shows the list of bot mods',
	category: 'General',
	react: '✅',
	start: async (client, m) => {
		if (!config.owners.length) return m.reply('No mods are configured for this bot.')
		const jids = config.owners.map(n => `${n}@s.whatsapp.net`)
		let caption = '*🎉 Nᴇᴢᴜᴋᴏ Mᴏᴅs 🎉*\n'
		for (const jid of jids) {
			caption += `\n*👑 Name:* ${await client.getName(jid)}\n*🎖️ Tag:* @${jid.split('@')[0]}\n`
		}
		await m
			.reply({ video: { url: pickRandom(VIDEOS) }, gifPlayback: true, caption, mentions: jids })
			.catch(() => m.reply({ text: caption, mentions: jids }))
	}
})
