const axios = require("axios");
const fs = require("fs");
require("../../../settings");
module.exports = {
  name: "nneko",
  alias: ["nsfwneko"],
  usage: `${prefa}nneko`,
  desc: "Gives you random hentai neko image",
  react: "💦",

  category: "Nsfw",
  start: async (client, m, { command, prefix, text, args }) => {
    if (!nsfw.includes(`${m.from}`))
      return m.reply("*❌ This not a hentai group pervert*");

    let wife = await axios.get("https://api.waifu.pics/nsfw/neko");
    let buttons = [
      {
        buttonId: `${prefix} nneko`,
        buttonText: { displayText: ">>" },
        type: 1,
      },
    ];

    let buttonMessage = {
      image: { url: wife.data.url },
      caption: `*🥵 NYAAAAAAA*`,
      footer: `*©Eternity-Team*`,
      buttons: buttons,
      headerType: 4,
    };
    client.sendMessage(m.from, buttonMessage, { quoted: m });
  },
};
