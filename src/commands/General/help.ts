import { capitalize, pickRandom } from '../../lib/utils.js'
import { defineCommand, type Category } from '../../types.js'

const EMOJI: Record<Category, string> = {
	General: '📖',
	Group: '🎉',
	Mods: '👑',
	Media: '🎵',
	Utils: '🍀',
	Fun: '🎟',
	Weeb: '🌊',
	Education: '♨️'
}

const BANNERS = [
	'https://images3.alphacoders.com/107/1078895.png',
	'https://images6.alphacoders.com/103/1037400.png',
	'https://images6.alphacoders.com/102/1020806.jpg',
	'https://images7.alphacoders.com/104/1040192.jpg',
	'https://images5.alphacoders.com/104/1045349.jpg',
	'https://images6.alphacoders.com/102/1024472.png',
	'https://images8.alphacoders.com/120/1206401.jpg',
	'https://images8.alphacoders.com/122/1222661.png',
	'https://images3.alphacoders.com/120/1207252.jpg',
	'https://images2.alphacoders.com/125/1258571.jpg',
	'https://images7.alphacoders.com/125/1258568.jpg',
	'https://images2.alphacoders.com/125/1254189.jpg'
]

export default defineCommand({
	name: 'help',
	alias: ['h', 'menu'],
	desc: 'Lists all commands, or shows details of one',
	usage: '%prefix%command [command]',
	category: 'General',
	react: '✅',
	start: async (client, m, { commands, args, prefix }) => {
		if (args[0]) {
			const cmd = commands.get(args[0])
			if (!cmd || cmd.hidden) return m.reply('No command found')
			const info = [`*🍁 Command :* ${capitalize(cmd.name)}`]
			if (cmd.alias?.length) info.push(`*👾 Alias :* ${cmd.alias.join(', ')}`)
			if (cmd.cool) info.push(`*⏱️ Cooldown :* ${cmd.cool}s`)
			if (cmd.desc) info.push(`*🧾 Description :* ${cmd.desc}`)
			if (cmd.usage) info.push(`*💡 Example :* ${cmd.usage.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd.name)}`)
			return m.reply(`*ℹ️ Command Info*\n\n${info.join('\n')}\n\n*©Eternity-Team*`)
		}

		let text = `*Kon'nichiwa (｡♡‿♡｡)* ${m.pushName || 'there'}, Watashiwa *Nezuko*.\n\n🧧 *Prefix :* [ ${prefix} ]\n\n📝 Here are the *Commands* :\n\n`
		for (const [category, list] of commands.byCategory()) {
			text += `*${category.toUpperCase()} ${EMOJI[category] ?? '✨'} :-*\n\`\`\`${list.map(c => c.name).join(', ')}\`\`\`\n\n`
		}
		text += `📗 Type *${prefix}help* <command> or <command> --info\n\n*©Eternity-Team*`
		await m.reply({ image: { url: pickRandom(BANNERS) }, caption: text })
	}
})
