import sharp from 'sharp'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'setppgc',
	alias: ['ppgc'],
	desc: "Changes the group's profile picture. Add 'full' to keep the whole image uncropped.",
	usage: 'Send or reply to an image with %prefix%command [full]',
	category: 'Group',
	react: '✅',
	groupOnly: true,
	adminOnly: true,
	botAdmin: true,
	start: async (client, m, { target, mime, args }) => {
		if (!/image/.test(mime)) return m.reply('Send or reply to an image')
		const image = await target.download()
		if (['full', 'original'].includes(args[0]?.toLowerCase() ?? '')) {
			const { width = 640, height = 640 } = await sharp(image).metadata()
			await client.updateProfilePicture(m.from, image, { width, height })
		} else {
			await client.updateProfilePicture(m.from, image)
		}
		await m.reply('Group profile picture changed ✅')
	}
})
