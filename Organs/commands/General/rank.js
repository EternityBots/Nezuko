require('../../../handler/MessageHandler')
const canvacord=require('canvacord')
const {fetchBuffer}=require('../../../lib/Function')
module.exports={
    name: "rank",
    alias: ["rank"],
    desc: "shows the rank",
    cool:3,
    react:"✅",
    category: "General",
    start: async(client, m,{text,pushName,sender}) => {
        const userq = await Levels.fetch(m.sender, "bot");
const levelRole = userq.level
var role = 'Citizen'
if (levelRole <= 2) {
 var role = 'Beginner'
} else if (levelRole <= 4) {
 var role = 'Dan I'
} else if (levelRole <= 6) {
 var role = 'Dan II'
}else if (levelRole <= 8) {
 var role = 'Dan III'
}else if (levelRole <= 10) {
 var role = 'Dan IV' 
}else if (levelRole <= 12) {
 var role = 'Silver I'
} else if (levelRole <= 14) {
 var role = 'Silver II'
} else if (levelRole <= 16) {
 var role = 'Silver III'
} else if (levelRole <= 18) {
 var role = 'Initiate'
} else if (levelRole <= 20) {
 var role = 'Mentor'
} else if (levelRole <= 22) {
 var role = 'Expert'
} else if (levelRole <= 24) {
 var role = 'Grandmaster'
} else if (levelRole <= 26) {
 var role = 'Brawler'
} else if (levelRole <= 28) {
 var role = 'Marauder'
} else if (levelRole <= 30) {
 var role = 'Fighter'
} else if (levelRole <= 32) {
 var role = 'Vanguard'
} else if (levelRole <= 34) {
 var role = 'Warrior'
} else if (levelRole <= 36) {
 var role = 'Vindicator'
} else if (levelRole <= 38) {
 var role = 'Juggernaut I'
} else if (levelRole <= 40) {
 var role = 'Vanquisher'
} else if (levelRole <= 42) {
 var role = 'Hokage'
} else if (levelRole <= 44) {
 var role = 'Destroyer'
} else if (levelRole <= 46) {
 var role = 'Savior'
} else if (levelRole <= 48) {
 var role = 'Overlord'
}else if (levelRole <= 50) {
 var role = 'Elite I'
}else if (levelRole <= 52) {
 var role = 'Elite II'
}else if (levelRole <= 54) {
 var role = 'Elite III'
}else if (levelRole <= 56) {
 var role = 'Supereme'
}else if (levelRole <= 58) {
 var role = 'Emperor'
}else if (levelRole <= 60) {
 var role = 'Yaksa'
}else if (levelRole <= 62) {
 var role = 'Ancient Vampire'
}else if (levelRole <= 64) {
 var role = 'Demon Lord'
}else if (levelRole <= 66) {
 var role = 'Supreme Demon Lord'
}else if (levelRole <= 68) {
 var role = 'Revered Ruler'
}else if (levelRole <= 70) {
 var role = 'Divine Ruler'
}else if (levelRole <= 72) {
 var role = 'Eternal Ruler'
}else if (levelRole <= 74) {
 var role = 'Prime'
}else if (levelRole <= 76) {
 var role = 'Prime Lord'
}else if (levelRole <= 78) {
 var role = 'The Prime Emperor'
}else if (levelRole <= 80) {
 var role = 'The Original'
}else if (levelRole <= 100) {
 var role = ' High Level Bitch'
}
		let disc = m.sender.substring(3, 7)
			let textr = "";
            if (pushName) {
             textr += `*${pushName}#${disc}'s* Exp\n\n`
			} else {
				textr += `*${m.sender}#${disc}'s* Exp\n\n`
			}
			textr += `*🎯️XP*: ${userq.xp} / ${Levels.xpFor(userq.level + 1)}\n*❤️Level*: ${userq.level}\n*🔮️Role*: ${role}`

			try {
                    ppuser = await client.profilePictureUrl(m.sender, 'image')
                } catch {
                    pppuser = 'https://www.linkpicture.com/q/IMG-20220118-WA0387.png'
                    ppuser=await fetchBuffer(pppuser)

                }
                const randomHexs = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`
                const randomHex = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`
                const randomHexz = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`

			                const rank = new canvacord.Rank()
                    .setAvatar(ppuser)
                    .setLevel(userq.level)
                    .setLevelColor(randomHexs, randomHex)
                    .setCurrentXP(userq.xp)
                    .setOverlay(randomHex, 100, false)
                    .setRequiredXP(Levels.xpFor(userq.level + 1))
                    .setProgressBar(randomHexs, 'COLOR')
				    .setRank(0, role, false)
                    .setBackground('COLOR', randomHexz)
                    .setUsername(pushName)
                    .setDiscriminator(disc)
                rank.build().then(async(data)=>{
					client.sendMessage(m.from,{image:data,caption:textr},{quoted:m})
  })

    }
}