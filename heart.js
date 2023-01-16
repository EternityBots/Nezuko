require("./handler/MessageHandler");
require("./settings");
const {
  default: WASocket,
  DisconnectReason,
  downloadContentFromMessage,
  makeInMemoryStore,
  useSingleFileAuthState,
  jidDecode,
  fetchLatestBaileysVersion,
  delay,
  jidNormalizedUser,
  makeWALegacySocket,
  useSingleFileLegacyAuthState,
  DEFAULT_CONNECTION_CONFIG,
  DEFAULT_LEGACY_CONNECTION_CONFIG,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const chalk = require("chalk");
const pino = require("pino");
const yargs = require("yargs");
const path = require("path");
const qrcode = require("qrcode");
const { Boom } = require("@hapi/boom");
const { Collection, Simple } = require("./Organs/typings");
const Welcome = require("./handler/EventHandler");
const { serialize, WAConnection } = Simple;
const FileType = require("file-type");
const Commands = new Collection();
const cfonts = require("cfonts");
const mongoose = require("mongoose");
Commands.prefix = prefa;
const user = require("./models/user");
const express = require("express");
const axios = require("axios");
//let sesi=process.argv[2]
const session = `./tokens/test.json`;
const { state, saveState } = useSingleFileAuthState(session);
const { QuickDB } = require("quick.db");
global.db = new QuickDB();
//global.db = new Database(mongodb);
const { Pool } = require("pg");
//main().catch(err => console.log(err));
const proConfig = {
  connectionString: pgdb,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);
const readCommands = () => {
  let dir = path.join(__dirname, "./Organs/commands");
  let dirs = fs.readdirSync(dir);
  let cmdlist = {};
  try {
    dirs.forEach(async (res) => {
      let groups = res.toLowerCase();
      Commands.category = dirs.filter((v) => v !== "_").map((v) => v);
      cmdlist[groups] = [];
      let files = fs
        .readdirSync(`${dir}/${res}`)
        .filter((file) => file.endsWith(".js"));
      //console.log(files)
      for (const file of files) {
        const command = require(`${dir}/${res}/${file}`);
        cmdlist[groups].push(command);
        Commands.set(command.name, command);
        delay(100);
      }
    });
    Commands.list = cmdlist;
  } catch (e) {
    console.error(e);
  }
};
let cred, auth_row_count;
async function fetchauth() {
  try {
    auth_result = await pool.query("select * from auth;"); //checking auth table
    console.log("Fetching login data...");
    auth_row_count = await auth_result.rowCount;
    let data = auth_result.rows[0];
    // console.log("data ",data);
    if (auth_row_count == 0) {
      console.log("No login data found!");
    } else {
      console.log("Login data found!");
      cred = {
        creds: {
          noiseKey: JSON.parse(data.noisekey),
          signedIdentityKey: JSON.parse(data.signedidentitykey),
          signedPreKey: JSON.parse(data.signedprekey),
          registrationId: Number(data.registrationid),
          advSecretKey: data.advsecretkey,
          nextPreKeyId: Number(data.nextprekeyid),
          firstUnuploadedPreKeyId: Number(data.firstunuploadedprekeyid),
          serverHasPreKeys: Boolean(data.serverhasprekeys),
          account: JSON.parse(data.account),
          me: JSON.parse(data.me),
          signalIdentities: JSON.parse(data.signalidentities),
          lastAccountSyncTimestamp: 0, // To allow bot to read the messages
          // lastAccountSyncTimestamp: Number(data.lastaccountsynctimestampb),
          myAppStateKeyId: data.myappstatekeyid,
        },
        keys: state.keys,
      };
      cred.creds.noiseKey.private = Buffer.from(cred.creds.noiseKey.private);
      cred.creds.noiseKey.public = Buffer.from(cred.creds.noiseKey.public);
      cred.creds.signedIdentityKey.private = Buffer.from(
        cred.creds.signedIdentityKey.private
      );
      cred.creds.signedIdentityKey.public = Buffer.from(
        cred.creds.signedIdentityKey.public
      );
      cred.creds.signedPreKey.keyPair.private = Buffer.from(
        cred.creds.signedPreKey.keyPair.private
      );
      cred.creds.signedPreKey.keyPair.public = Buffer.from(
        cred.creds.signedPreKey.keyPair.public
      );
      cred.creds.signedPreKey.signature = Buffer.from(
        cred.creds.signedPreKey.signature
      );
      cred.creds.signalIdentities[0].identifierKey = Buffer.from(
        cred.creds.signalIdentities[0].identifierKey
      );
    }
  } catch (err) {
    console.log(err);
    console.log("Creating database..."); //if login fail create a db
    await pool.query(
      "CREATE TABLE auth(noiseKey text, signedIdentityKey text, signedPreKey text, registrationId text, advSecretKey text, nextPreKeyId text, firstUnuploadedPreKeyId text, serverHasPreKeys text, account text, me text, signalIdentities text, lastAccountSyncTimestamp text, myAppStateKeyId text);"
    );

    await fetchauth();
  }
}
const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});
try {
  fs.unlinkSync(`./test.json`);
} catch (err) {
  console.log("Auth File Already Deleted");
}
readCommands();
const PORT = port;
const app = express();
//const msgRetryCounterMap=MessageRetryMap
let QR_GENERATE = "invalid";

