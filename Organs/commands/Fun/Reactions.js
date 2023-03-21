const { buffergif, fetchJson, fetchBuffer } = require('../../../lib/Function');

const suitableWords = {
  bite: 'Bit', blush: 'Blushed at', bonk: 'Bonked', bully: 'Bullied', cringe: 'Cringed at',
  cry: 'Cried in front of', cuddle: 'Cuddled', dance: 'Danced with', glomp: 'Glomped at', handhold: 'Held the hands of', happy: 'is Happied with',
  highfive: 'High-fived', hug: 'Hugged', kick: 'Kicked', kill: 'Killed', kiss: 'Kissed', lick: 'Licked',
  nom: 'Nomed', pat: 'Patted', poke: 'Poked', slap: 'Slapped', smile: 'Smiled at', smug: 'Smugged',
  wave: 'Waved at', wink: 'Winked at', yeet: 'Yeeted at'
};

const reactions = Object.keys(suitableWords)

module.exports = {
  name: 'reaction',
  desc: "React to someone's message with a gif specified by the user.",
  alias: ['r', ...reactions],
  category: 'Fun',
  usage: `${prefa}reaction`,
  react: '😗',
  start: async (client, m, { text, prefix, mentionByTag }) => {
    const command = m.body.split(' ')[0].toLowerCase().slice(prefix.length).trim()
    const capitalize = (content) => `${content.charAt(0).toUpperCase()}${content.slice(1)}`
    let flag = true
    if (command === 'r' || command === 'reaction') flag = false
    if (!flag && !text) {
      const reactionList = `🎃 *Available Reactions:*\n\n- ${reactions.map((reaction) => capitalize(reaction)).join('\n- ')}\n🛠️ *Usage:* ${prefix}reaction (reaction) [tag/quote user] | ${prefix}(reaction) [tag/quote user]\nExample: ${prefix}pat`
      return void (await m.reply(reactionList))
    }
    const reaction = flag ? command : text.split(' ')[0].trim().toLowerCase()
    if (!flag && !reactions.includes(reaction))
      return void m.reply(`Invalid reaction. Use *${prefix}react* to see all of the available reactions`)
    const users = mentionByTag
    if (m.quoted && !users.includes(m.quoted.sender)) users.push(m.quoted.sender)
    while (users.length < 1) users.push(m.sender)
    const reactant = users[0]
    const single = reactant === m.sender
    const { url } = await fetchJson(`https://api.waifu.pics/sfw/${reaction}`)
    const result = await fetchBuffer(url);
    const buffer = await buffergif(result);
    await client.sendMessage(m.from, {
        video: buffer,
        gifPlayback: true,
        caption: `*@${m.sender.split('@')[0]} ${suitableWords[reaction]} ${single ? 'Themselves' : `@${reactant.split('@')[0]}`}*`,
        mentions: [m.sender, reactant],
    }, { quoted: m });
  }
}
