import moment from 'moment-timezone'
import { userPart } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'groupinfo',
	alias: ['gcinfo'],
	desc: 'Shows information about this group',
	category: 'Group',
	react: '✅',
	cool: 3,
	groupOnly: true,
	start: async (client, m, { metadata, participants, groupAdmins, settings }) => {
		if (!metadata) return m.reply("Couldn't load this group's info")
		const owner = metadata.ownerPn ?? metadata.owner
		const created = metadata.creation ? moment(metadata.creation * 1000).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss') : 'Unknown'
		const caption =
			`*━━━━『🍀Group-Info🍀』━━━━*\n\n*🎐 Name:* ${metadata.subject}\n\n*🔩 Group ID:* ${m.from}\n\n*🍀 Created:* ${created}\n\n` +
			`*🥇 Group Owner:* ${owner ? `@${userPart(owner)}` : 'Unknown'}\n\n*🔍 Admins:* ${groupAdmins.length}\n\n` +
			`*🎍 Participants:* ${participants.length}\n\n*🔍 Desc:*\n\n${metadata.desc ?? 'None'}\n\n` +
			`*🟥 Antilink:* ${settings.antilink}\n*🟨 Events:* ${settings.events}\n*🍒 NSFW:* ${settings.nsfw}`
		await m.reply({ image: await client.getAvatar(m.from), caption, mentions: owner ? [owner] : [] })
	}
})
