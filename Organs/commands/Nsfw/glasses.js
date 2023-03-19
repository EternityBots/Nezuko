const HMtai = require("hmtai");
const hmtai = new HMtai();
const fs=require("fs")
module.exports={
    name:"glasses",
    alias:["glass"],
    usage:`${global.prefa}glasses`,
    desc:"Girls that wear glasses, uwu~",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,prefix,nsfw,text,args})=>{
        if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
       let waifud = await hmtai.nsfw.glasses();
       await client.sendMessage(m.from,{image:{url:waifud}},{quoted:m})

    }
}