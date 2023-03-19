module.exports = {
  name: "mods",
  alias: ["mod"],
  usage: `${global.prefa}mods`,
  desc: "shows mods list",
  category: "General",
  react: "✅",

  start: async (client, m, {}) => {
    const mod = global.owner;
    const owner = mod.map((mod) => mod + "@s.whatsapp.net");
    let mo = `
       *🎉 Nᴇᴢᴜᴋᴏ Mᴏᴅs 🎉*\n\n`;
    for (let i = 0; i < mod.length; i++) {
      const um = await client.username(mod[i] + "@s.whatsapp.net");
      mo += `\n*👑 Name:* ${um}\n*🎖️ Tag:* @${mod[i].split("@")[0]}\n`;
    }
    let urlll = [
      "https://static.moewalls.com/videos/preview/2022/neko-nezuko-kimetsu-no-yaiba-preview.mp4",
      "https://static.moewalls.com/videos/preview/2022/nezuko-lying-on-the-water-kimetsu-no-yaiba-preview.mp4",
      "https://static.moewalls.com/videos/preview/2022/nezuko-kamado-demon-slayer-preview.mp4",
      "https://upcdn.io/FW25b6N/raw/y2mate.com%20-%20%20Kamado%20Nezuko%20%20%20Kimetsu%20no%20Yaiba%20%20%20Wallpaper%20Live%204K%20%20%20Wallpaper%20Engine%20%20%20Demon%20slayer%20_360p%20(1).mp4",
    ];
    let rae = urlll[Math.floor(Math.random() * urlll.length)];
    await client.sendMessage(
      m.from,
      { video: { url: rae }, gifPlayback: true, caption: mo, mentions: owner },
      { quoted: m }
    );
  },
};
