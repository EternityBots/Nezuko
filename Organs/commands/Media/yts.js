const { isUrl, fetchBuffer } = require('../../../lib/Function')
const fs=require("fs")
const yts= require("youtube-yts")
require ('../../../settings')
module.exports={
    name:"yts",
    alias:["ytsearch"],
    usage:`${prefa}yts <query>`,
    desc:"Searches Video links from youtube...",
    category:"Media",
    react:"✅",
    start:async(client,m,{command,prefix,text,args})=>{
               
if(!text) return client.sendMessage(m.from,{text:"What you want to search"},{quoted:m})
let yts = require("yt-search")
    let search = await yts(q)
    let yt = '*━━『 📽️ YouTube Search 📽️』━━*\n\n *📮 Results From*: '+text+'\n\n'
    let no = 1
    for (let i of search.all) {
        yt += `*📓 No :* ${no++}\n*🎬 Type :* ${i.type}\n📌 *Video ID :* ${i.videoId}\n*🎯 Title :* ${i.title}\n*🌸 Views :* ${i.views}\n*🎗️ Duration :* ${i.timestamp}\n*🍁 Uploaded :* ${i.ago}\n*🌐 Url :* ${i.url}\n\n *---------------------------------------* \n\n`
    }
client.sendMessage(m.from,{image:{url:search.all[0].thumbnail},caption:yt},{quoted:m})
    }
}
