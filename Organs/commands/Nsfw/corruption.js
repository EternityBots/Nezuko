const RedditImageFetcher = require("reddit-image-fetcher");
module.exports={
name:"corrupt",
alias:["corruption"],
usage:`${global.prefa}corrupt`,
desc:"Gives you random corruption hentai images",
category:"Nsfw",
react:"💦",
start:async(client,m,{command,nsfw,prefix,text})=>{
if(!nsfw.includes(`${m.from}`)) return m.reply('*❌ This not a hentai group pervert*')    
RedditImageFetcher.fetch({
   type: 'custom',
   total: 1, 
   addSubreddit: ['corruptionhentai'],
}).then(result => {
   console.log(result);
   let akusingle = result[0]
   client.sendMessage(m.from,{image:{url:akusingle.image}},{quoted:m})
});
}
}