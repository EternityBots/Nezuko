
const { igApi, getSessionId } = require('insta-fetcher');
let ig = new igApi("csrftoken=iA0k3i1fzyIqVyznhTavDmj0DAUO8BtI;rur=CCO\05457428263220\0541704641877:01f7630aabdd942fc5fb946dd4fdfad9d686ef43d2619c157ce57472cf7054817094e465;mid=Y7g2yQALAAFzglheXnY3y8CdLpW2;ds_user_id=57428263220;sessionid=57428263220%3A4X9L6XKHQldtEW%3A24%3AAYfha9Y2ECvBmDoY7uu5SJVcvGaENvXCQfbXuzn4SA;ig_did=D02F36F4-301A-4501-8F70-E35446E7C4CC");
ig.setCookie("csrftoken=iA0k3i1fzyIqVyznhTavDmj0DAUO8BtI;rur=CCO\05457428263220\0541704641877:01f7630aabdd942fc5fb946dd4fdfad9d686ef43d2619c157ce57472cf7054817094e465;mid=Y7g2yQALAAFzglheXnY3y8CdLpW2;ds_user_id=57428263220;sessionid=57428263220%3A4X9L6XKHQldtEW%3A24%3AAYfha9Y2ECvBmDoY7uu5SJVcvGaENvXCQfbXuzn4SA;ig_did=D02F36F4-301A-4501-8F70-E35446E7C4CC");
const {isUrl}=require('../../../lib/Function')
require ('../../../settings')
module.exports={
    name:"igdl",
    alias:["instagram"],
    usage:`${prefa}igdl <query>`,
    desc:"Download Instagram videos directly...",
    category:"Media",
    react:"✅",
    start:async(client,m,{command,prefix,text,args})=>{
        if (args.length === 0) return sendMessage(m.from, { text: `❌ URL is empty! \nSend ${prefix}insta url` }, { quoted: m });

        let urlInsta = args[0];
    
        if (!(urlInsta.includes("instagram.com/p/") ||
            urlInsta.includes("instagram.com/reel/") ||
            urlInsta.includes("instagram.com/tv/")))
            return sendMessage(
                m.from,
                { text: `❌ Wrong URL! Only Instagram posted videos, tv and reels can be downloaded.` },
                { quoted: m }
            );      
            if (urlInsta.includes("?"))
            urlInsta = urlInsta.split("/?")[0];
        console.log(urlInsta);
        ig.fetchPost(urlInsta).then((res) => {
            if (res.media_count == 1) {
                if (res.links[0].type == "video") {
                    client.sendMessage(
                        m.from,
                        {
                            video: { url: res.links[0].url }
                        },
                        { quoted: m }
                    )
                }else if (res.links[0].type == "image") {
                    client.sendMessage(
                        m.from,
                        {
                            image: { url: res.links[0].url }
                        },
                        { quoted: m }
                    )
                }
            }
            else if (res.media_count > 1) {
                for (let i = 0; i < res.media_count; i++) {
                    if (res.links[i].type == "video") {
                        client.sendMessage(
                            m.from,
                            {
                                video: { url: res.links[i].url }
                            },
                            { quoted: m }
                        )
                    } else if (res.links[i].type == "image") {
                        client.sendMessage(
                            m.from,
                            {
                                image: { url: res.links[i].url }
                            },
                            { quoted: m }
                        )
                    }
                }
            }            
        }).catch((error) => {
            console.log(error);
            sendMessage(m.from, { text: `Error private / not found` }, { quoted: m })
        });
}
}