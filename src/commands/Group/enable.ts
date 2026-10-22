import { settings, type ListKey } from '../../db/settings.js'
import { defineCommand } from '../../types.js'

/** User-facing option name -> stored list. "mod" is the old name for anti-link. */
export const GROUP_FEATURES: Record<string, { key: ListKey; label: string }> = {
	mod: { key: 'mods', label: 'Antilink' },
	antilink: { key: 'mods', label: 'Antilink' },
	nsfw: { key: 'nsfw', label: 'Nsfw' },
	events: { key: 'events', label: 'Events' },
	event: { key: 'events', label: 'Events' }
}

export default defineCommand({
	name: 'enable',
	alias: ['act', 'register'],
	desc: 'Enables a group feature: antilink, events (welcome/bye) or nsfw (reddit)',
	usage: '%prefix%command antilink | events | nsfw',
	category: 'Group',
	react: '✅',
	cool: 3,
	groupOnly: true,
	adminOnly: true,
	start: async (client, m, { args, prefix }) => {
		const feature = GROUP_FEATURES[args[0]?.toLowerCase() ?? '']
		if (!feature) return m.reply(`Choose an option: *${prefix}enable antilink*, *events* or *nsfw*`)
		const added = await settings.add(feature.key, m.from)
		await m.reply(added ? `💮 Successfully enabled *${feature.label}*` : `🛡 *${feature.label}* is already enabled`)
	}
})
