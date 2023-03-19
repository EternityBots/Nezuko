const HMtai = require("hmtai");
const hmtai = new HMtai();
const fs=require("fs")
module.exports={
    name:"ass",
    alias:["ass"],
    usage:`${global.prefa}ass`,
    desc:"I know you like anime ass~ uwu",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,prefix,nsfw,text,args})=>{
        if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
        let waifud = await hmtai.nsfw.ass();
       await client.sendMessage(m.from,{image:{url:waifud}},{quoted:m})

    }
}