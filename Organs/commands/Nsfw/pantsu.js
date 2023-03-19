const HMtai = require("hmtai");
const hmtai = new HMtai();
const fs=require("fs")
module.exports={
    name:"pantsu",
    alias:["panties"],
    usage:`${global.prefa}pantsu`,
    desc:"I mean... just why? You like underwear?",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,prefix,nsfw,text,args})=>{
        if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
       let waifud = await hmtai.nsfw.pantsu();
       await client.sendMessage(m.from,{image:{url:waifud}},{quoted:m})

    }
}