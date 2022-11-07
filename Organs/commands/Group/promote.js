require ('../../../settings')
module.exports = {
	name: "promote",
	alias: ["pm"],
	usage:`${prefa}promote @tag/quote`,
	desc: "Promote Member To Admin",
	react:"✅",
	category: "Group",
	start: async(client, m, { text, prefix, isBotAdmin,isAdmin,mentionByTag}) => {
		if(!isAdmin) return client.sendMessage(m.from,{text:"This is admin only command"},{quoted:m})
		if(!isBotAdmin) return m.reply("Make me admin to use this command")

		const mention= mentionByTag
		let users = await (mention[0]) || m.msg.contextInfo.participant
		if (!users) return m.reply("❌ Couldn't find any userID in context")
	const pu= await client.username(users)
			await client.groupParticipantsUpdate(m.from, [users], "promote")
			await client.sendMessage(m.from,{text:`Successfully promoted ${pu}`},{quoted:m})
	},
    
}