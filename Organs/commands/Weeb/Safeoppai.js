const axios = require('axios')

module.exports = {
    name: "soppai",
    alias: ["safeboobs", "sboobs", "safeoppai"],
    usage: `${prefa}neko`,
    desc: "Gives you random safe oppai image",
    react: "😜",
    
    category: "Weeb",
    start: async (client, m, {
        command,
        prefix,
        text
        
    }) => {
        let oppai = await axios.get('https://api.waifu.im/search/?included_tags=oppai')
        client.sendMessage(m.from, {image:{url:oppai.data.images[0].url}, caption: `*Oppai is love!!*`}, {
            quoted: m
        })
        
        
    }
}
