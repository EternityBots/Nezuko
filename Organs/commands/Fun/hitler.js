const canvacord = require("canvacord");
module.exports = {
    name: "hitler",
    alias: ["worst"],
    usage: `${prefa}hitler <mention>`,
    react: "🎉",
    category: "Fun",
    start: async (client, m, { command, pushName, groupName, isAdmin, iscreator, mentionByTag, prefix, text, args, quoted, mime }) => {

        if (m.quoted) {
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image')
            } catch {
                img = "https://i.pinimg.com/564x/84/09/12/840912dd744e6662ab211b8070b5d84c.jpg"
            }
            result = await canvacord.Canvacord.hitler(img);
        } else if (mentionByTag) {
            try {
                ppuser = await client.profilePictureUrl(mentionByTag[0] || m.sender, 'image')
            } catch {
                ppuser = 'https://i.pinimg.com/564x/84/09/12/840912dd744e6662ab211b8070b5d84c.jpg'
            }
            result = await canvacord.Canvacord.hitler(ppuser);
        } 
        await client.sendMessage(m.from, { image: result }, { quoted: m });
    }
}