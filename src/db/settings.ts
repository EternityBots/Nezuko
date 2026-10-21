import { Setting } from './models.js'

/**
 * Lists the bot keeps. Key names match the old quick.db keys.
 * - mods:   groups with anti-link enabled (the old "mod" toggle)
 * - nsfw:   groups that allow NSFW subreddits in the reddit command
 * - events: groups with welcome/goodbye messages
 * - ban:    users banned from using commands
 */
export type ListKey = 'mods' | 'nsfw' | 'events' | 'ban'

const cache = new Map<ListKey, Set<string>>()

const load = async (key: ListKey): Promise<Set<string>> => {
	let set = cache.get(key)
	if (!set) {
		const doc = await Setting.findById(key).lean()
		set = new Set(doc?.values ?? [])
		cache.set(key, set)
	}
	return set
}

export const settings = {
	async has(key: ListKey, value: string) {
		return (await load(key)).has(value)
	},
	async list(key: ListKey) {
		return [...(await load(key))]
	},
	async add(key: ListKey, value: string) {
		const set = await load(key)
		if (set.has(value)) return false
		await Setting.updateOne({ _id: key }, { $addToSet: { values: value } }, { upsert: true })
		set.add(value)
		return true
	},
	async remove(key: ListKey, value: string) {
		const set = await load(key)
		if (!set.has(value)) return false
		await Setting.updateOne({ _id: key }, { $pull: { values: value } })
		set.delete(value)
		return true
	}
}
