const HMtai = require("hmtai");
const hmtai = new HMtai();
const fs=require("fs")
module.exports={
    name:"ero",
    alias:["ero"],
    usage:`${global.prefa}ero`,
    desc:"School and many other Uniforms~",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,prefix,nsfw,text,args})=>{
        if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
       let waifud = await hmtai.nsfw.ero();
       await client.sendMessage(m.from,{image:{url:waifud}},{quoted:m})

    }
}