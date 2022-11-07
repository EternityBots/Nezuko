
require ('../../../settings')
module.exports={
    name:"mods",
    alias:["mod"],
    usage:`${prefa}mods`,
    desc:"shows mods list",
    category:"General",
    react:"✅",

    start:async(client,m,{})=>{
        const mod= await db.get('owner')
        let mo=`
*ETERNITY MODS*
\n`
for(let i=0;i<mod.length;i++){
    const um= await client.username(mod[i])
    mo+=`\n#${i+1}\n*Name:* ${um}\n*Contact:* http://wa.me/+${mod[i].split("@")[0]}\n`
}
m.reply(mo)
    }
}