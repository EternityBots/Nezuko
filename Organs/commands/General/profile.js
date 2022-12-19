require('../../../handler/MessageHandler')
let {  TelegraPh,fetchBuffer,buffergif } = require('../../../lib/Function')
const util=require('util')
const fs=require('fs')
const axios=require("axios")
require ('../../../settings')
module.exports={
    name:"profile",
    alias:["p"],
    usage:`${prefa}profile`,
    desc:"shows your profile",
    react:"✅",
    category:"General",
    start:async(client,m,{command,pushName,groupName,isAdmin,iscreator,mentionByTag,prefix,text,args,quoted,mime})=>{
        

        if(!text){
        const userw = await Levels.fetch(m.sender, "bot");
				        const levelRole = userw.level
        var role = 'Warrior'
        if (levelRole <= 2) {
            var role = 'Elite III'
        } else if (levelRole <= 4) {
            var role = 'Elite II'
        } else if (levelRole <= 6) {
            var role = 'Elite I'
        } else if (levelRole <= 8) {
            var role = 'Master IV'
        } else if (levelRole <= 10) {
            var role = 'Master III'
        } else if (levelRole <= 12) {
            var role = 'Master II'
        } else if (levelRole <= 14) {
            var role = 'Master I'
        } else if (levelRole <= 16) {
            var role = 'Grandmaster V'
        } else if (levelRole <= 18) {
            var role = 'Grandmaster IV'
        } else if (levelRole <= 20) {
            var role = 'Grandmaster III'
        } else if (levelRole <= 22) {
            var role = 'Grandmaster II'
        } else if (levelRole <= 24) {
            var role = 'Grandmaster I'
        } else if (levelRole <= 26) {
            var role = 'Epic V'
        } else if (levelRole <= 28) {
            var role = 'Epic IV'
        } else if (levelRole <= 30) {
            var role = 'Epic III'
        } else if (levelRole <= 32) {
            var role = 'Epic II'
        } else if (levelRole <= 34) {
            var role = 'Epic I'
        } else if (levelRole <= 36) {
            var role = 'Legend V'
        } else if (levelRole <= 38) {
            var role = 'Legend IV'
        } else if (levelRole <= 40) {
            var role = 'Legend III'
        } else if (levelRole <= 42) {
            var role = 'Legend II'
        } else if (levelRole <= 44) {
            var role = 'Legend I'
        } else if (levelRole <= 46) {
            var role = 'Mythic'
        } else if (levelRole <= 50) {
            var role = 'Mythic Glory'
        }
		let bio = ''
try {
bio = (await client.fetchStatus(m.sender)).status
} catch (error) {
	console.log(error)
bio = 'None'
}
console.log(bio)
let typeR = await db.get(`${m.sender}ooicon-y`) || "img"
	let yuo = await db.get(`${m.sender}.bio`)
	if (!yuo){
		yuo = bio
	}
let disec = m.sender.substring(3, 7)
			let tex = "";
            if (pushName) {
             tex += `*🪪 Name*: ${pushName}#${disec}\n\n`
			 tex += `*🍥 Number*: ${m.sender}\n\n`
			tex += `*🎌 Bio*: ${yuo}\n\n`
			}

			tex += `*🎯 XP*: ${userw.xp} / ${Levels.xpFor(userw.level + 1)}\n\n*🔮 Level*: ${userw.level}\n\n*🏮 Role*: ${role}\n`
			let yui = await db.get(`${m.sender}.icon`)
			if (yui) {
				ppuser = yui
			} else {
			try {
                    ppuser = await client.profilePictureUrl(m.sender, 'image')
                } catch {
                    ppuser = 'https://i.pinimg.com/564x/84/09/12/840912dd744e6662ab211b8070b5d84c.jpg'
                }
			}
				
				if (groupName) {
					tex += `\n*🌊 Group*: ${groupName}\n\n`
				}
				if (isAdmin) {
					tex += `*〽️ Admin*: true\n`
				}
				console.log(`${tex} ${yui} ${bio}`)

				if ( typeR == "img"){
				return client.sendMessage(m.from, { image: { url: ppuser }, caption: tex }, { quoted: m })
				} else if ( typeR == "gif") {
					const response = await axios.get(yui,  { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "utf-8")
		var sgif = await buffergif(buffer)
	await	client.sendMessage(m.from,{video: sgif, gifPlayback:true,caption: tex},{quoted:m})
				}}
                
                if(iscreator){
                    const mention=mentionByTag
                    let users = await (mention[0]) || m.msg.contextInfo.participant
                    let name = await user.findOne({ id:users })
if(name){
    unme=name.name
}else{
    unme=`user`
}
const userw = await Levels.fetch(users, "bot");
				        const levelRole = userw.level
        var role = 'Warrior'
        if (levelRole <= 2) {
            var role = 'Elite III'
        } else if (levelRole <= 4) {
            var role = 'Elite II'
        } else if (levelRole <= 6) {
            var role = 'Elite I'
        } else if (levelRole <= 8) {
            var role = 'Master IV'
        } else if (levelRole <= 10) {
            var role = 'Master III'
        } else if (levelRole <= 12) {
            var role = 'Master II'
        } else if (levelRole <= 14) {
            var role = 'Master I'
        } else if (levelRole <= 16) {
            var role = 'Grandmaster V'
        } else if (levelRole <= 18) {
            var role = 'Grandmaster IV'
        } else if (levelRole <= 20) {
            var role = 'Grandmaster III'
        } else if (levelRole <= 22) {
            var role = 'Grandmaster II'
        } else if (levelRole <= 24) {
            var role = 'Grandmaster I'
        } else if (levelRole <= 26) {
            var role = 'Epic V'
        } else if (levelRole <= 28) {
            var role = 'Epic IV'
        } else if (levelRole <= 30) {
            var role = 'Epic III'
        } else if (levelRole <= 32) {
            var role = 'Epic II'
        } else if (levelRole <= 34) {
            var role = 'Epic I'
        } else if (levelRole <= 36) {
            var role = 'Legend V'
        } else if (levelRole <= 38) {
            var role = 'Legend IV'
        } else if (levelRole <= 40) {
            var role = 'Legend III'
        } else if (levelRole <= 42) {
            var role = 'Legend II'
        } else if (levelRole <= 44) {
            var role = 'Legend I'
        } else if (levelRole <= 46) {
            var role = 'Mythic'
        } else if (levelRole <= 50) {
            var role = 'Mythic Glory'
        }
		let bio = ''
try {
bio = (await client.fetchStatus(users)).status
} catch (error) {
	console.log(error)
bio = 'None'
}
console.log(bio)
let typeR = await db.get(`${users}ooicon-y`) || "img"
   let ho = await db.get(`${users}.marr`) || "Single"
	let yuo = await db.get(`${users}.bio`)
	if (!yuo){
		yuo = bio
	}
let disec = users.substring(3, 7)
			let tex = "";
            if (unme) {
             tex += `*🪪 Name*: ${unme}#${disec}\n\n`
			 tex += `*🍥 Number*: ${users}\n\n`
			tex += `*🎌 Bio*: ${yuo}\n\n`
			}

			tex += `*🎯 XP*: ${userw.xp} / ${Levels.xpFor(userw.level + 1)}\n\n*🔮 Level*: ${userw.level}\n\n*🏮 Role*: ${role}\n`
			let yui = await db.get(`${users}.icon`)
			if (yui) {
				ppuser = yui
			} else {
			try {
                    ppuser = await client.profilePictureUrl(users, 'image')
                } catch {
                    ppuser = 'https://i.pinimg.com/564x/84/09/12/840912dd744e6662ab211b8070b5d84c.jpg'
                }
			}
				
				if (groupName) {
					tex += `\n*🌊 Group*: ${groupName}\n\n`
				}
				if (isAdmin) {
					tex += `*〽️ Admin*: true\n`
				}
				console.log(`${tex} ${yui} ${bio}`)

				if ( typeR == "img"){
				return client.sendMessage(m.from, { image: { url: ppuser }, caption: tex }, { quoted: m })
				} else if ( typeR == "gif") {
					const response = await axios.get(yui,  { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "utf-8")
		var sgif = await buffergif(buffer)
		client.sendMessage(m.from,{video: sgif, gifPlayback:true,caption: tex},{quoted:m})
				}
                }
           
    }
}