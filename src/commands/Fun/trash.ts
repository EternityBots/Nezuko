import { effects } from '../../lib/effects.js'
import { effectCommand } from '../../lib/effect-command.js'

export default effectCommand({
	name: 'trash',
	desc: "Puts someone's profile picture in the trash",
	effect: effects.trash
})
