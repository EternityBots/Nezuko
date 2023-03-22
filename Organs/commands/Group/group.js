module.exports = {
    name: "group",
    alias: ["grp"],
    desc: "Ope/close group",
    cool:3,
    react:"✅",
   
        start: async(client, m, { text, prefix, isBotAdmin,isAdmin,args}) => {
            if(!isAdmin) return client.sendMessage(m.from,{text:"This is admin only command"},{quoted:m})
            if(!isBotAdmin) return m.reply("Make me admin to use this command")
    
             if (args[0] === 'open'){
                await client.groupSettingUpdate(m.from, 'not_announcement').then((res) => m.reply(`*Group open*`)).catch((err) => m.reply(jsonformat(err)))
             } else if (args[0] === 'close'){
                await client.groupSettingUpdate(m.from, 'announcement').then((res) => m.reply(`*Group closed*`)).catch((err) => m.reply(jsonformat(err)))
             } else {
					const sections =`👉 Use *${prefix}group open*\nto open he group \n\n👉 Use *${prefix}group close*\nto close he group`
                    await client.sendMessage(m.from, {text:sections},{quoted:m})

            }
    }
}