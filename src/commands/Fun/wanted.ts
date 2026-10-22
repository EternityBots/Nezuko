import { effects } from '../../lib/effects.js'
import { effectCommand } from '../../lib/effect-command.js'

export default effectCommand({
	name: 'wanted',
	desc: "Wanted poster with someone's profile picture",
	effect: effects.wanted
})
