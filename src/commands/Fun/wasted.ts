import { effects } from '../../lib/effects.js'
import { effectCommand } from '../../lib/effect-command.js'

export default effectCommand({
	name: 'wasted',
	alias: ['wast'],
	desc: "GTA wasted screen with someone's profile picture",
	effect: effects.wasted,
	asSticker: 'Wasted'
})
