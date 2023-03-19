const { evaluate } = require('mathjs');
module.exports={
    name:"caclculator",
    alias:["calc"],
    usage:`${global.prefa}calc 2+2`,
    desc:"Gives you the meaning of your word ",
    category:"Education",
    react:"📖",
    
    start:async(client,m,{command,prefix,args,text})=>{
        if (!text)  return m.reply(`*Please provide an equation to solve*`) 
        try{
        const calc = evaluate(text);
        await client.sendMessage(m.from,{text:`*📘 Question :-* \n ${text} \n\n*💡 Answer :-* \n ${calc}`},{quoted:m})
        } catch (err) {
        console.log(err)
        return m.reply (`*${text}* isn't a valid question`)
        }}
    }