const { Mal } = require("node-myanimelist");
const fs = require("fs");
require("../../../settings");
module.exports = {
  name: "manga",
  alias: ["comic", "mnga"],
  usage: `${prefa}manga <any manga name>`,
  desc: "Gives you details of manga.",
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
      const search = await logIn.manga
        .search(text, Mal.Manga.fields().all())
        .call()
        .catch(() => []);
      let aa = "";
      aa += `🎀 *Title: ${search.data[0].node.title}*\n`;
      aa += `📈 *Status: ${search.data[0].node.status}*\n`;
      aa += `🌸 *Total Volumes: ${search.data[0].node.num_volumes}*\n`;
      aa += `🎗 *Total Chapters: ${search.data[0].node.num_chapters}*\n`;
      aa += `✨ *Published on: ${search.data[0].node.start_date}*\n`;
      aa += `🌟 *Score: ${search.data[0].node.mean}*\n`;
      aa += `✍ *Author: ${search.data[0].node.authors[0].node.first_name} ${search.data[0].node.authors[0].node.last_name}*\n\n`;
      aa += `🌐 *MyAnimeList URL: https://myanimelist.net/manga/${search.data[0].node.id}*\n\n`;
      aa += `❄️ *Description:* ${search.data[0].node.synopsis.replace(
        /\[Written by MAL Rewrite]/g,
        ""
      )}`;
      await client.sendMessage(
        m.from,
        { image: { url: search.data[0].node.main_picture.large }, caption: aa },
        { quoted: m }
      );
    } catch (err) {
      return m.reply(`*${text}* is not a valid manga`);
    }
  },
};
