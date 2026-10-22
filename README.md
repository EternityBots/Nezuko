<div align="center">
<a href="https://www.youtube.com/watch?v=KqgyScOlvV8"><img src="https://i.ibb.co/Mfkw6xT/eternity-5.png" alt="Nezuko" border="0" /></a>

# **NEZUKO : MULTI DEVICE WHATSAPP BOT WITH COOL FEATURES**

<p align="center">
<a href="https://github.com/pratyush4932"><img title="Author" src="https://img.shields.io/badge/Author-Pratyush-red.svg?style=for-the-badge&logo=github"></a>
<a href="https://github.com/EternityBots/Nezuko/blob/main/LICENSE"><img src="https://img.shields.io/github/license/EternityBots/Nezuko?color=%231e81b0&style=for-the-badge"></a>
</p>
<p align="center">
<img title="Baileys" src="https://img.shields.io/badge/Baileys-7.0.0--rc14-25D366?style=for-the-badge&logo=whatsapp&logoColor=white">
<img title="Bun" src="https://img.shields.io/badge/Bun-1.2+-000000?style=for-the-badge&logo=bun&logoColor=white">
<img title="TypeScript" src="https://img.shields.io/badge/TypeScript-7-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
</p>
</div>

---

## 📚 Information

> A simple and easy-to-use WhatsApp bot with cool features, based on Multi-Device [Baileys](https://github.com/WhiskeySockets/Baileys) and written in **TypeScript**. Runs on **Bun** (recommended) or **Node.js 20+**.

## 💖 NEZUKO

> This is an open source project by TEAM ETERNITY. If you fork it and change code, don't claim it as yours: give credit to the original developers. If you have any questions, join our support group to report your issues.

[![WhatsApp Group](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/JCCZPbPUbM1536n62zSFZi)

## ✨ What's new in v5

- **Baileys 7.0.0-rc14** (latest), including WhatsApp's new **LID** user IDs. Owner checks, admin checks, bans and XP work whether WhatsApp shows a user by phone number or by LID.
- **Runs on Bun** directly from TypeScript, with no build step. Node.js still works through `npm run build`.
- **Rewritten in TypeScript** (TypeScript 7), fully typed with `strict` mode.
- **YouTube via [YouTube.js](https://github.com/LuanRT/YouTube.js)** (`youtubei.js`). The old `youtube-yts` and `youtubedl-core` packages are gone. `play`, `yta`, `ytv`, `playv`, `yts`, `lyrics` and `spotify` all use it.
- **Safer session storage.** The WhatsApp session is saved key-by-key in MongoDB with all the key types Baileys 7 needs. **Old sessions are imported automatically**, so you don't have to re-scan after upgrading.
- **Pairing code login** as an alternative to the QR code.
- **Fewer, lighter dependencies.** quick.db/SQLite, discord-xp, fluent-ffmpeg, jimp, cheerio and several scrapers were replaced with small built-in code. Existing XP is kept: same collection, same formula.
- **Fixes:** broadcast now sends plain text messages too, anti-link no longer tries to kick when the bot isn't admin, cooldowns are per command, and the default "MODS" fallback (which gave strangers owner access) was removed.

## 🧰 Requirements

- [Bun](https://bun.sh) **1.2+** (or Node.js **20+**)
- [ffmpeg](https://ffmpeg.org) (stickers, GIFs and YouTube videos)
- A [MongoDB](https://www.mongodb.com/atlas) database (a free Atlas cluster is enough)
- *Optional:* [yt-dlp](https://github.com/yt-dlp/yt-dlp), used as a fallback when YouTube blocks the built-in downloader (included in the Docker image)

## 🚀 Installation

```bash
git clone https://github.com/EternityBots/Nezuko
cd Nezuko
bun install
cp .env.example .env   # then fill in MONGODB and MODS
bun start
```

A QR code appears in the terminal. In WhatsApp, open **Settings → Linked devices → Link a device** and scan it. It is also served at `http://localhost:8080/qr?session=<SESSION_ID>`.

**Prefer a pairing code?** Set `PAIRING_NUMBER` to the bot's number (digits only, with country code). The bot prints an 8-digit code; enter it under **Linked devices → Link with phone number instead**.

### Running with Node.js instead of Bun

```bash
npm install
npm run build
npm run start:node
```

### Useful scripts

| Command | What it does |
| --- | --- |
| `bun start` | Start the bot |
| `bun run dev` | Start with auto-restart on file changes |
| `bun run typecheck` | Type-check the project |
| `bun test` | Run the tests |
| `bun run reset-session` | Delete the saved WhatsApp session so you can link again |
| `bun run yt-check <link>` | Test which YouTube clients can download from your machine |
| `npm run build` / `npm run start:node` | Compile to `dist/` and run on Node.js |

## ⚙️ Configuration

All settings are environment variables (see [`.env.example`](.env.example)).

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB` | ✅ | MongoDB connection string |
| `MODS` | ✅ | Owner numbers with country code, comma separated (e.g. `919876543210,447700900123`) |
| `PREFIX` | | Command prefix (default `.`) |
| `SESSION_ID` | | Session name (default `NEZUKO`), also the password for the `/qr` page |
| `PAIRING_NUMBER` | | Link with a pairing code instead of a QR code |
| `PORT` | | Web server port (default `8080`) |
| `GOOGLE_API`, `GOOGLE_CX` | | Google Custom Search for `google` |
| `WEATHER_API` | | [weatherapi.com](https://www.weatherapi.com) key for `weather` |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | | Full track details for `spotify` (works without them, with fewer details) |
| `YT_COOKIE`, `YT_PO_TOKEN` | | Only if YouTube starts blocking downloads from your server (use a throwaway account) |
| `YT_AUTO_PO_TOKEN` | | Generate YouTube PO tokens automatically (default `true`; off when `YT_COOKIE` or `YT_PO_TOKEN` is set) |
| `YT_DOWNLOADER` | | `auto` (default: yt-dlp if installed, then YouTube.js), `youtubei`, or `yt-dlp` |
| `YTDLP_PATH` | | Path to yt-dlp if it isn't on your PATH |
| `YTDLP_ARGS` | | Extra yt-dlp options, e.g. `--cookies-from-browser firefox` when YouTube asks it to sign in |
| `YT_CLIENTS` | | YouTube clients to try, e.g. `ANDROID_VR,WEB_EMBEDDED,TV` (see `bun run yt-check`) |
| `MAX_AUDIO_MINUTES`, `MAX_VIDEO_MINUTES`, `MAX_VIDEO_HEIGHT` | | Download limits (defaults `20`, `10`, `720`) |
| `LOG_LEVEL` | | Baileys log level (default `silent`) |

`MAL_USERNAME` / `MAL_PASSWORD` are no longer needed: `anime` and `manga` use the public [Jikan](https://jikan.moe) API.

## 🎬 If YouTube downloads fail

YouTube now wants a **PO token** (proof that requests come from a real player) for most downloads. The bot generates one automatically with BotGuard via [bgutils-js](https://github.com/LuanRT/BgUtils), so normally nothing needs configuring.

Run `bun run yt-check <youtube link>` on the machine where the bot runs. It shows whether the PO token was generated and does a full test download with every YouTube client.

- **Some client shows ✓:** put the working ones in `.env` as `YT_CLIENTS=...` if the script suggests it.
- **TV says sign in / login required:** set `YT_COOKIE` with cookies from a throwaway account (log in to YouTube in an incognito window, copy the `Cookie` header from any youtube.com request in DevTools > Network, then close the window).
- **YouTube.js is blocked on your network:** install yt-dlp and the bot falls back to it automatically. On Linux:
  ```bash
  sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /usr/local/bin/yt-dlp
  sudo chmod a+rx /usr/local/bin/yt-dlp
  ```
  (Windows/macOS builds are on the [releases page](https://github.com/yt-dlp/yt-dlp/releases/latest).) If `yt-check` shows only yt-dlp works, set `YT_DOWNLOADER=yt-dlp` to skip the failing attempts. Update it now and then with `yt-dlp -U`. Its progress is printed in the bot's console as `[yt-dlp] ...` lines.
- **yt-dlp says "Sign in to confirm you're not a bot":** your IP is flagged. Let yt-dlp use cookies from a browser on the same machine: `YTDLP_ARGS=--cookies-from-browser firefox` (or `chrome`, `"chrome:Profile 2"` for a specific profile). Use a browser profile logged into a throwaway account, not your main one.
- **Everything fails:** run `bun update youtubei.js` (YouTube changes often and fixes ship quickly), or try a different network. Cloud server IPs are often blocked.
- `web` always shows "SABR only"; that's expected, YouTube no longer gives it direct download links.

## ☁️ Deploy

The included `Dockerfile` (Bun + ffmpeg) works on any container host.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/xhqo2N?referralCode=QaaU0X)
[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?type=git&repository=github.com/EternityBots/Nezuko&branch=main&builder=dockerfile&name=nezuko&env[PORT]=8000&env[PREFIX]=.&env[SESSION_ID]=NEZUKO&env[MONGODB]&env[MODS])
[![Run on Repl.it](https://replit.com/badge/github/EternityBots/Nezuko)](https://replit.com/new/github/EternityBots/Nezuko)
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/EternityBots/Nezuko)

Run **one** instance per session. Two copies using the same `SESSION_ID` keep kicking each other off (WhatsApp error 440).

## 📜 Commands

Default prefix is `.`. Use `.help <command>` or `.<command> --info` for details.

| Category | Commands |
| --- | --- |
| General | `help`, `hi`, `mods`, `profile`, `rank`, `repo` |
| Group | `delete`, `demote`, `disable`, `enable`, `group`, `groupinfo`, `ping`/`tagall`, `promote`, `remove`, `setppgc`, `support` |
| Mods | `ban`, `broadcast`, `eval`, `join`, `leave`, `unban` |
| Media | `igdl`, `lyrics`, `play`, `playv`, `spotify`, `yta`, `yts`, `ytv` |
| Utils | `google`, `reddit`, `shorturl`, `steal`, `sticker`, `toimg`, `weather` |
| Fun | `hitler`, `old`, `rainbow`, `reaction` (+ `pat`, `hug`, `slap`…), `rip`, `shit`, `slap`, `trash`, `trigger`, `wanted`, `wasted` |
| Weeb | `anime`, `cosplay`, `couplepp`, `genshin`, `manga`, `neko`, `waifu`, `wallpaper` |
| Education | `calc`, `define`, `element` |

Group features are switched on per group by admins: `.enable antilink`, `.enable events` (welcome/goodbye), `.enable nsfw` (allows NSFW subreddits in `reddit`).

## 🧩 Adding a command

Create a file in `src/commands/<Category>/`. It is picked up automatically on start:

```ts
import { defineCommand } from '../../types.js'

export default defineCommand({
	name: 'echo',
	alias: ['say'],
	desc: 'Repeats your text',
	usage: '%prefix%command <text>',
	category: 'Utils',
	cool: 3, // seconds
	// ownerOnly, groupOnly, adminOnly, botAdmin are checked for you
	start: async (client, m, { text }) => {
		if (!text) return m.reply('Say something!')
		await m.reply(text)
	}
})
```

`m.sender` may be a LID (`123@lid`). Use `m.senderPn` when you need the phone number, and store per-user data with `canonicalId(m.senderPn, m.sender)` from `src/core/identity.ts`.

## 📁 Project structure

```
src/
  index.ts           entry point
  config.ts          environment settings
  core/              socket + reconnect logic, MongoDB auth state, message serializer, command loader
  handlers/          message handling (permissions, cooldowns, XP, anti-link), welcome/goodbye
  commands/          one file per command, grouped by category
  lib/               youtube (youtubei.js), stickers, ffmpeg, image effects, HTTP helpers
  db/                MongoDB models, settings, XP levels
tests/               bun test suites
```

## ⚠️ Disclaimer

This bot uses an unofficial WhatsApp Web client. Using it can get your number **banned or restricted** by WhatsApp. Don't spam, don't add people who didn't ask, and prefer a secondary number. If WhatsApp temporarily blocks you from messaging new contacts, stop outreach until the block ends. The project is not affiliated with WhatsApp, Meta, YouTube or Google.

## 💡 License

Nezuko is free and open-source software licensed under the [GNU Affero General Public License v3.0](https://github.com/EternityBots/Nezuko/blob/main/LICENSE).

## HELP

> Please give this repo a ⭐ if you liked it.

# ✨ Creator ✨

<a href="https://github.com/pratyush4932"><img src="https://github.com/pratyush4932.png?size=100" width="100" height="100"></a>

[Pratyush](https://github.com/pratyush4932)
| Creator |

# Modifiers

| <a href="https://github.com/Eximinati"><img src="https://github.com/Eximinati.png?size=100" width="100" height="100"></a> | [![Ray_Senpai](https://github.com/RaySenpai69.png?size=100)](https://github.com/RaySenpai69) |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [Aku](https://github.com/Eximinati)                                                                                       | [Ray_Senpai](https://github.com/RaySenpai69)                                                 |
| Modifier                                                                                                                  | Modifier                                                                                     |

# Contributor 🤝🏻

| <a href="https://github.com/Toshi-san001"><img src="https://github.com/Toshi-san001.png?size=100" width="100" height="100"></a> | [![Arin](https://github.com/Arin1601.png?size=100)](https://github.com/Arin1601)               |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [Toshi_Sama](https://github.com/Toshi-san001)                                                                                   | [Arin](https://github.com/Arin1601)                                                            |
| Useless Worker                                                                                                                  | Contributor                                                                                    |
| <a href="https://github.com/Debanjan-San"><img src="https://github.com/Debanjan-San.png?size=100" width="100" height="100"></a> | [![Alι_Aryαɴ](https://github.com/AliAryanTech.png?size=100)](https://github.com/AliAryanTech)  |
| [Debanjan-San](https://github.com/Debanjan-San)                                                                                 | [Alι_Aryαɴ](https://github.com/AliAryanTech)                                                   |
| Contributor                                                                                                                     | Contributor                                                                                    |
| <a href="https://github.com/FantoX001"><img src="https://github.com/FantoX001.png?size=100" width="100" height="100"></a>       | [![Well/300>](https://github.com/well300.png?size=100)](https://github.com/well300)            |
| [Fantox](https://github.com/FanotX001)                                                                                          | [Well300>](https://github.com/well300)                                                         |
| Contributor                                                                                                                     | Contributor                                                                                    |
| <a href="https://github.com/Chey-san"><img src="https://github.com/Chey-san.png?size=100" width="100" height="100"></a>         | [![SaruMan_sama](https://github.com/SarumanSama.png?size=100)](https://github.com/SarumanSama) |
| [Chey_San](https://github.com/Chey-san)                                                                                         | [SaruMan](https://github.com/SarumanSama)                                                      |
| Contributor                                                                                                                     | Contributor                                                                                    |
