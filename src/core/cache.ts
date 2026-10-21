import type { CacheStore } from 'baileys'

/** Tiny TTL + size-capped cache that satisfies Baileys' CacheStore interface. */
export class TtlCache implements CacheStore {
	private store = new Map<string, { value: unknown; expires: number }>()

	constructor(
		private ttlMs: number,
		private maxEntries = 5_000
	) {}

	get<T>(key: string): T | undefined {
		const entry = this.store.get(key)
		if (!entry) return undefined
		if (entry.expires < Date.now()) {
			this.store.delete(key)
			return undefined
		}
		return entry.value as T
	}

	set<T>(key: string, value: T) {
		if (this.store.size >= this.maxEntries) {
			const oldest = this.store.keys().next().value
			if (oldest !== undefined) this.store.delete(oldest)
		}
		this.store.delete(key)
		this.store.set(key, { value, expires: Date.now() + this.ttlMs })
	}

	del(key: string) {
		this.store.delete(key)
	}

	flushAll() {
		this.store.clear()
	}
}
