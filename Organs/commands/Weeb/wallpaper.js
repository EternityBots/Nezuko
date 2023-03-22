const fs = require("fs");
require("../../../settings");
const { AnimeWallpaper } = require("anime-wallpaper");
const wall = new AnimeWallpaper();
module.exports = {
  name: "wallpaper",
  alias: ["animewallpaper"],
  usage: `${prefa}allpaper <query>`,
  desc: "Gives you the wallpaper...",
  category: "Weeb",
  react: "✅",

  start: async (client, m, { command, prefix, text, args }) => {
    const im = args.join(" ").split("#");
    const noi = Number(im[1]);
    if (!im[0]) return m.reply("No query found...");
    if (!im[1]) {
      const pages = [1, 2, 3, 4];
      const random = pages[Math.floor(Math.random() * pages.length)];
      const wallpaper = await wall
        .getAnimeWall4({
          title: im[0],
          type: "sfw",
          page: pages,
        })
        .catch(() => null);
      const i = Math.floor(Math.random() * wallpaper.length);
      client.sendMessage(m.from, {image:{url:wallpaper[i].image}}, {
        quoted: m,
      });
    }
  },
};
