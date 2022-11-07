const RedditImageFetcher = require("reddit-image-fetcher");
require ('../../../settings')
module.exports={
    name:"reddit",
    alias:["sr", "re", "subreddit"],
    usage:`${prefa}reddit [subreddit name]`,
    desc:"Send image from reddit",
    category:"Utils",
    start:async(client,m,{command,prefix,nsfw,text,args})=>{
if (!text)  return m.reply(`*Please provide me a subreddit name*`) 
if(nsfw.includes(`${m.from}`)) {
RedditImageFetcher.fetch({
            type: 'custom',
            total: 1, 
            addSubreddit:text,
            allowNSFW: true,
        }).then(result => {
            console.log(result);
            let akusingle = result[0]
            client.sendMessage(m.from,{image:{url:akusingle.image}},{quoted:m})
        })
        .catch(err => {
            m.reply ("*⚠ Error subreddit isn't valid*")
        })
    }else{

RedditImageFetcher.fetch({
            type: 'custom',
            total: 1, 
            addSubreddit:text,
            allowNSFW: false,
        }).then(result => {
            console.log(result);
            let akusingle = result[0]
            client.sendMessage(m.from,{image:{url:akusingle.image}},{quoted:m})
        })
        .catch(err => {
          m.reply ("*⚠ Error either it's a nsfw subreddit or subreddit isn't valid*")
        })
    
}
        
}}