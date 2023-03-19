const HMtai = require("hmtai");
const hmtai = new HMtai();
const fs=require("fs")
module.exports={
    name:"footjob",
    alias:["foot", "feet"],
    usage:`${global.prefa}feet`,
    desc:"So you like smelly feet huh?",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,prefix,nsfw,text,args})=>{
    if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
       let waifud = await hmtai.nsfw.footjob();
       await client.sendMessage(m.from,{image:{url:waifud}},{quoted:m})

    }
}