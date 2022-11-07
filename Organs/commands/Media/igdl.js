
const { igApi, getSessionId } = require('insta-fetcher');
let ig = new igApi("csrftoken=6wrPrUbsa05Csm9wlqxAOSqRwxxscjD;rur=16771\05427758921939\0541695476019:01f7994241f5e244ccf1bb676853d91b4f281e385e564f6c99a3592b27b0a39dada825e8;mid=Yy21jQALAAEmUl5E0beHHz_eVvyI;ds_user_id=27758921939;sessionid=27758921939%3ASGdS1WkMZToRfs%3A12%3AAYe5Sp23sp78pv0PnIRL6X-ySJdCDpe4uxbuJxtcxw;ig_did=09B76BA7-2D56-42E5-89BB-3584A9EAD69B");
ig.setCookie("csrftoken=6wrPrUbsa05Csm9wlqxAOSqRwxxscjD;rur=16771\05427758921939\0541695476019:01f7994241f5e244ccf1bb676853d91b4f281e385e564f6c99a3592b27b0a39dada825e8;mid=Yy21jQALAAEmUl5E0beHHz_eVvyI;ds_user_id=27758921939;sessionid=27758921939%3ASGdS1WkMZToRfs%3A12%3AAYe5Sp23sp78pv0PnIRL6X-ySJdCDpe4uxbuJxtcxw;ig_did=09B76BA7-2D56-42E5-89BB-3584A9EAD69B");
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