require('../../../handler/MessageHandler')
const {isUrl}=require("../../../lib/Function")
module.exports = {
    name: "join",
    alias: ["jn"],
    desc: "joins the group",
    cool:3,
    react:"✅",

    category: "Group",
    start: async(client, m,{pushName,iscreator,text,args,wlc,isGroup,isAdmin,nsfw,mods}) => {
        if(!iscreator) return client.sendMessage(m.from,{text:'*Only mods can use this command*'},{quoted:m})

if (!text) return m.reply("🔍 Please provide the group link")
if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return m.reply("🔍 Please provide the group link")
//  m.reply("*[chotto matte]*")
let result = args[0].split('https://chat.whatsapp.com/')[1]
//    const metadatag = await arus.groupMetadata(result)
//console.log(metadata.id + ", title: " + metadata.subject + ", description: " + metadata.desc)

await client.groupAcceptInvite(result)
m.reply(`Joined`).catch((e)=>{
  m.reply('Unknown Error Occured')
})
    }
}