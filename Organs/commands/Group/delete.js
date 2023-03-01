require("../../../settings");
module.exports = {
  name: "delete",
  alias: ["del"],
  usage: `${prefa}delete <quoted message>`,
  desc: "Delete the bot message/also deletes others message",
  react: "✅",
  category: "Group",
  start: async (
    client,
    m,
    { command, prefix, iscreator, args, quoted, isAdmin, isBotAdmin }
  ) => {
    let key;
    if ( !iscreator && !isAdmin) return m.reply("```Only Mod or Admin can delete message```")
    if (!m.quoted) return m.reply("```Please mention someone to delete message```")
    if (!isBotAdmin) {
      key = {
        remoteJid: m.from,
        fromMe: true,
        id: m.quoted.id,
      };
    } else {
      key = {
        remoteJid: m.from,
        fromMe: false,
        id: m.quoted.id,
        participant: m.quoted.sender,
      };
    }
    await client.sendMessage(m.from, { delete: key });
  },
};
