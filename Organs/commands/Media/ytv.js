const YT = require('../../../lib/ytdl')
const { isUrl, fetchBuffer } = require('../../../lib/Function')
const fs=require("fs")
require ('../../../settings')
module.exports={
    name:"ytv",
    alias:["ytmp4"],
    usage:`${prefa}yta yotube_link`,
    desc:"Downloads the video from youtube links",
    category:"Media",
    react:"✅",
    start:async(client,m,{command,prefix,text,args})=>{
if (args.length < 1 || !isUrl(text) || !YT.isYTUrl(text)) return client.sendMessage(m.from,{text:"Where is the yt like?...."},{quoted:m})
const vid=await YT.mp4(text)
const ytc=`
*Tittle:* ${vid.title}
*Date:* ${vid.date}
*Duration:* ${vid.duration}
*Quality:* ${vid.quality}`
await client.sendMessage(m.from,{
    video: {url:vid.videoUrl},
    caption: ytc
},{quoted:m})

    }
}