const axios = require('axios')
const fs = require("fs")
require ('../../../settings')
module.exports = {
    name: "waifu",
    alias: ["wife"],
    usage: `${prefa}waifu`,
    desc: "Gives you random waifu image",
    react: "✅",
    
    category: "Weeb",
    start: async (client, m, {
        command,
        prefix,
        text,
        args
    }) => {
        let wife = await axios.get('https://api.waifu.pics/sfw/waifu')
        let buttons = [
            {
                buttonId: `${prefix} wife`,
                buttonText: {
                    displayText: '>>'
                },
                type: 1
            }
    ]
        
        let buttonMessage = {
            image: {
                url: wife.data.url
            },
            caption: `*✈ Here you Go*`,
            footer: `*©Eternity-Team*`,
            buttons: buttons,
            headerType: 4
        }
        client.sendMessage(m.from, buttonMessage, {
            quoted: m
        })
        
        
    }
}
