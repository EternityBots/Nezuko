module.exports = {
  name: "help",
  alias: ["h", "menu"],
  desc: "List all command",
  category: "General",
  react: "✅",
  start: async (client, m, { commands, args, prefix, text, toUpper }) => {
    const { pushName, sender } = m;
    if (args[0]) {
      let data = [];
      let name = args[0].toLowerCase();
      let cmd =
        commands.get(name) ||
        Array.from(commands.values()).find((v) => v.alias.includes(name));
      if (!cmd || cmd.type == "hide") return m.reply("No Command Found");
      else
        data.push(
          `*🍁Command :* ${cmd.name.replace(/^\w/, (c) => c.toUpperCase())}`
        );
      if (cmd.alias) data.push(`*👾Alias :* ${cmd.alias.join(", ")}`);
      if (cmd.cool) data.push(`*⏱️Cooldown:* ${cmd.cool}`);
      if (cmd.desc) data.push(`*🧾Description :* ${cmd.desc}`);
      if (cmd.usage)
        data.push(
          `*💡Example :* ${cmd.usage
            .replace(/%prefix/gi, prefix)
            .replace(/%command/gi, cmd.name)
            .replace(/%text/gi, text)}`
        );
      var buttonss = [
        {
          buttonId: `${prefix}help`,
          buttonText: { displayText: `help` },
          type: 1,
        },
      ];
      let buth = {
        text: `*ℹ️Command Info*\n\n${data.join("\n")}`,
        footer: "*©Eternity-Team*",
        buttons: buttonss,
        headerType: 1,
      };
      return client.sendMessage(m.from, buth, { quoted: m });
    } else {
      const { pushName, sender } = m;
      let cm = commands.keys();
      let category = [];

      for (let cmd of cm) {
        let info = commands.get(cmd);
        if (!cmd) continue;
        if (!info.category || info.category === "private") continue;
        if (
          !info?.category ||
          (info.category === "Nsfw" && !nsfw.includes(m.from))
        )
          continue;
        if (Object.keys(category).includes(info.category))
          category[info.category].push(info);
        else {
          category[info.category] = [];
          category[info.category].push(info);
        }
      }
      if (!nsfw.includes(m.from)) {
        var emo = ["📖","🎉", "🍁", "🍀", "🌊", "🎵", "🎟", "♨️", "🉐"];
      } else {
        var emo = ["📖","🎉", "🍁", "🍀", "🌊", "🎵", "🔞", "🎟", "♨️", "🉐"];
      }
      let txt = `*Kon'nichiwa (｡♡‿♡｡)* ${pushName} Watashiwa *Nezuko*.
                       
🧧 *Prefix :* [ ${prefix} ]
                       
📝 Here's the *Commands* listed below :\n\n`;
      const keys = Object.keys(category);
      for (const key of keys) {
        txt += `*${key.toUpperCase()} ${
          emo[keys.indexOf(key)]
        } :-*  \n\`\`\`${category[key]
          .map((cmd) => cmd.name)
          .join(", ")}\`\`\`\n\n`;
      }
      txt += `📗 Type *${prefix}help* <Command-Name> or <Command-Name> --info\n`;
      const eternity = [
        "https://images3.alphacoders.com/107/1078895.png",
        "https://images6.alphacoders.com/103/1037400.png",
        "https://images6.alphacoders.com/102/1020806.jpg",
        "https://images7.alphacoders.com/104/1040192.jpg",
        "https://images5.alphacoders.com/104/1045349.jpg",
        "https://images6.alphacoders.com/102/1024472.png",
        "https://images8.alphacoders.com/120/1206401.jpg",
        "https://images8.alphacoders.com/122/1222661.png",
        "https://images3.alphacoders.com/120/1207252.jpg",
        "https://images2.alphacoders.com/125/1258571.jpg",
        "https://images7.alphacoders.com/125/1258568.jpg",
        "https://images2.alphacoders.com/125/1258571.jpg",
        "https://images2.alphacoders.com/125/1254189.jpg",
      ];
      const eternitylogo =
        eternity[Math.floor(Math.random() * eternity.length)];
      const Button = [
        {
          buttonId: `${prefix}nezuko`,
          buttonText: { displayText: "🌟 Script" },
          type: 2,
        },
        {
          buttonId: `${prefix}support`,
          buttonText: { displayText: "🎐 Support" },
          type: 1,
        },
      ];
      let hbutto = {
        image: { url: eternitylogo },
        caption: txt,
        footer: "©Eternity-Team",
        buttons: Button,
        headerType: 4,
      };

      client.sendMessage(m.from, hbutto, { quoted: m });
    }
  },
};
