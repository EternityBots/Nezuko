require('../../../handler/MessageHandler')
module.exports = {
	name: "demote",
	alias: ["dm"],
	desc: "Demote Admin To Member",
	react:"✅",
	category: "Group",
	start: async(client, m, { text, prefix, isBotAdmin,isAdmin,mentionByTag}) => {
		if(!isAdmin) return client.sendMessage(m.from,{text:"This is admin only command"},{quoted:m})
		if(!isBotAdmin) return m.reply("Make me admin to use this command")

const mention=mentionByTag
		let users = await (mention[0]) || m.msg.contextInfo.participant
		if (!users) return m.reply("❌ Couldn't find any userID in context")
		let name = await user.findOne({ id:users })
	await client.groupParticipantsUpdate(m.from, [users], "demote")
		await client.sendMessage(m.from,{text:`Successfully demoted ${name.name}`},{quoted:m})
	},
   
   
}