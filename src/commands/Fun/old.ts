import { effects } from '../../lib/effects.js'
import { effectCommand } from '../../lib/effect-command.js'

export default effectCommand({
	name: 'old',
	alias: ['sepia'],
	desc: "Old-photo (sepia) filter on someone's profile picture",
	effect: effects.sepia
})
