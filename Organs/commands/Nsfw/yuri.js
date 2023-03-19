const { buffergif, fetchBuffer } = require('../../../lib/Function')
const axios = require('axios')
const hmtai=require('hmtai')
module.exports={
    name:"yuri",
    alias:["yuri"],
    usage:`${global.prefa}yuri`,
    desc:"What about cute Les?~",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,nsfw,prefix,text})=>{
    if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*') 
    let assss = await axios.get ("https://purrbot.site/api/img/nsfw/yuri/gif")
    var bobuff = await fetchBuffer(assss.data.link)
    var bogif = await buffergif(bobuff)
    await client.sendMessage(m.from,{video:bogif, gifPlayback:true },{quoted:m}).catch(err => {
    })
  }
}

