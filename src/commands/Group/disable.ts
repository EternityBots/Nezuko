import { settings } from '../../db/settings.js'
import { defineCommand } from '../../types.js'
import { GROUP_FEATURES } from './enable.js'

export default defineCommand({
	name: 'disable',
	alias: ['deact', 'unregister'],
	desc: 'Disables a group feature: antilink, events or nsfw',
	usage: '%prefix%command antilink | events | nsfw',
	category: 'Group',
	react: '✅',
	cool: 3,
	groupOnly: true,
	adminOnly: true,
	start: async (client, m, { args, prefix }) => {
		const feature = GROUP_FEATURES[args[0]?.toLowerCase() ?? '']
		if (!feature) return m.reply(`Choose an option: *${prefix}disable antilink*, *events* or *nsfw*`)
		const removed = await settings.remove(feature.key, m.from)
		await m.reply(removed ? `💮 Successfully disabled *${feature.label}*` : `🛡 *${feature.label}* is not enabled`)
	}
})
