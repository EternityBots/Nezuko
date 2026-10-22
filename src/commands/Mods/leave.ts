import { pickRandom } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

const IMAGES = [
	'https://images3.alphacoders.com/104/1049964.jpg',
	'https://images3.alphacoders.com/104/1047335.jpg',
	'https://images8.alphacoders.com/102/1024950.jpg',
	'https://images2.alphacoders.com/104/1046434.jpg'
]

export default defineCommand({
	name: 'leave',
	alias: ['bye', 'left'],
	desc: 'Makes the bot leave the group',
	category: 'Mods',
	react: '👋',
	ownerOnly: true,
	groupOnly: true,
	start: async (client, m) => {
		await client.sendMessage(m.from, { image: { url: pickRandom(IMAGES) }, caption: `Bot is being removed by *${m.pushName}* 😞` }).catch(() => {})
		await client.groupLeave(m.from)
	}
})
