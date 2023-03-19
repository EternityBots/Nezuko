const HMtai = require("hmtai");
const hmtai = new HMtai();
const fs=require("fs")
module.exports={
    name:"pussy",
    alias:["pussy"],
    usage:`${global.prefa}pussy`,
    desc:"The genitals of a female, or a cat, you give the meaning.",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,prefix,nsfw,text,args})=>{
        if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
       let waifud = await hmtai.nsfw.pussy();
       await client.sendMessage(m.from,{image:{url:waifud}},{quoted:m})

    }
}