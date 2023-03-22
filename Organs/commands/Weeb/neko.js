const axios = require('axios')
const fs = require("fs")
require ('../../../settings')
module.exports = {
    name: "neko",
    alias: ["nyaa", "cat", "nya"],
    usage: `${prefa}neko`,
    desc: "Gives you random neko image",
    react: "✅",
    
    category: "Weeb",
    start: async (client, m, {
        command,
        prefix,
        text,
        args
    }) => {
        let wife = await axios.get('https://api.waifu.pics/sfw/neko')
        client.sendMessage(m.from, {image:{url:wife.data.url}, caption: `*Nyaa*`}, {
            quoted: m
        })
        
        
    }
}
