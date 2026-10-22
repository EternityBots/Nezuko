import { isAdminParticipant } from '../../core/identity.js'
import { userPart } from '../../lib/utils.js'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'ping',
	alias: ['tagall'],
	desc: 'Tags all members. Add --h to tag silently (no member list).',
	usage: '%prefix%command [message] [--h]',
	category: 'Group',
	react: '✅',
	cool: 30,
	groupOnly: true,
	adminOnly: true,
	start: async (client, m, { args, flags, participants, groupName }) => {
		const message = args.filter(a => !a.startsWith('--')).join(' ') || m.quoted?.text || ''
		const mentions = participants.map(p => p.id)
		let text = `${message ? `🧧 *Message:* ${message}\n\n` : ''}🍀 *Group:* ${groupName}\n👥 *Members:* ${participants.length}\n📣 *Tagger:* @${userPart(m.sender)}`

		if (!flags.includes('--h')) {
			const admins = participants.filter(p => isAdminParticipant(p))
			const members = participants.filter(p => !isAdminParticipant(p))
			if (admins.length) text += `\n\n${admins.map(p => `🥇 *@${userPart(p.id)}*`).join('\n')}`
			if (members.length) text += `\n\n${members.map(p => `🥈 *@${userPart(p.id)}*`).join('\n')}`
		}
		await m.reply({ text, mentions })
	}
})
