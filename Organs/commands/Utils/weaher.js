const axios = require('axios')
const fs=require("fs")
const { buffergif, fetchBuffer } = require('../../../lib/Function')
module.exports={
    name:"weather",
    alias:["weather"],
    usage:`${global.prefa}weather [Your city]`,
    desc:"Gives you forecast of current weather ",
    category:"Utils",
    react:"✅",

    start:async(client,m,{command,prefix,text,args})=>{
if (global.wter == "none" || null)  return m.reply(`*❤️ Ask owner to give me an API key*`)
if (!text)  return m.reply(`Please provide me the place name.`)
try {
wthr = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${global.wter}%20&q=${text}&aqi=no`)
if (!wthr) return m.reply(`Can not find the place's weather`)
const reply = `
📍 *Location:* ${wthr.data.location.name}
🏡 *Region:* ${wthr.data.location.region}
🗾 *Country:* ${wthr.data.location.country}
🕗 *Time Zone:* ${wthr.data.location.tz_id}
🌡️ *Temparature:* ${wthr.data.current.temp_c}°C
📡 *Weather Condition:* ${wthr.data.current.condition.text}
🍃 *Wind Speed:* ${wthr.data.current.wind_kph} Km/hr
🎐 *Wind Degree:* ${wthr.data.current.wind_degree}°
🌬️ *Wind Direction:* ${wthr.data.current.wind_dir}
🌈 *pressure:* ${wthr.data.current.pressure_in} in
🌧️ *preciptation:* ${wthr.data.current.precip_mm} mm
💧 *Humidity:* ${wthr.data.current.humidity}%
☁ *Cloud:* ${wthr.data.current.cloud}
🏜️ *Feels like:* ${wthr.data.current.feelslike_c}°C
`
var wthrbuff = await fetchBuffer("https://i.ibb.co/ZxpH0LM/e17003d3a86823bea8a48e4ec03d33e9.gif")
var wthrgif = await buffergif(wthrbuff)
await client.sendMessage(m.from,{video:wthrgif, gifPlayback:true, caption:reply },{quoted:m})
} catch (err) {
    console.log(err)
    return m.reply (`*${text}* isn't a valid place.`)
    }
  }
}
