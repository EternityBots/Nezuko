require('../../../handler/MessageHandler')
const moment = require("moment-timezone")
module.exports = {
    name: "groupinfo",
    alias: ["gcinfo"],
    desc: "shows the groupinfo",
    cool:3,
    react:"✅",
    category: "Group",
    start: async(client, m,{pushName,text,args,wlc,participants,groupAdmin,metadata,groupName,nsfw,mods}) => {
        try {
            ppuser = await client.profilePictureUrl(m.from, 'image')
        } catch {
            ppuser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
        }
        let acy = mods.includes(`${m.from}`) || "false"
  let ay = wlc.includes(`${m.from}`) || "false"
  let ns=nsfw.includes(`${m.from}`) || "false"
const code = await client.groupInviteCode(m.from)
let ingfo = `*━━━━『🍀Group-Info🍀』━━━━*\n\n*🎐Name:* ${groupName}\n\n*🔩ID Group:* ${m.from}\n\n*🍀Made:* ${moment(`${metadata.creation}` * 1000).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss')}\n\n*🥇Group Owner:* @${metadata.owner.split('@')[0]}\n\n*🔍Number Of Admins:* ${groupAdmin.length}\n\n*🎍Number Of Participants:* ${participants.length}\n\n*🔍Desc:* \n\n${metadata.desc}\n\n*🟥Antilink:* ${acy}\n*🟨Events:* ${ay}\n*🍒NSFW*: ${ns}`
//m.reply(ingfo)
client.sendMessage(m.from, { image: {url:ppuser},caption:ingfo, mentions: [metadata.owner]} , { quoted: m})
    }
}