import { effects } from '../../lib/effects.js'
import { effectCommand } from '../../lib/effect-command.js'

export default effectCommand({
	name: 'shit',
	alias: ['poop'],
	desc: "Steps on someone's profile picture",
	effect: effects.shit
})
