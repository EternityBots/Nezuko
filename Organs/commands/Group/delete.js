require ('../../../settings')
module.exports={
    name:"delete",
    alias:["del"],
    usage:`${prefa}delete <quoted message>`,
    desc:"Delete the bot message/also deletes others message",
    react:"✅",
    category:"Group",
    start:async(client,m,{command,prefix,text,args,quoted,isAdmin,isBotAdmin})=>{

let key
if(text.endsWith("--participant")){
    if(!isAdmin && !isBotAdmin) return client.sendMessage(m.from,{text:"You and the bot both should be admin to delete others message"},{quoted:m})
 key={
    remoteJid:m.from,
    fromMe:false,
    id:m.quoted.id,
    participant:m.quoted.sender
}}
else{
    key={
        remoteJid:m.from,
        fromMe:true,
        id:m.quoted.id
    }
}
await client.sendMessage(m.from,{delete:key})
    }
}