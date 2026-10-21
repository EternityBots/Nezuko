import mongoose, { Schema, model } from 'mongoose'

/** Known display names of users (from push names / contacts). */
const userSchema = new Schema({
	id: { type: String, required: true, unique: true },
	name: { type: String }
})
export const User = model('User', userSchema)

/**
 * XP levels. Same collection and fields the old `discord-xp` package used,
 * so existing XP carries over after upgrading.
 */
const levelSchema = new Schema({
	userID: { type: String, required: true },
	guildID: { type: String, required: true },
	xp: { type: Number, default: 0 },
	level: { type: Number, default: 0 },
	lastUpdated: { type: Date, default: () => new Date() }
})
levelSchema.index({ userID: 1, guildID: 1 }, { unique: true })
export const Level = model('Levels', levelSchema)

/** Simple list storage that replaces quick.db (antilink/nsfw/events groups, banned users). */
const settingSchema = new Schema({
	_id: { type: String, required: true },
	values: { type: [String], default: [] }
})
export const Setting = model('Setting', settingSchema)

/** The session collection used by the old v6 auth store, read once for migration. */
const legacySessionSchema = new Schema({
	sessionId: { type: String, required: true, unique: true },
	session: String
})
export const LegacySession = model('sessionschemas', legacySessionSchema)

export const connectDatabase = async (uri: string) => {
	mongoose.set('strictQuery', true)
	await mongoose.connect(uri, { serverSelectionTimeoutMS: 15_000 })
	return mongoose.connection
}
