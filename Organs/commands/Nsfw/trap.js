const axios = require('axios')
const fs=require("fs")
require ('../../../settings')
module.exports={
    name:"trap",
    alias:["trap"],
    usage:`${prefa}tarp`,
    cool: 10,
    desc:"Gives you random hentai waifu image",
    react:"💦",

    category:"Nsfw",
    start:async(client,m,{command,prefix,text,args})=>{
    if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')


    let wife = await axios.get('https://api.waifu.pics/nsfw/trap')
    let buttons = [
    {buttonId: `${prefix} trap`, buttonText: {displayText: '>>'}, type: 1}
    ]

    let buttonMessage = {
        image: {url:wife.data.url},
        caption: `*🥵 AHHHH*`,
        footer: `*©Eternity-Team*`,
        buttons: buttons,
        headerType: 4
    }
    client.sendMessage(m.from, buttonMessage, { quoted: m })


    }
}