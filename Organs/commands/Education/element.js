const axios = require('axios')
require ('../../../settings')
module.exports = {
    name: "element",
    alias: ["e"],
    desc: "Gives you the info of the given element.",
    usage:`${prefa}element [name/number/symbol]`,
    category: "Education",
    react:"🧪",

    start: async(client, m,{ text, quoted, args }) => {
        try {
        if (!text)  return m.reply(`*Please provide an element name*`) 
        bro = await axios.get(`https://api.popcat.xyz/periodic-table?element=${text}`)
        let lol = "";
		lol += `🔴 *Elelment:* ${bro.data.name}\n`;
		lol += `⬜ *Atomic Number:* ${bro.data.atomic_number}\n`;
		lol += `🟡 *Atomic Mass:* ${bro.data.atomic_mass}\n`;
		lol += `⬛ *Symbol:* ${bro.data.symbol}\n`;
		lol += `*📖 summary:* ${bro.data.summary}\n`;
        await client.sendMessage(m.from,{image:{url:bro.data.image},caption:lol},{quoted:m})      
    } catch (err) {
        console.log(err)
        return m.reply (`*${text}* isn't a valid element.`)
        }
      }
    }
    
        
