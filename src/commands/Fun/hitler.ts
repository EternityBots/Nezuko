import { effects } from '../../lib/effects.js'
import { effectCommand } from '../../lib/effect-command.js'

export default effectCommand({
	name: 'hitler',
	alias: ['worst'],
	desc: "Worse than Hitler meme with someone's profile picture",
	effect: effects.hitler
})
