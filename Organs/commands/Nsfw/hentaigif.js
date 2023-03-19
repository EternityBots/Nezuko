const HMtai = require("hmtai");
const hmtai = new HMtai();
const fs=require("fs")
const { buffergif, fetchBuffer } = require('../../../lib/Function') 
module.exports={
    name:"hentaigif",
    alias:["hgif"],
    usage:`${global.prefa}hgif`,
    desc:"Basically an animated image, so yes :3",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,prefix,nsfw,text,args})=>{
        if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
       let waifud = await hmtai.nsfw.gif();
       var bobuff = await fetchBuffer(waifud)
       var bogif = await buffergif(bobuff)
       await client.sendMessage(m.from,{video:bogif, gifPlayback:true },{quoted:m})

    }
}