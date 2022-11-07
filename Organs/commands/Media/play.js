const YT = require('../../../lib/ytdl')
const { isUrl, fetchBuffer } = require('../../../lib/Function')
const fs=require("fs")
const yts= require("yt-search")
require ('../../../settings')
module.exports={
    name:"play",
    alias:["song"],
    usage:`${prefa}play <query>`,
    desc:"Plays the song...",
    category:"Media",
    react:"✅",
    start:async(client,m,{command,prefix,text,args})=>{
               
if(!text) return client.sendMessage(m.from,{text:"What you want to play"},{quoted:m})
let yts = require("yt-search")
        let search = await yts(text)
        let anu = search.videos[0]
const pl= await YT.mp3(anu.url)
await client.sendMessage(m.from,{
    audio: fs.readFileSync(pl.path),
    fileName: anu.title + '.mp3',
    mimetype: 'audio/mpeg',
    contextInfo:{
        externalAdReply:{
            title:anu.title,
            body: "*©Eternity-Team*",
            thumbnail: await fetchBuffer(pl.meta.image),
            mediaType:2,
            mediaUrl:anu.url,
        }

    },
},{quoted:m})
await fs.unlinkSync(pl.path)
    }
}