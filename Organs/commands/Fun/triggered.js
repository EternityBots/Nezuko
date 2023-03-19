const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
const canvacord = require("canvacord");
module.exports = {
    name: "trigger",
    alias: ["triggered"],
    usage: `${prefa}trigger <mention>`,
    react: "🎉",
    category: "Fun",
    start: async (client, m, { command, pushName, groupName, isAdmin, iscreator, mentionByTag, prefix, text, args, quoted, mime }) => {
        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://i.pinimg.com/564x/84/09/12/840912dd744e6662ab211b8070b5d84c.jpg"
            }
            result = await canvacord.Canvacord.trigger(img);
        } else if (mentionByTag[0]) {
            try {
                img = await client.profilePictureUrl(mentionByTag[0], 'image')
            } catch {
                img = "https://i.pinimg.com/564x/84/09/12/840912dd744e6662ab211b8070b5d84c.jpg"
            }
            result = await canvacord.Canvacord.trigger(img);
        } else if (m.sender) {
            try {
                ppuser = await client.profilePictureUrl(m.sender, 'image')
            } catch {
                ppuser = 'https://i.pinimg.com/564x/84/09/12/840912dd744e6662ab211b8070b5d84c.jpg'
            }
            result = await canvacord.Canvacord.trigger(ppuser);
        }
        let sticker = new Sticker(result, {
            pack: `Triggred`,
            author:"" ,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 75,
            background: 'transparent' // The sticker background color (only for full stickers)
        })
        const stikk = await sticker.toBuffer()
        client.sendMessage(m.from, {sticker: stikk}, {quoted: m})
    }
}