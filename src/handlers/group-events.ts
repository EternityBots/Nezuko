import type { BaileysEventMap } from 'baileys'
import { settings } from '../db/settings.js'
import { userPart } from '../lib/utils.js'
import type { Client } from '../types.js'

/** Welcome and goodbye messages for groups with "events" enabled. */
export const handleParticipants = async (client: Client, update: BaileysEventMap['group-participants.update']) => {
	try {
		if (update.action !== 'add' && update.action !== 'remove') return
		if (!(await settings.has('events', update.id))) return
		const metadata = await client.getGroupMetadata(update.id)

		for (const p of update.participants) {
			const jid = p.id
			const tag = `@${userPart(jid)}`
			if (update.action === 'add') {
				const avatar = await client.getAvatar(jid)
				await client.sendMessage(update.id, {
					image: avatar,
					mentions: [jid],
					caption: `*${tag}* *Welcome to* ${metadata.subject} 🍁\n\n🎋 *Group Description:*\n\n${metadata.desc ?? 'No description'}`
				})
			} else {
				await client.sendMessage(update.id, { text: `${tag} bye bye, we will not miss you`, mentions: [jid] })
			}
		}
	} catch (err) {
		console.error('[group-events]', err)
	}
}
