import genshindb from 'genshin-db'
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'genshin',
	alias: ['gchara', 'genshinchara', 'gc'],
	desc: 'Data about a Genshin Impact character',
	usage: '%prefix%command <character name>',
	category: 'Weeb',
	react: '✅',
	start: async (client, m, { text }) => {
		if (!text) return m.reply('*Please give me a Genshin character name*')
		const c = genshindb.characters(text)
		if (!c) return m.reply("Can't find that character")
		const caption = `💎 *Name:* ${c.name}
💠 *Element:* ${c.elementText}
📛 *Weapon:* ${c.weaponText}
🎗 *Speciality:* ${c.substatText}
🌟 *Rarity:* ${c.rarity}
🌸 *Gender:* ${c.gender}
❄ *Constellation:* ${c.constellation}
⛩ *Region:* ${c.region}
💮 *Affiliation:* ${c.affiliation}
🎁 *Birthday:* ${c.birthday}
💛 *Description:*\n${c.description}
🌐 *URL:* ${c.url?.fandom ?? ''}`
		const image = c.images?.cover2 ?? c.images?.mihoyo_icon
		await m.reply(image ? { image: { url: image }, caption } : { text: caption })
	}
})
