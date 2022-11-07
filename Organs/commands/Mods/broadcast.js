module.exports={
    name:"broadcast",
    alias:["bc"],
    usage:"=bc message",
    desc:"Broadcast messages to the groups",
    category:"Mods",
    react:"✅",

    start:async(client,m,{command,prefix,text,pushName,participants,args,iscreator,body,quoted,mime})=>{
        if(!iscreator) return client.sendMessage(m.from,{text:'*Only mods can use this command*'},{quoted:m})
        if (!text) return m.reply("❌ No query provided!")
        const bct=body.slice(4)
        let getGroups = await client.groupFetchAllParticipating()
        let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
        let anu = groups.map(v => v.id)
        m.reply(` Broadcasting in ${anu.length} Group Chat, in ${anu.length * 1.5} seconds`)
        for (let i of anu) {
            //await sleep(1500)

let txt = `🔰</ _*Nezuko Broadcast*_ >🔰\n\n🍀 *Author:* ${pushName}\n\n💬 *Message:* ${bct}`

if(/image/.test(mime)) {
let media = await quoted.download()

await client.sendMessage(i, { image:media,  caption: txt,mentions:participants.map(a => a.id) })
}
if(/video/.test(mime)){
let media = await quoted.download()
await client.sendMessage(i, { video:media,  caption: txt, mentions:participants.map(a => a.id) })
}
            }
        m.reply(`Successfuly Broadcasted in ${anu.length} Groups`)
    }
}