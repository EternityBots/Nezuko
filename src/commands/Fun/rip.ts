import { effects } from '../../lib/effects.js'
import { effectCommand } from '../../lib/effect-command.js'

export default effectCommand({
	name: 'rip',
	desc: "RIP gravestone with someone's profile picture",
	effect: effects.rip
})
