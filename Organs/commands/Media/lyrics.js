const findLyrics = require('simple-find-lyrics');
module.exports = {
    name: "lyrics",
    alias: ["ly"],
    usage:`${prefa}lyrics <query>`,
    desc: "Finds the lyrics of the given song",
    category: "Media",
    cool:3,
    start: async(client, m,{text,pushName}) => {       
if (!text) return m.reply(`❌ No query provided!`)
try {
const lyrics = await findLyrics(text)
if (lyrics.lyrics == '') return console.log("it's f up")
var txt = `
*📕 Title :* ${lyrics.title}

*🧑🏻‍🎤 Artist :* ${lyrics.artist}

*🎶 Lyrics :-* \n
${lyrics.lyrics}
`
 console.log(lyrics)
 await client.sendMessage(m.from, {text:txt},{quoted:m})
} catch (err) {
    console.log(err)
    }
  }
}
