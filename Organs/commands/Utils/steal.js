const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
module.exports = {
    name: "steal",
    alias: ["take"],
    desc: "steals the sticker",
    cool:3,
    react:"✅",

    category: "Utils",
    start: async(client, m,{pushName,args,mime,quoted}) => {
        if (!quoted) return m.reply(`❌ Could not find any sticker in context`)
        if (q) {
   anu = args.join(' ').split('|')
   pack = anu[0] !== '' ? anu[0] : 'ETERNITY'
   author = anu[1] !== '' ? anu[1] : 'THE BEST IS YET TO BE'
   } else {
       pack = 'ETERNITY'
       author = 'THE BEST IS YET TO BE'
       }
if(/webp/.test(mime)) {
let media = await quoted.download()
let sticker = new Sticker(media, {
   pack: pack, // The pack name
   author: author, // The author name
   type: StickerTypes.FULL, // The sticker type
   categories: ['🤩', '🎉'], // The sticker category
   id: '12345', // The sticker id
   quality: 75, // The quality of the output file
   background: 'transparent' // The sticker background color (only for full stickers)
})

const buffer = await sticker.toBuffer()
client.sendMessage(m.from, {sticker: buffer}, {quoted: m})
}
    }
}