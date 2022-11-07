require ('../../../settings')
module.exports = {
	name: "remove",
	alias: ["remove","boom"],
	usage:`${prefa}remove @tag/quote`,
	desc: "remove Member from group",
	category: "Group",
	react:"✅",
	start: async(client, m, { text, prefix, isBotAdmin,isAdmin,mentionByTag}) => {
		if(!isAdmin) return client.sendMessage(m.from,{text:"This is admin only command"},{quoted:m})
		if(!isBotAdmin) return m.reply("Make me admin to use this command")
		const mention= await mentionByTag
		if(!isAdmin) return client.sendMessage(m.from,{text:"This is admin only command"},{quoted:m})
		let users = await (mention[0]) || m.msg.contextInfo.participant
		if (!users) return m.reply("❌ Couldn't find any userID in context")
			await client.groupParticipantsUpdate(m.from, [users], "remove")
			await client.sendMessage(m.from,{text:`Successfully removed`},{quoted:m})
	},
    
}