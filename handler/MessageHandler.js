require("../heart");
require("../settings");
const {
  generateWAMessage,
  areJidsSameUser,
  proto,
} = require("@whiskeysockets/baileys");
const { Function } = require("../lib");
const { Collection, Simple } = require("../Organs/typings");
const { isUrl, isNumber } = Function;
const Func = require("../lib");
const fs = require("fs");
const moment = require("moment-timezone");
const chalk = require("chalk");
const cool = new Collection();
const { table } = require("console");
const Mongo_URL = mongodb;
global.Levels = require("discord-xp");
Levels.setURL(Mongo_URL);
console.log("Connected to the database1");
const prefix = prefa;
const mongoose = require("mongoose");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(Mongo_URL);
}
global.user = require("../models/user");

module.exports = async (client, m, commands, chatUpdate) => {
  try {
    let { type, isGroup, sender, from } = m;
    let body =
      type == "buttonsResponseMessage"
        ? m.message[type].selectedButtonId
        : type == "listResponseMessage"
        ? m.message[type].singleSelectReply.selectedRowId
        : type == "templateButtonReplyMessage"
        ? m.message[type].selectedId
        : m.text;
    let prat =
      type === "conversation" && body?.startsWith(prefix)
        ? body
        : (type === "imageMessage" || type === "videoMessage") &&
          body &&
          body?.startsWith(prefix)
        ? body
        : type === "extendedTextMessage" && body?.startsWith(prefix)
        ? body
        : type === "buttonsResponseMessage" && body?.startsWith(prefix)
        ? body
        : type === "listResponseMessage" && body?.startsWith(prefix)
        ? body
        : type === "templateButtonReplyMessage" && body?.startsWith(prefix)
        ? body
        : "";
    let metadata = isGroup ? await client.groupMetadata(from) : {};
    let pushname = m.pushName || "NO name";
    let participants = isGroup ? metadata.participants : [sender];
    const groupName = isGroup ? metadata.subject : "";
    const iscreator = [...global.owner]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
    let groupAdmin = isGroup
      ? participants.filter((v) => v.admin !== null).map((v) => v.id)
      : [];
    const botNumber = await client.decodeJid(client.user.id);
    let isBotAdmin = isGroup ? groupAdmin.includes(botNumber) : false;
    let isAdmin = isGroup ? groupAdmin.includes(sender) : false;
    //////////Database\\\\\\\\\\\\\\\\
    const _mods = await db.get("mods");
    global.mods = _mods || [];
    const _ban = await db.get("ban");
    global.ban = _ban || [];
    const _nsfw = await db.get("nsfw");
    global.nsfw = _nsfw || [];
    let wel = await db.get("events");
    global.wlc = wel || [];
    let isCmd = body.startsWith(prefix);
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || m.msg).mimetype || " ";
    let isMedia = /image|video|sticker|audio/.test(mime);
    let budy = typeof m.text == "string" ? m.text : "";
    let args = body.trim().split(/ +/).slice(1);
    let ar = args.map((v) => v.toLowerCase());
    let text = (q = args.join(" "));
    const cmdName = prat
      .slice(prefix.length)
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
    const cmd =
      commands.get(cmdName) ||
      Array.from(commands.values()).find((v) =>
        v.alias.find((x) => x.toLowerCase() == cmdName)
      ) ||
      "";
    const icmd =
      commands.get(cmdName) ||
      Array.from(commands.values()).find((v) =>
        v.alias.find((x) => x.toLowerCase() == cmdName)
      );

    const mentionByTag =
      type == "extendedTextMessage" &&
      m.message.extendedTextMessage.contextInfo != null
        ? m.message.extendedTextMessage.contextInfo.mentionedJid
        : [];
    const flags = args.filter((arg) => arg.startsWith("--"));
    if (body.startsWith(prefix) && !icmd) {
      var rae = `https://i.ibb.co/c33ZHCx/wallpaperflare-com-wallpaper.jpg`;
      let txtt = `*${prefix}${cmdName}* is an ⛔ invalid command \nuse *${prefix}help* to see help menu`;
      client.sendMessage(m.from, {image:{url:rae}, caption:txtt}, { quoted: m });
    }

    if (m.message && isGroup && cmd) {
      console.log(
        "" + "\n" + chalk.black(chalk.bgWhite("[ GRUP ]")),
        chalk.black(
          chalk.bgBlueBright(isGroup ? metadata.subject : m.pushName)
        ) +
          "\n" +
          chalk.black(chalk.bgWhite("[ TIME ]")),
        chalk.black(chalk.bgBlueBright(new Date())) +
          "\n" +
          chalk.black(chalk.bgWhite("[ FROM ]")),
        chalk.black(
          chalk.bgBlueBright(m.pushName + " @" + m.sender.split("@")[0])
        ) +
          "\n" +
          chalk.black(chalk.bgWhite("[ BODY ]")),
        chalk.black(chalk.bgBlueBright(body || type)) + "\n" + ""
      );
    }
    if (m.message && !isGroup) {
      console.log(
        "" + "\n" + chalk.black(chalk.bgWhite("[ PRIV ]")),
        chalk.black(chalk.bgRedBright("PRIVATE CHAT")) +
          "\n" +
          chalk.black(chalk.bgWhite("[ TIME ]")),
        chalk.black(chalk.bgRedBright(new Date())) +
          "\n" +
          chalk.black(chalk.bgWhite("[ FROM ]")),
        chalk.black(
          chalk.bgRedBright(m.pushName + " @" + m.sender.split("@")[0])
        ) +
          "\n" +
          chalk.black(chalk.bgWhite("[ BODY ]")),
        chalk.black(chalk.bgRedBright(body || type)) + "\n" + ""
      );
    }
    if (isGroup && mods.includes(`${m.from}`)) {
      if (body.includes("://chat.whatsapp.com/")) {
        if (iscreator) {
          return m.reply("*Ohhh you are mod*");
        } else if (isAdmin) {
          return m.reply("*Ohhh you are admin*");
        } else {
          let key;
          key = {
            remoteJid: m.from,
            fromMe: false,
            id: m.id,
            participant: m.sender,
          };
          await client.sendMessage(m.from, { delete: key });
          await client.groupParticipantsUpdate(m.from, [m.sender], "remove");
        }
      }
    }
    if (isGroup && mods.includes(`${m.from}`)) {
      if (body.includes("://api.whatsapp.com/")) {
        if (iscreator) {
          return m.reply("*Ohhh you are mod*");
        } else if (isAdmin) {
          return m.reply("*Ohhh you are admin*");
        } else {
          let key;
          key = {
            remoteJid: m.from,
            fromMe: false,
            id: m.id,
            participant: m.sender,
          };
          await client.sendMessage(m.from, { delete: key });
          await client.groupParticipantsUpdate(m.from, [m.sender], "remove");
        }
      }
    }
    if (cmd) {
      const randomXp = Math.floor(Math.random() * 3) + 1; //Random amont of XP until the number you want + 1
      const haslUp = await Levels.appendXp(m.sender, "bot", randomXp);
    }
    if (text.endsWith("--info")) {
      let data = [];
      if (cmd.alias) data.push(`*Alias :* ${cmd.alias.join(", ")}`);

      if (cmd.desc) data.push(`*Description :* ${cmd.desc}\n`);
      if (cmd.usage)
        data.push(
          `*Example :* ${cmd.usage
            .replace(/%prefix/gi, prefix)
            .replace(/%command/gi, cmd.name)
            .replace(/%text/gi, text)}`
        );
      var buttonss = [
        {
          buttonId: `${prefix}help`,
          buttonText: { displayText: `help` },
          type: 1,
        },
      ];
      let buth = {
        text: `*Command Info*\n\n${data.join("\n")}`,
        footer: "Eternity",
        buttons: buttonss,
        headerType: 1,
      };
      return client.sendMessage(m.from, buth, { quoted: m });
    }
    if (!isGroup && cmd && !iscreator)
      return m.reply("*You cant use commands in dm*");
    if (cmd) {
      if (ban.includes(`${m.sender}`))
        return m.reply(`You are banned from using commands ❌`);
    }
    if (cmd.react) {
      const reactm = {
        react: {
          text: cmd.react,
          key: m.key,
        },
      };
      await client.sendMessage(m.from, reactm);
    }
    if (!cool.has(m.sender)) {
      cool.set(m.sender, new Collection());
    }
    const now = Date.now();
    const timestamps = cool.get(m.sender);
    const cdAmount = (cmd.cool || 0) * 1000;
    if (timestamps.has(m.sender)) {
      const expiration = timestamps.get(m.sender) + cdAmount;

      if (now < expiration) {
        let timeLeft = (expiration - now) / 1000;
        //printSpam(isGroup, sender);
        return await client.sendMessage(
          m.from,
          {
            text: `You are on cooldown, please wait another _${timeLeft.toFixed(
              1
            )} second(s)_`,
          },
          { quoted: m }
        );
      }
    }
    timestamps.set(m.sender, now);
    setTimeout(() => timestamps.delete(m.sender), cdAmount);

    cmd.start(client, m, {
      name: "client ",
      metadata,
      pushName: pushname,
      participants,
      body,
      ban,
      args,
      ar,
      nsfw,
      isAdmin,
      groupAdmin,
      groupName,
      text,
      wlc,
      mods,
      quoted,
      flags,
      mentionByTag,
      mime,
      isBotAdmin,
      prefix,
      iscreator,
      command: cmd.name,
      commands,
      Function: Func,
      toUpper: function toUpper(query) {
        return query.replace(/^\w/, (c) => c.toUpperCase());
      },
    });
  } catch (e) {
    e = String(e);
    if (!e.includes("cmd.start")) console.error(e);
  }
};
