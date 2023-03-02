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
        let oppai = await axios.get('https://nekopai-apis-main.onrender.com/oppai')
        let buttons = [
            {
                buttonId: `${prefix} soppai`,
                buttonText: {
                    displayText: '>>'
                },
                type: 1
            }
    ]
        
        let buttonMessage = {
            image: {
                url: oppai.data.url
            },
            caption: `*Oppai is love!!*`,
            footer: `*©Eternity-Team*`,
            buttons: buttons,
            headerType: 4
        }
        client.sendMessage(m.from, buttonMessage, {
            quoted: m
        })
        
        
    }
}
