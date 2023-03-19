const axios = require('axios')
const fs=require("fs")
module.exports={
    name:"milf",
    alias:["mifi"],
    usage:`${global.prefa}milf`,
    desc:"Basically an image of a woman sucking on a big banana",
    category:"Nsfw",
    react:"💦",

    start:async(client,m,{command,prefix,text,args,nsfw})=>{
    if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*') 
       let waifud = await axios.get('https://api.waifu.im/search/?included_tags=milf')
       await client.sendMessage(m.from,{image:{url:waifud.data.images[0].url}},{quoted:m})

    }
}