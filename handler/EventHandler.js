const fs = require("fs");
require("./MessageHandler");
module.exports = async (client, m) => {
  try {
    let metadata = await client.groupMetadata(m.id);
    let participants = m.participants;
    const myID = client.user.id.split(":")[0] + "@s.whatsapp.net";
    let wel = await db.get("events");
    const wlc = wel || [];
    for (let num of participants) {
      try {
        ppuser = await client.profilePictureUrl(num, "image");
      } catch {
        ppuser = "https://wallpapercave.com/wp/wp6960556.jpg";
      }

      if (m.action == "add" && wlc.includes(`${m.id}`)) {
        //let name = client.username(num, 'user')
        //let disc = num.substring(3, 7)
        capt = `
*@${num.split("@")[0]}* *Welcome to* ${metadata.subject} 🍁
       
🎋 *Group Description:*
        
${metadata.desc}`;

        client.sendMessage(m.id, {
          image: { url: ppuser },
          mentions: [num],
          caption: capt,
        });
      } else if (m.action == "remove" && wlc.includes(`${m.id}`)) {
        client.sendMessage(m.id, {
          text: `@${num.split("@")[0]} bye bye , we will not miss you`,
          mentions: [num],
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
