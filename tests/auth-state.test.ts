import { describe, expect, test } from 'bun:test'
import { proto } from 'baileys'
import { useMongoAuthState, type AuthCollection } from '../src/core/auth-state.ts'

/** In-memory stand-in for the MongoDB collection (only the operations the store uses). */
const memoryCollection = () => {
	const docs = new Map<string, any>()
	const col = {
		docs,
		find: (q: any) => ({ toArray: async () => q._id.$in.map((id: string) => docs.get(id)).filter(Boolean) }),
		findOne: async (q: any) => docs.get(q._id) ?? null,
		bulkWrite: async (ops: any[]) => {
			for (const op of ops) {
				if (op.replaceOne) docs.set(op.replaceOne.filter._id, { _id: op.replaceOne.filter._id, ...op.replaceOne.replacement })
				if (op.deleteOne) docs.delete(op.deleteOne.filter._id)
			}
			return {} as any
		},
		deleteMany: async (q: any) => {
			for (const [id, d] of docs) if (d.session === q.session && (!q.type || d.type !== q.type.$ne)) docs.delete(id)
			return {} as any
		},
		countDocuments: async () => docs.size
	}
	return col as typeof col & AuthCollection
}

describe('Mongo auth state', () => {
	test('creds and keys round-trip, including Buffers and v7 key types', async () => {
		const col = memoryCollection()
		const first = await useMongoAuthState('test', col)
		expect(first.state.creds.registered).toBe(false)
		await first.saveCreds()

		await first.state.keys.set({
			session: { 'abc.0': new Uint8Array([1, 2, 3]) },
			'lid-mapping': { '9191': '123456@lid' },
			'device-list': { '9191': ['0', '1'] },
			tctoken: { '9191': { token: Buffer.from('tok'), timestamp: '1' } },
			'app-state-sync-key': { k1: { keyData: new Uint8Array([9]) } }
		})

		// A fresh load reads everything back from the store.
		const second = await useMongoAuthState('test', col)
		expect(Buffer.from(second.state.creds.noiseKey.private)).toEqual(Buffer.from(first.state.creds.noiseKey.private))

		const sessions = await second.state.keys.get('session', ['abc.0', 'missing'])
		expect(Buffer.from(sessions['abc.0'] as Uint8Array)).toEqual(Buffer.from([1, 2, 3]))
		expect(sessions.missing).toBeUndefined()
		expect((await second.state.keys.get('lid-mapping', ['9191']))['9191']).toBe('123456@lid')
		expect((await second.state.keys.get('device-list', ['9191']))['9191']).toEqual(['0', '1'])
		expect(Buffer.from((await second.state.keys.get('tctoken', ['9191']))['9191'].token).toString()).toBe('tok')
		const appKey = (await second.state.keys.get('app-state-sync-key', ['k1'])).k1
		expect(appKey).toBeInstanceOf(proto.Message.AppStateSyncKeyData)
	})

	test('null values delete keys and clearState wipes the session', async () => {
		const col = memoryCollection()
		const auth = await useMongoAuthState('s1', col)
		await auth.saveCreds()
		await auth.state.keys.set({ 'pre-key': { '1': { public: new Uint8Array([1]), private: new Uint8Array([2]) } } })
		await auth.state.keys.set({ 'pre-key': { '1': null } })
		expect(await auth.state.keys.get('pre-key', ['1'])).toEqual({})

		await auth.state.keys.set({ session: { x: new Uint8Array([1]) } })
		await auth.clearState()
		expect(col.docs.size).toBe(0)
	})

	test('sessions are isolated by id', async () => {
		const col = memoryCollection()
		const a = await useMongoAuthState('a', col)
		const b = await useMongoAuthState('b', col)
		await a.state.keys.set({ session: { x: new Uint8Array([7]) } })
		expect(await b.state.keys.get('session', ['x'])).toEqual({})
	})
})
