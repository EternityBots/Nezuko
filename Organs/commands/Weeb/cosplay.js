const axios = require("axios");
const fs = require("fs");
require("../../../settings");
module.exports = {
  name: "cosplay",
  alias: ["cos"],
  usage: `${prefa}cos`,
  desc: "Gives you random cosplay image",
  react: "✅",

  category: "Weeb",
  start: async (client, m, { command, prefix, text, args }) => {
    let wife = "https://cosplay-lovers-4pnv.onrender.com/cosplay";
    let buttons = [
      {
        buttonId: `${prefix}cos`,
        buttonText: {
          displayText: ">>",
        },
        type: 1,
      },
    ];

    let buttonMessage = {
      image: {
        url: wife,
      },
      caption: `*✈ Here you Go*`,
      footer: `*©Eternity-Team*`,
      buttons: buttons,
      headerType: 4,
    };
    client.sendMessage(m.from, buttonMessage, {
      quoted: m,
    });
  },
};
