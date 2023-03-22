const YT = require('../../../lib/ytdl')
const { isUrl, fetchBuffer } = require('../../../lib/Function')
const fs=require("fs")
const yts= require("yt-search")
require ('../../../settings')
module.exports={
    name:"playv",
    alias:["video"],
    usage:`${prefa}playv <query>`,
    desc:"Plays the video...",
    category:"Media",
    react:"📼",
    start:async(client,m,{command,prefix,text,args})=>{
               
if(!text) return client.sendMessage(m.from,{text:"What you want to play"},{quoted:m})
let yts = require("yt-search")
        let search = await yts(text)
        let anu = search.videos[0]
const pl= await YT.mp4(anu.url)
const ytc=`
*Tittle:* ${pl.title}
*Date:* ${pl.date}
*Duration:* ${pl.duration}
*Quality:* ${pl.quality}
*Description:* ${pl.description}`
await client.sendMessage(m.from,{
    document: {url:pl.videoUrl},
    fileName: anu.title + '.mp4',
    mimetype: 'video/mp4',
    contextInfo:{
        externalAdReply:{
            title:anu.title,
            body: "©Eternity-Team",
            thumbnail: await fetchBuffer(anu.thumbnail),
            mediaType:2,
            mediaUrl:anu.url,
        }

    },
},{quoted:m})
    }
}