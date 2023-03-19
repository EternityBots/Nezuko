const HMtai = require("hmtai");
const hmtai = new HMtai();
const fs=require("fs")
module.exports={
    name:"uniform",
    alias:["school"],
    usage:`${global.prefa}uniform`,
    desc:"School and many other Uniforms~",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,prefix,nsfw,text,args})=>{
        if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
       let waifud = await hmtai.nsfw.uniform();
       await client.sendMessage(m.from,{image:{url:waifud}},{quoted:m})

    }
}