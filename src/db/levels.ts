import { Level } from './models.js'

/** Same formulas as discord-xp, so levels stay consistent with old data. */
const GUILD = 'bot'
const levelFor = (xp: number) => Math.floor(0.1 * Math.sqrt(xp))
export const xpFor = (level: number) => level * level * 100

export interface LevelInfo {
	xp: number
	level: number
}

export const levels = {
	xpFor,

	async fetch(userId: string): Promise<LevelInfo> {
		const doc = await Level.findOne({ userID: userId, guildID: GUILD }).lean()
		return { xp: doc?.xp ?? 0, level: doc?.level ?? 0 }
	},

	/** Adds XP and returns true when the user levelled up. */
	async append(userId: string, amount: number): Promise<boolean> {
		const doc = await Level.findOneAndUpdate(
			{ userID: userId, guildID: GUILD },
			{ $inc: { xp: amount }, $set: { lastUpdated: new Date() } },
			{ upsert: true, new: true }
		)
		const level = levelFor(doc.xp)
		if (level !== doc.level) {
			await Level.updateOne({ _id: doc._id }, { $set: { level } })
			return level > doc.level
		}
		return false
	}
}
