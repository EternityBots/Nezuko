const ecchi = require("../../../lib/hentai.json")
require ('../../../settings')
module.exports={
    name:"onanism",
    alias:["masturbation"],
    usage:`${prefa}masturbation`,
    desc:"Gives you hentai masturbation image",
    react:"💦",

    category:"Nsfw",
    start:async(client,m,{command,prefix,text,args})=>{
    if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')

    let wife = ecchi.masturbation
    let ass = wife[Math.floor(Math.random() * wife.length)]

   let buttons = [
    {buttonId: `${prefix}  onanism`, buttonText: {displayText: '>>'}, type: 1}
    ]

    let buttonMessage = {
        image: {url:ass},
        caption: `*💦*`,
        footer: `*©Eternity-Team*`,
        buttons: buttons,
        headerType: 4
    }
    client.sendMessage(m.from, buttonMessage, { quoted: m })

    }
}