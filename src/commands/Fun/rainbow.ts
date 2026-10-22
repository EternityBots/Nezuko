import { effects } from '../../lib/effects.js'
import { effectCommand } from '../../lib/effect-command.js'

export default effectCommand({
	name: 'rainbow',
	alias: ['colourful'],
	desc: "Rainbow filter on someone's profile picture",
	effect: effects.rainbow
})
