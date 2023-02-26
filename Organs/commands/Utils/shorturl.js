const axios = require('axios')
const fs=require("fs")
require ('../../../settings')
module.exports={
    name:"shorturl",
    alias:["srurl","surl","short"],
    usage:`${prefa}short [Your url]`,
    desc:"Short your long url",
    category:"Utils",
    react:"✅",

    start:async(client,m,{command,prefix,text,args})=>{
if (!text)  return m.reply(`Please provide one valid url`)
try {
wthr = await axios.get(`https://v.gd/create.php?format=json&url=${text}`)
if (wthr.data.shorturl == undefined) m.reply (`${wthr.data.errormessage}`)
await client.sendMessage(m.from,{text:`🌐 *Your Url :* ${wthr.data.shorturl}`},{quoted:m})
} catch (err) {
    console.log(err)
    return m.reply (`Something went wrong`)
    }
  }
}
