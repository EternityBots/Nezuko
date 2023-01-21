const { Mal } = require("node-myanimelist");
const fs = require("fs");
require("../../../settings");
module.exports = {
  name: "anime",
  alias: ["ani"],
  usage: `${prefa}anime <any anime name>`,
  desc: "Gives you details of anime.",
  react: "✅",
  category: "Weeb",
  start: async (client, m, { command, prefix, text, args }) => {
    try {
      if (!text) return m.reply(`❌ No query provided!`);
      if (malid == undefined)
        return m.reply(`Username not set for myanimelist.net`);
      if (malpass == undefined)
        return m.reply(`Password not set for myanimelist.net`);
      const auth = Mal.auth("6114d00ca681b7701d1e15fe11a4987e");
      const logIn = await auth.Unstable.login(malid, malpass);
      const anime = await logIn.anime
        .search(text, Mal.Anime.fields().all())
        .call()
        .catch(() => {});
      const result = anime.data[0].node;
      let aa = "";
      aa += `🎀 *Title: ${result.title}*\n`;
      aa += `🎋 *Format: ${result.media_type.toUpperCase()}*\n`;
      aa += `📈 *Status: ${result.status.toUpperCase().replace(/\_/g, " ")}*\n`;
      aa += `🍥 *Total episodes: ${result.num_episodes}*\n`;
      aa += `🧧 *Genres:*\n`;
      for (let i = 0; i < result.genres.length; i++) {
        aa += `*${result.genres[i].name}*\n`;
      }
      aa += `✨ *Based on: ${result.source}*\n`;
      aa += `📍 *Studios:*\n`;
      for (let i = 0; i < result.studios.length; i++) {
        aa += `*${result.studios[i].name}*\n`;
      }
      aa += `💫 *Premiered on: ${result.start_date}*\n`;
      aa += `🎗 *Ended on: ${result.end_date}*\n`;
      aa += `🎐 *Popularity: ${result.popularity}*\n`;
      aa += `🏅 *Rank: ${result.rank}*\n\n`;
      aa += `🌐 *URL: https://myanimelist.net/anime/${result.id}*\n\n`;
      aa += `❄ *Description:* ${result.synopsis.replace(
        /\[Written by MAL Rewrite]/g,
        ""
      )}`;
      await client.sendMessage(
        m.from,
        { image: { url: result.main_picture.large }, caption: aa },
        { quoted: m }
      );
    } catch (err) {
      return m.reply(`*${text}* is not a valid anime`);
    }
  },
};
