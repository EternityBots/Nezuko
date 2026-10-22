import { config } from '../../config.js'
import { fetchBuffer, fetchJson } from '../../lib/http.js'
import { gifToMp4 } from '../../lib/media.js'
import { defineCommand } from '../../types.js'

const BACKGROUND_GIF = 'https://i.ibb.co/ZxpH0LM/e17003d3a86823bea8a48e4ec03d33e9.gif'
let backgroundVideo: Buffer | null = null

export default defineCommand({
	name: 'weather',
	desc: 'Current weather for a place',
	usage: '%prefix%command <city>',
	category: 'Utils',
	react: '✅',
	cool: 5,
	start: async (client, m, { text }) => {
		if (!config.weatherApiKey) return m.reply('*❤️ Ask the owner to set WEATHER_API*')
		if (!text) return m.reply('Please give me the place name.')
		const w = await fetchJson(
			`https://api.weatherapi.com/v1/current.json?key=${config.weatherApiKey}&q=${encodeURIComponent(text)}&aqi=no`
		).catch(() => null)
		if (!w?.location) return m.reply(`*${text}* isn't a valid place.`)

		const caption = `
📍 *Location:* ${w.location.name}
🏡 *Region:* ${w.location.region}
🗾 *Country:* ${w.location.country}
🕗 *Time Zone:* ${w.location.tz_id}
🌡️ *Temperature:* ${w.current.temp_c}°C
📡 *Condition:* ${w.current.condition.text}
🍃 *Wind Speed:* ${w.current.wind_kph} km/h
🎐 *Wind Degree:* ${w.current.wind_degree}°
🌬️ *Wind Direction:* ${w.current.wind_dir}
🌈 *Pressure:* ${w.current.pressure_in} in
🌧️ *Precipitation:* ${w.current.precip_mm} mm
💧 *Humidity:* ${w.current.humidity}%
☁ *Cloud:* ${w.current.cloud}
🏜️ *Feels like:* ${w.current.feelslike_c}°C`.trim()

		backgroundVideo ??= await fetchBuffer(BACKGROUND_GIF)
			.then(gifToMp4)
			.catch(() => null)
		await m.reply(backgroundVideo ? { video: backgroundVideo, gifPlayback: true, caption } : { text: caption })
	}
})
