let { webp2mp4File,getRandom } = require('../../../lib/Function')
const fs=require('fs')
const { exec } = require("child_process")
require ('../../../settings')
module.exports={
    name:"toimg",
    alias:["toimg","togif","tovid"],
    usage:`${prefa}toimg <quote a sticker>`,
    desc:"Converts a sticker to image/gif",
    category:"Utils",
    cool:5,
    react:"✅",

    start:async(client,m,{text,quoted,mime,})=>{
        if(m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated !== true) {
            if (!quoted) return m.reply(`❌ Could not find any sticker in context`)
  if (!/webp/.test(mime)) return m.reply(`❌ Couldn't find any sticker in context`)
  
  let media = await client.downloadAndSaveMediaMessage(quoted)
  let ran = await getRandom('.png')
  exec(`ffmpeg -i ${media} ${ran}`, (err) => {
      fs.unlinkSync(media)
      if (err) m.reply(err)
      let buffer = fs.readFileSync(ran)
      client.sendMessage(m.from, { image: buffer,caption:'ETERNITY-2022' }, { quoted: m })
      fs.unlinkSync(ran)
  })
} else if (m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated == true){
      if (!quoted) return m.reply(`❌ Could not find any sticker in context`)
  if (!/webp/.test(mime)) return m.reply(`❌ Couldn't find any sticker in context`)
  
  let media = await client.downloadAndSaveMediaMessage(quoted)
  let webpToMp4 = await webp2mp4File(media)
  await client.sendMessage(m.from, { video: { url: webpToMp4.result, caption: 'ETERNITY-2022' }, gifPlayback: true }, { quoted: m })
  await fs.unlinkSync(media)
}



    }
}