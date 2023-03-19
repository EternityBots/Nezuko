const axios = require('axios')
const fs=require("fs")
module.exports={
    name:"boobjob",
    alias:["boj","bbj"],
    usage:`${global.prefa}bbj`,
    desc:"So soft, round ... gentle ... damn we love it",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,prefix,text,args,nsfw})=>{
    if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*') 
       let waifud = await axios.get('https://api.waifu.im/search/?included_tags=paizuri')
       await client.sendMessage(m.from,{image:{url:waifud.data.images[0].url}},{quoted:m})

    }
}