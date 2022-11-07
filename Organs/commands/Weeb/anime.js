const malScraper = require('mal-scraper')
const fs = require("fs")
require ('../../../settings')
module.exports = {
    name: "anime",
    alias: ["ani"],
    usage: `${prefa}anime <any anime name>`,
    desc: "Gives you details of anime.",
    react: "✅",
    
    category: "Weeb",
    start: async (client, m, {
        command,
        prefix,
        text,
        args
    }) => {
        if (!text) return m.reply(`❌ No query provided!`)
        const anime = await malScraper.getInfoFromName(text).catch(() => null)
        if (!anime) return m.reply(`Couldn't find any matching term.`)
let txt = `
🎀 *Title: ${anime.title}*
🎋 *Type: ${anime.type}*
🎐 *Premiered on: ${anime.premiered}*
💠 *Total Episodes: ${anime.episodes}*
📈 *Status: ${anime.status}*
💮 *Genres: ${anime.genres}
📍 *Studio: ${anime.studios}*
🌟 *Score: ${anime.score}*
💎 *Rating: ${anime.rating}*
🏅 *Rank: ${anime.ranked}*
💫 *Popularity: ${anime.popularity}*
♦️ *Trailer: ${anime.trailer}*
🌐 *URL: ${anime.url}*
❄ *Description:* ${anime.synopsis}*
`
                await client.sendMessage(m.from,{image:{url:anime.picture}, caption:txt},{quoted:m})
        }
    }