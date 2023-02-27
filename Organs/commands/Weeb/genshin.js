const genshindb = require('genshin-db');
const fs=require("fs")
module.exports={
    name:"genshin",
    alias:["gchara", "genshinchara"],
    usage:"=gchara [name]",
    desc:"Gives you the data of the given genshin character.",
    category:"Weeb",
    react:"✅",

    start:async(client,m,{command,prefix,args})=>{
if (!q) return m.reply(`*Please provide me a genshin character name*`)
try {
const genshin = await genshindb.characters(q);
if (!genshin) return m.reply(`Can't find the character data`)
const reply =
`💎 *Name:* ${genshin.name}
💠 *Elemnent:* ${genshin.element}
📛 *Weapon:* ${genshin.weapontype}
🎗 *Speciality:* ${genshin.substat}
🌟 *Rarity:* ${genshin.rarity}
🌸 *Gender:* ${genshin.gender}
❄ *Constellation:* ${genshin.constellation}
⛩ *Region:* ${genshin.region}
💮 *Affiliation:* ${genshin.affiliation}
🎁 *Birthday:* ${genshin.birthday}
💛 *Description:* ${genshin.description}
🌐 *URL:* ${genshin.url.fandom}`
await client.sendMessage(m.from,{image:{url:genshin.images.cover2}, caption:reply},{quoted:m})
} catch (err) {
    console.log(err)
    return m.reply (`✖ An error occurred. Please try again later.`)
    }
  }
}