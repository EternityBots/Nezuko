module.exports = {
    name: "hi",
    alias: ["hello"],
    desc: "Tells hello",
    cool:3,
    react:"✅",
    category: "General",
    start: async(client, m,{pushName}) => {
        if(m.quoted){
            const nme= await client.username(m.quoted.sender)
            console.log(nme)
            await client.sendMessage(m.from,{text:`Hello ${nme}`},{quoted:m})

        }else{
        await client.sendMessage(m.from,{text:`Hello ${pushName}`},{quoted:m})
        }
    }
}