const connect = async () => {
  await fetchauth();
  if (auth_row_count != 0) {
    state.creds = cred.creds;
  }

  let { version, isLatest } = await fetchLatestBaileysVersion();
  let connOptions = {
    printQRInTerminal: true,
    browser: ["Nezuko", "Firefox", "105.0.1343.42"],
    logger: pino({ level: "silent" }),
    defautQueryTimeoutMs: undefined,
    auth: state,
    version,
  };
  const client = new WAConnection(WASocket(connOptions));
  const randomHexs = `#${((Math.random() * 0xffffff) << 0)
    .toString(16)
    .padStart(6, "0")}`;
  const randomHex = `#${((Math.random() * 0xffffff) << 0)
    .toString(16)
    .padStart(6, "0")}`;
  const randomHexx = `#${((Math.random() * 0xffffff) << 0)
    .toString(16)
    .padStart(6, "0")}`;

  await cfonts.say("NEZUKO\n\nBY\n\nETERNITY", {
    font: "block", // define the font face
    align: "center", // define text alignment
    colors: [randomHex, randomHexs], // define all colors
    background: "transparent", // define the background color, you can also use `backgroundColor` here as key
    letterSpacing: 2, // define letter spacing
    lineHeight: 2, // define the line height
    space: true, // define if the output text should have empty lines on top and on the bottom
    maxLength: "0", // define how many character can be on one line
    gradient: [randomHex, randomHexs, randomHexx], // define your two gradient colors
    independentGradient: false, // define if you want to recalculate the gradient for each new line
    transitionGradient: true, // define if this is a transition between colors directly
    env: "node", // define the environment CFonts is being executed in
  });
  await console.log("[SERVER STARTED]");
  store.bind(client.ev);

  client.ev.on("creds.update", () => {
    saveState();
    try {
      let noiseKey = JSON.stringify(state.creds.noiseKey);
      let signedIdentityKey = JSON.stringify(state.creds.signedIdentityKey);
      let signedPreKey = JSON.stringify(state.creds.signedPreKey);
      let registrationId = state.creds.registrationId;
      let advSecretKey = state.creds.advSecretKey;
      let nextPreKeyId = state.creds.nextPreKeyId;
      let firstUnuploadedPreKeyId = state.creds.firstUnuploadedPreKeyId;
      let serverHasPreKeys = state.creds.serverHasPreKeys;
      let account = JSON.stringify(state.creds.account);
      let me = JSON.stringify(state.creds.me);
      let signalIdentities = JSON.stringify(state.creds.signalIdentities);
      let lastAccountSyncTimestamp = state.creds.lastAccountSyncTimestamp;
      // let lastAccountSyncTimestamp = 0;
      let myAppStateKeyId = state.creds.myAppStateKeyId; //?

      // INSERT / UPDATE LOGIN DATA
      if (auth_row_count == 0) {
        console.log("Inserting login data...");
        pool.query(
          "INSERT INTO auth VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13);",
          [
            noiseKey,
            signedIdentityKey,
            signedPreKey,
            registrationId,
            advSecretKey,
            nextPreKeyId,
            firstUnuploadedPreKeyId,
            serverHasPreKeys,
            account,
            me,
            signalIdentities,
            lastAccountSyncTimestamp,
            myAppStateKeyId,
          ]
        );
        pool.query("commit;");
        console.log("New login data inserted!");
      } else {
        // console.log("Updating login data....");
        pool.query(
          "UPDATE auth SET noiseKey = $1, signedIdentityKey = $2, signedPreKey = $3, registrationId = $4, advSecretKey = $5, nextPreKeyId = $6, firstUnuploadedPreKeyId = $7, serverHasPreKeys = $8, account = $9, me = $10, signalIdentities = $11, lastAccountSyncTimestamp = $12, myAppStateKeyId = $13;",
          [
            noiseKey,
            signedIdentityKey,
            signedPreKey,
            registrationId,
            advSecretKey,
            nextPreKeyId,
            firstUnuploadedPreKeyId,
            serverHasPreKeys,
            account,
            me,
            signalIdentities,
            lastAccountSyncTimestamp,
            myAppStateKeyId,
          ]
        );
        pool.query("commit;");
        console.log("Login data updated!");
      }
    } catch (err) {
      console.log(err);
    }
  });

  client.ev.on("connection.update", async (update) => {
    const { lastDisconnect, connection, qr } = update;
    if (connection) {
      await console.info(`Connection Status : ${connection}`);
    }

    if (connection == "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete Session and Scan Again`);
        client.logout();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        connect();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        connect();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "Connection Replaced, Another New Session Opened, Please Close Current Session First"
        );
        client.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Scan Again And Run.`);
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        connect();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        connect();
      } else client.end(`Unknown DisconnectReason: ${reason}|${connection}`);
    }
    if (qr) {
      QR_GENERATE = qr;
    }
  });

  // Welcome
  client.ev.on("group-participants.update", async (m) => {
    Welcome(client, m);
  });

  client.ev.on("messages.upsert", async (chatUpdate) => {
    m = serialize(client, chatUpdate.messages[0]);

    if (!m.message) return;
    if (m.key && m.key.remoteJid == "status@broadcast") return;
    if (m.key.id.startsWith("BAE5") && m.key.id.length == 16) return;

    require("./handler/MessageHandler")(client, m, Commands, chatUpdate);
  });
  client.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };

  client.ev.on("contacts.update", async (update) => {
    for (let contact of update) {
      let id = client.decodeJid(contact.id);
      user.findOne({ id: id }).then((usr) => {
        if (!usr) {
          new user({ id: id, name: contact.notify }).save();
          console.log("user added");
        } else {
          user.updateOne({ id: id }, { name: contact.notify });
        }
      });
    }
  });
  /**
   *
   * @param {*} jid
   * @param {*} text
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  client.sendText = (jid, text, quoted = "", options) =>
    client.sendMessage(jid, { text: text, ...options }, { quoted });
  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} filename
   * @param {*} caption
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  client.sendFile = async (
    jid,
    path,
    fileName = "",
    caption = "",
    quoted = "",
    options = {}
  ) => {
    let types = await client.getFile(path, true);
    let { mime, ext, res, data, filename } = types;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let type = "",
      mimetype = mime,
      pathFile = filename;
    if (options.asDocument) type = "document";
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require("./lib/exif");
      let media = { mimetype: mime, data };
      pathFile = await writeExif(media, {
        packname: options.packname ? options.packname : global.packname,
        author: options.author ? options.author : global.author,
        categories: options.categories ? options.categories : [],
      });
      await fs.promises.unlink(filename);
      type = "sticker";
      mimetype = "image/webp";
    } else if (/image/.test(mime)) type = "image";
    else if (/video/.test(mime)) type = "video";
    else if (/audio/.test(mime)) type = "audio";
    else type = "document";
    await client.sendMessage(
      jid,
      { [type]: { url: pathFile }, caption, mimetype, fileName, ...options },
      { quoted, ...options }
    );
    return fs.promises.unlink(pathFile);
  };
  /**
   *
   * @param {*} message
   * @param {*} filename
   * @param {*} attachExtension
   * @returns
   */
  client.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? filename + "." + type.ext : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  client.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
  };
  /**
   *
   * @param {*} jid
   * @returns
   */
  client.username = async (jid) => {
    let name = await user.findOne({ id: jid });
    if (!name) {
      unme = "user";
    } else {
      unme = name.name;
    }
    return unme;
  };
};

connect();

app.use(async (req, res) => {
  res.setHeader("content-type", "image/png");
  res.end(await qrcode.toBuffer(QR_GENERATE));
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
