import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'group',
	alias: ['grp'],
	desc: 'Opens or closes the group (only admins can send messages when closed)',
	usage: '%prefix%command open | close',
	category: 'Group',
	react: '✅',
	cool: 3,
	groupOnly: true,
	adminOnly: true,
	botAdmin: true,
	start: async (client, m, { args, prefix }) => {
		const action = args[0]?.toLowerCase()
		if (action === 'open') {
			await client.groupSettingUpdate(m.from, 'not_announcement')
			return m.reply('*Group opened*')
		}
		if (action === 'close') {
			await client.groupSettingUpdate(m.from, 'announcement')
			return m.reply('*Group closed*')
		}
		await m.reply(`👉 Use *${prefix}group open* to open the group\n\n👉 Use *${prefix}group close* to close the group`)
	}
})
