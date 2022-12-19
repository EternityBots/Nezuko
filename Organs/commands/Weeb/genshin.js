const genshin = require("genshin-api")
require ('../../../settings')
module.exports = {
    name: "genshin",
    alias: ["gchara"],
    usage: `${prefa}genshin <any genshin characher name>`,
    desc: "Gives you details of genshin characher.",
    react: "✅",
    
    category: "Weeb",
    start: async (client, m, {
        command,
        prefix,
        text,
        args
    }) => {
try {
if (!text) return m.reply(`❌ No query provided!`)
    a = text.toLowerCase();
    const anime = await genshin.Characters(text)
let txt = ""
txt += `🎀 *Name:* ${anime.name}\n`
txt += `🎖️ *Title:* ${anime.title}\n`
txt += `💠 *Vision:* ${anime.vision}\n`
txt += `🏹 *Weapon:* ${anime.weapon}\n`
txt += `💮 *Gender:* ${anime.gender}\n`
txt += `🌏 *Nation:* ${anime.nation}\n`
txt += `🪷 *Affiliation:* ${anime.affiliation}\n`
txt += `🌟 *Rarity:* ${anime.rarity}\n`
txt += `❄️ *Constellation:* ${anime.constellation}\n`
txt += `📖 *Description:* ${anime.description}\n`
txt += `🌐 *Url:* https://genshin-impact.fandom.com/wiki/${a}\n`


urll = `https://api.genshin.dev/characters/${a}/portrait`
await client.sendMessage(m.from,{image:{url:urll}, caption:txt},{quoted:m})
} catch (err) {
console.log(err)
return m.reply ('⚠️ Something Went Wrong')
}}
}
