const { default: axios } = require("axios");
const HMtai = require("hmtai");
const hmtai = new HMtai();
require ('../../../settings')
module.exports={
    name:"maid",
    alias:["maid"],
    usage:`${prefa}maid`,
    desc:"you love maid right 😏",
    react:"💦",

    category:"Nsfw",
    start:async(client,m,{command,prefix,text,args})=>{
    if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')
    let a = await axios.get("https://cuteasfubuki.cf/api/maid")
    let waifud = a.data.url
    ray = waifud.split("?")[0]
    client.sendMessage(m.from, {image: {url:ray},caption: `*🥵*`}, { quoted: m })

    }
}