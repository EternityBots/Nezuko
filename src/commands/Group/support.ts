import { pickRandom } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

const GIFS = [
	'https://media.tenor.com/XikoNQDfaqcAAAPo/bunny-nezuko-bunny-ears.mp4',
	'https://media.tenor.com/xBh07rz9GHYAAAPo/nezuko-kamado-nezuko.mp4',
	'https://media.tenor.com/CMHP0DIQY4UAAAPo/demon-slayer-kimetsu-no-yaiba.mp4',
	'https://media.tenor.com/68c6pxzq3RAAAAPo/nezuko-nezuko-kamado.mp4',
	'https://media.tenor.com/JQgNUfM_xcwAAAPo/nezuko-kamado-run.mp4'
]

const LINKS = `*━『 Support Group Links 』━*

*1) [ Ɇ𝖙𝖊𝖗𝖓𝖎𝖙ɏ ] :*
https://chat.whatsapp.com/JCCZPbPUbM1536n62zSFZi

*2) [ Ɇ𝖙𝖊𝖗𝖓𝖎𝖙ɏ ₵𝖆𝖘𝖎𝖓ø ] 🎰 :*
https://chat.whatsapp.com/J1WfFPXtmzZGXFB59I0ETq`

export default defineCommand({
	name: 'support',
	alias: ['sup'],
	desc: 'Sends you the official support group links',
	category: 'Group',
	react: '✅',
	start: async (client, m) => {
		await m.reply({ video: { url: pickRandom(GIFS) }, gifPlayback: true, caption: `*${m.pushName}* have a look in your DM` }).catch(() => {})
		await client.sendMessage(m.sender, { image: { url: 'https://i.ibb.co/t3Jd1wK/Eternity-6.png' }, caption: LINKS })
	}
})
