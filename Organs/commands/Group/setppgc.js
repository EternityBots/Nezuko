const fs = require('fs')
const Jimp = require('jimp');

module.exports = {
	name: "setppgc",
	alias: ["ppgc"],
	desc: "Change This Group Photo Profile",
    category: "Group",
    usage: "Caption or quote an image",
    react:"✅",
    start: async(client, m, { mime, quoted, text, prefix, command }) => {
        if (/image/.test(mime)) {
            let media = await client.downloadAndSaveMediaMessage(quoted)
            if (text.toLowerCase() === "original") {
                var { preview } = await generateProfilePicture(media)
                await client.query({
                    tag: 'iq',
                    attrs: {
                        to: m.from,
                        type:'set',
                        xmlns: 'w:profile:picture'
                    },
                    content: [{
                        tag: 'picture',
                        attrs: { type: 'image' },
                        content: preview
                    }]
                })
                fs.unlinkSync(media)
            } else {
                await client.updateProfilePicture(m.from, { url: media })
                .then( res => {
                    client.sendMessage(m.from,{text:"Group pfp changed"})
                    fs.unlinkSync(media)
                }).catch(() =>                    client.sendMessage(m.from,{text:err})
)
            }
        } else {
                    client.sendMessage(m.from,{text:"Reply to an image only"})
        }
	},
}

async function generateProfilePicture(buffer) {
    const jimp = await Jimp.read(buffer)
    const min = jimp.getWidth()
    const max = jimp.getHeight()
    const cropped = jimp.crop(0, 0, min, max)
    return {
        img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
        preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG)
    }
}