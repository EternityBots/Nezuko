const axios = require('axios')
const fs=require("fs")
require ('../../../settings')
module.exports={
    name:"define",
    alias:["dictionary"],
    usage:`${prefa}define [Your word]`,
    desc:"Gives you the meaning of your word ",
    category:"Education",
    react:"📖",
    
    start:async(client,m,{command,prefix,args})=>{

if (!q) return m.reply(`Please give me text.`)
try {
rayyy = await axios.get(`http://api.urbandictionary.com/v0/define?term=${q}`)
if (!rayyy) return m.reply(`❌ Error`)
const reply = `
*🔠 Word:* ${q}
*📖 Definition:* ${rayyy.data.list[0].definition
    .replace(/\[/g, "")
    .replace(/\]/g, "")}
*💭 Example:* ${rayyy.data.list[0].example
    .replace(/\[/g, "")
    .replace(/\]/g, "")}
               `
   client.sendMessage(m.from,{text:reply},{quoted:m})
} catch (err) {
    console.log(err)
    return m.reply (`*${q}* isn't a valid text`)
    }
  }
}
