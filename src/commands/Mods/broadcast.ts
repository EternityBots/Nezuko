import { sleep } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'broadcast',
	alias: ['bc'],
	desc: 'Sends a message (optionally with a quoted image/video) to every group the bot is in',
	usage: '%prefix%command <message>',
	category: 'Mods',
	react: '✅',
	ownerOnly: true,
	start: async (client, m, { text, target, mime }) => {
		if (!text) return m.reply('❌ No message provided!')
		const groups = Object.keys(await client.groupFetchAllParticipating())
		const caption = `🔰 _*Nezuko Broadcast*_ 🔰\n\n🍀 *Author:* ${m.pushName}\n\n💬 *Message:* ${text}`
		const media = /image|video/.test(mime) ? await target.download() : undefined

		// Sending fast to many chats is a common ban trigger, so space messages out.
		await m.reply(`Broadcasting to ${groups.length} groups, this takes about ${Math.ceil(groups.length * 2)} seconds`)
		let sent = 0
		for (const jid of groups) {
			try {
				if (media && mime.startsWith('image')) await client.sendMessage(jid, { image: media, caption })
				else if (media) await client.sendMessage(jid, { video: media, caption })
				else await client.sendMessage(jid, { text: caption })
				sent++
			} catch (err) {
				console.error(`[broadcast] ${jid}:`, err)
			}
			await sleep(2_000)
		}
		await m.reply(`Successfully broadcast to ${sent}/${groups.length} groups`)
	}
})
