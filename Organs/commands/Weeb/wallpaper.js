const { AnimeWallpaper, AnimeSource  } = require("anime-wallpaper");
const wall = new AnimeWallpaper();
module.exports = {
  name: "wallpaper",
  alias: ["animewallpaper"],
  usage: `${global.prefa}wallpaper <query>`,
  desc: "Gives you the wallpaper...",
  category: "Weeb",
  react: "✅",

  start: async (client, m, { command, prefix, text, args }) => {
    const im = args.join(" ").split("#");
    const noi = Number(im[1]);
    if (!im[0]) return m.reply("No query found...");
    if (!im[1]) {
      const wallpaper = await wall
        .search({ title: im[0] }, AnimeSource.WallHaven)
        .catch(() => null);
      const i = Math.floor(Math.random() * wallpaper.length);
      client.sendMessage(
        m.from,
        { image: { url: wallpaper[i].image } },
        { quoted: m }
      );
    } else {
      const wallpaper = await wall
        .search({ title: im[0] }, AnimeSource.WallHaven)
        .catch(() => null);
        console.log(wallpaper)
      for (let i = 0; i < noi; i++) {
        client.sendMessage(
          m.from,
          { image: { url: wallpaper[i].image } },
          { quoted: m }
        );
      }
    }
  },
};
