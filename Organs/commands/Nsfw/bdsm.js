const HMtai = require("hmtai");
const hmtai = new HMtai();
const fs=require("fs")
module.exports={
    name:"bdsm",
    alias:["bdsm"],
    usage:`${global.prefa}bdsm`,
    desc:"If you don't know what it is, search it up",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,prefix,nsfw,text,args})=>{
    if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
       let waifud = await hmtai.nsfw.bdsm();
       await client.sendMessage(m.from,{image:{url:waifud}},{quoted:m})

    }
}