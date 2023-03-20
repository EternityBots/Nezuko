const yts= require("yt-search")
module.exports={
    name:"play",
    alias:["audio","song","video"],
    usage:`${global.prefa}play <query>`,
    desc:"Plays the Video and Audio",
    category:"Media",
    react:"📼",
    start:async(client,m,{command,prefix,text,args})=>{
               
if(!text) return client.sendMessage(m.from,{text:"What you want to play"},{quoted:m})
let yts = require("yt-search")
    let search = await yts(text)
    let anu = search.videos[0]
let reply = "";
    reply += `🎀 *Title:* ${anu.title}\n\n`;
    reply += `📊 *Views:* ${anu.views}\n\n`;
    reply += `⏳ *Timestamp:* ${anu.timestamp}\n\n`
    reply += `🌐 *Url:* ${anu.url}\n\n`
    reply += `📖 *Description:* ${anu.description}\n\n`

    const Button = [
        {
          buttonId: `${prefix}yta ${anu.url}`,
          buttonText: { displayText: "▷ Audio" },
          type: 2,
        },
        {
          buttonId: `${prefix}ytv ${anu.url}`,
          buttonText: { displayText: "■ Video" },
          type: 1,
        },
      ];
      let hbutto = {
        image: { url: anu.thumbnail },
        caption: reply,
        footer: "©Eternity-Team",
        buttons: Button,
        headerType: 4,
      };

      client.sendMessage(m.from, hbutto, { quoted: m });
    }
}