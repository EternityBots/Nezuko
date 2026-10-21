import { effects } from '../../lib/effects.js'
import { effectCommand } from '../../lib/effect-command.js'

export default effectCommand({
	name: 'trigger',
	alias: ['triggered'],
	desc: "Triggered sticker from someone's profile picture",
	effect: effects.triggered,
	asSticker: 'Triggered'
})
