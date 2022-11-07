const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
module.exports = {
    name: "sticker",
    alias: ["sticker","s"],
    desc: "makes sticker from images/videos/gifs",
    category: "Utils",
    react:"✅",

    start: async(client, m,{pushName,body,quoted,mime,text,args,flags}) => {
       if(!quoted) return await client.sendMessage(m.from,{text:"Reply/tag a image/video"})
       flags.forEach((flag) => (text = text.replace(flag, '')))
 
       pack = 'ETERNITY'
       author = ''
        
       
           
        if (/image/.test(mime)) {
    
            let media = await quoted.download()
       
        let sticker = new Sticker(media, {
            pack: pack, // The pack name
            author: author, // The author name
            type: flags.includes('--c') || flags.includes('--crop') || flags.includes('--cropped')
            ? 'crop'
            : flags.includes('--s') || flags.includes('--stretch') || flags.includes('--stretched')
            ? 'default'
            : flags.includes('--circle')
            ? 'circle'
            : 'full' ,
            categories: ['🤩', '🎉'], // The sticker category
            id: '12345', // The sticker id
            quality: 75, // The quality of the output file
            background: 'transparent' // The sticker background color (only for full stickers)
        })
       
        const buffer = await sticker.toBuffer()
        client.sendMessage(m.from, {sticker: buffer}, {quoted: m})
    
        } else if (/video/.test(mime)) {
            if ((quoted.msg || quoted).seconds > 20) return client.sendMessage(m.from,{text:'🕐 Cannot fetch videos longer than *11 Seconds*'})
            let media = await quoted.download()
        let sticker = new Sticker(media, {
            pack: pack, // The pack name
            author: author, // The author name
            type: body.includes("#c")|| body.includes("#crop")? StickerTypes.CROPPED: StickerTypes.FULL, // The sticker type
            categories: ['🤩', '🎉'], // The sticker category
            id: '12345', // The sticker id
            quality: 30, // The quality of the output file
            background: 'transparent' // The sticker background color (only for full stickers)
        })
    
        const stikk = await sticker.toBuffer()
    
    
        client.sendMessage(m.from, {sticker: stikk}, {quoted: m})
        } else {
            client.sendMessage(m.from,{text:"❌ Could not find any Image/Video in context"},{quoted:m})
            }
    }
}