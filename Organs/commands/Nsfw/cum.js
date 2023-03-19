const { buffergif, fetchBuffer } = require('../../../lib/Function')
const axios = require('axios')
module.exports={
    name:"cum",
    alias:["cum"],
    usage:`${global.prefa}cum`,
    desc:"Basically sticky white stuff that is usually milked from sharpies.",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,nsfw,prefix,text})=>{
      if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
      let assss = await axios.get ("https://purrbot.site/api/img/nsfw/cum/gif")
    var bobuff = await fetchBuffer(assss.data.link)
    var bogif = await buffergif(bobuff)
    await client.sendMessage(m.from,{video:bogif, gifPlayback:true },{quoted:m}).catch(err => {
    })
  }
}

