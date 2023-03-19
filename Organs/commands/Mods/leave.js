module.exports = {
  name: "leave",
  alias: ["bye", "left"],
  usage: `${global.prefa}leave`,
  desc: "Leave the group",
  category: "Mods",
  react: "👋",

  start: async (
    client,
    m,
    { command, prefix, iscreator, participants, pushName }
  ) => {
    if (!iscreator) return m.reply("*👑 Only mod can use this command*");
    let json = [
      "https://images3.alphacoders.com/104/1049964.jpg",
      "https://images3.alphacoders.com/104/1047335.jpg",
      "https://images8.alphacoders.com/102/1024950.jpg",
      "https://images2.alphacoders.com/104/1046434.jpg",
      "https://i.pinimg.com/originals/fd/5b/74/fd5b74f5ffb74492928ca99f6695306c.png",
    ];
    let rae = json[Math.floor(Math.random() * json.length)];
    await client.sendMessage(m.from, {
      image: {
        url: rae,
      },
      caption: `Bot is being removed by *${pushName}* 😞`,
      mentions: participants.map((a) => a.id),
    });
    client.groupLeave(m.from).catch((e) => {
      client.sendMessage(m.from, { text: `An error Occurd !` }, { quoted: m });
    });
  },
};
