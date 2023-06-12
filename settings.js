const fs = require("fs");
const chalk = require("chalk");
require("dotenv").config();
let gg = process.env.MODS;
if (!gg) {
  gg = "917003213983, 923087880256";
}

global.owner = gg.split(",");
global.mongodb = process.env.MONGODB || "mongodb+srv://tiktoktharusha2:<password>@cluster0.qb0imql.mongodb.net/?retryWrites=true&w=majority";
global.prefa = process.env.PREFIX || ".";
global.ggle = process.env.GOOGLE_API || "AIzaSyDCfwdaHmH1mTNh2WJNg3wFwJnjLAlNCfY";
global.wter = process.env.WEATHER_API || "2238e510368b441ea5c222257231206";
global.sessionId = process.env.SESSION_ID || "tharu";
global.malid = process.env.MAL_USERNAME || undefined;
global.malpass = process.env.MAL_PASSWORD || undefined;
global.port = process.env.PORT || 8080;

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update'${__filename}'`));
  delete require.cache[file];
  require(file);
});
