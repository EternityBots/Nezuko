const { buffergif, fetchBuffer } = require('../../../lib/Function')
const axios = require('axios')
module.exports={
    name:"boobs",
    alias:["tits"],
    usage:`${global.prefa}boobs`,
    desc:"So soft, round ... gentle ... damn we love it",
    category:"Nsfw",
    react:"💦",
    start:async(client,m,{command,nsfw,prefix,text})=>{
      if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
      let assss = await axios.get ("http://api.nekos.fun:8080/api/boobs")
    var bobuff = await fetchBuffer(assss.data.image)
    var bogif = await buffergif(bobuff)
    await client.sendMessage(m.from,{video:bogif, gifPlayback:true },{quoted:m}).catch(err => {
    })
  }
}

