require("../../../settings");
module.exports = {
  name: "stalk",
  alias: ["stalknumber"],
  usage: `${prefa}stalk 9181011679xx`,
  react: "✅",
  desc: "To find all WhatsApp numbers in the provided range",
  category: "General",
  start: async (
    client,
    m,
    {
      text,
      ban,
      pushName,
      mentionByTag,
      iscreator,
      args,
      body,
      quoted,
      mime,
      prefix,
    }
  ) => {
    if (!args[0])
      return m.reply(`Use command like: ${prefix}stalk 9181011564xxx`);
    var inputnumber = args[0];
    if (!inputnumber.includes("x")) return m.reply("You didnot added x");
    if (inputnumber.includes("xxxx"))
      return m.reply("Maximum 3 'x' are allowed ! To avoid ban !");
    m.reply(
      `Searching for WhatsApp accounts in given range...\n\nPlease wait for a minute...`
    );
    function countInstances(string, word) {
      return string.split(word).length - 1;
    }
    var number0 = inputnumber.split("x")[0];
    var number1 = inputnumber.split("x")[countInstances(inputnumber, "x")]
      ? inputnumber.split("x")[countInstances(inputnumber, "x")]
      : "";
    var random_length = countInstances(inputnumber, "x");
    var randomxx;
    if (random_length == 1) {
      randomxx = 10;
    } else if (random_length == 2) {
      randomxx = 100;
    } else if (random_length == 3) {
      randomxx = 1000;
    } else if (random_length == 4) {
      randomxx = 10000;
    }
    var nomerny = `        *『 List of Whatsapp Numbers 』*\n\n`;
    var nobio = `\n🎀 *Bio:* Hey there! I am using WhatsApp.\n\n`;
    var nowhatsapp = `\n🎀 *Numbers with no WhatsApp account within the range you provided*\n\n`;

    for (let i = 0; i < randomxx; i++) {
      var nu = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      var status1 = nu[Math.floor(Math.random() * nu.length)];
      var status2 = nu[Math.floor(Math.random() * nu.length)];
      var status3 = nu[Math.floor(Math.random() * nu.length)];
      var status4 = nu[Math.floor(Math.random() * nu.length)];
      var dom4 = nu[Math.floor(Math.random() * nu.length)];
      var rndm;
      if (random_length == 1) {
        rndm = `${status1}`;
      } else if (random_length == 2) {
        rndm = `${status1}${status2}`;
      } else if (random_length == 3) {
        rndm = `${status1}${status2}${status3}`;
      } else if (random_length == 4) {
        rndm = `${status1}${status2}${status3}${status4}`;
      } else if (random_length == 5) {
        rndm = `${status1}${status2}${status3}${status4}${dom4}`;
      }
      var anu = await client.onWhatsApp(
        `${number0}${i}${number1}@s.whatsapp.net`
      );
      var anuu = anu.length !== 0 ? anu : false;
      try {
        try {
          var anu1 = await client.fetchStatus(anu[0].jid);
        } catch {
          var anu1 = "401";
        }
        if (anu1 == "401" || anu1.status.length == 0) {
          nobio += `wa.me/${anu[0].jid.split("@")[0]}\n`;
        } else {
          nomerny += `🎀 *Number:* wa.me/${
            anu[0].jid.split("@")[0]
          }\n🔹 *Bio :* ${anu1.status}}\n\n`;
        }
      } catch {
        nowhatsapp += `${number0}${i}${number1}\n`;
      }
    }
    await client.sendMessage(
      m.from,
      { text: `${nomerny} ${nobio} ${nowhatsapp}` },
      { quoted: m }
    );
  },
};
