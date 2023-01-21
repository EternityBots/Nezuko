require("../../../handler/MessageHandler");
module.exports = {
  name: "enable",
  alias: ["act", "register"],
  desc: "enables the commands",
  cool: 3,
  react: "✅",
  category: "Group",
  start: async (
    client,
    m,
    { text, args, prefix, isBotAdmin, isAdmin, mentionByTag }
  ) => {
    if (!isAdmin)
      return client.sendMessage(
        m.from,
        { text: "This is admin only command" },
        { quoted: m }
      );
    if (!isBotAdmin) return m.reply("Make me admin to use this command");
    if (!text) return m.reply("No option provided!!");
    if (args[0] == "mod") {
      if (mods.includes(`${m.from}`))
        return m.reply("🛡 *Mod* is already enabled");

      await db.push("mods", `${m.from}`);
      m.reply("💮 Successfully Enabled *Mod*");
    }
    if (args[0] == "nsfw") {
      if (nsfw.includes(`${m.from}`))
        return m.reply("🛡 *Nsfw* is already enabled");

      await db.push("nsfw", `${m.from}`);
      m.reply("💮 Successfully Enabled *Nsfw*");
    }
    if (args[0] == "events" || args[0] == "event") {
      if (wlc.includes(`${m.from}`))
        return m.reply("🛡 *Events* is already enabled");

      await db.push("events", `${m.from}`);
      m.reply("💮 Successfully Enabled *Events*");
    }
  },
};
