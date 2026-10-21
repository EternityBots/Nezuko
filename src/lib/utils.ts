export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const pickRandom = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)]

export const isUrl = (text: string) => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/i.test(text)

export const capitalize = (text: string) => text.replace(/^\w/, c => c.toUpperCase())

export const randomHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`

/** "3:05" style duration. */
export const formatDuration = (seconds: number) => {
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	const s = Math.floor(seconds % 60)
	const mm = h ? String(m).padStart(2, '0') : String(m)
	return `${h ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`
}

export const formatBytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`

/** The user part of a JID ("12345@s.whatsapp.net" -> "12345"). */
export const userPart = (jid: string) => jid.split('@')[0].split(':')[0]

export const errorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

/** Role names used by the profile command, by level. */
const PROFILE_ROLES: [number, string][] = [
	[2, 'Elite III'], [4, 'Elite II'], [6, 'Elite I'], [8, 'Master IV'], [10, 'Master III'], [12, 'Master II'],
	[14, 'Master I'], [16, 'Grandmaster V'], [18, 'Grandmaster IV'], [20, 'Grandmaster III'], [22, 'Grandmaster II'],
	[24, 'Grandmaster I'], [26, 'Epic V'], [28, 'Epic IV'], [30, 'Epic III'], [32, 'Epic II'], [34, 'Epic I'],
	[36, 'Legend V'], [38, 'Legend IV'], [40, 'Legend III'], [42, 'Legend II'], [44, 'Legend I'], [46, 'Mythic'],
	[50, 'Mythic Glory']
]

/** Role names used by the rank command, by level. */
const RANK_ROLES: [number, string][] = [
	[2, 'Beginner'], [4, 'Dan I'], [6, 'Dan II'], [8, 'Dan III'], [10, 'Dan IV'], [12, 'Silver I'], [14, 'Silver II'],
	[16, 'Silver III'], [18, 'Initiate'], [20, 'Mentor'], [22, 'Expert'], [24, 'Grandmaster'], [26, 'Brawler'],
	[28, 'Marauder'], [30, 'Fighter'], [32, 'Vanguard'], [34, 'Warrior'], [36, 'Vindicator'], [38, 'Juggernaut I'],
	[40, 'Vanquisher'], [42, 'Hokage'], [44, 'Destroyer'], [46, 'Savior'], [48, 'Overlord'], [50, 'Elite I'],
	[52, 'Elite II'], [54, 'Elite III'], [56, 'Supreme'], [58, 'Emperor'], [60, 'Yaksa'], [62, 'Ancient Vampire'],
	[64, 'Demon Lord'], [66, 'Supreme Demon Lord'], [68, 'Revered Ruler'], [70, 'Divine Ruler'], [72, 'Eternal Ruler'],
	[74, 'Prime'], [76, 'Prime Lord'], [78, 'The Prime Emperor'], [80, 'The Original'], [100, 'High Level Bitch']
]

const roleFor = (table: [number, string][], level: number, fallback: string) => table.find(([max]) => level <= max)?.[1] ?? fallback

export const profileRole = (level: number) => roleFor(PROFILE_ROLES, level, 'Warrior')
export const rankRole = (level: number) => roleFor(RANK_ROLES, level, 'Citizen')
