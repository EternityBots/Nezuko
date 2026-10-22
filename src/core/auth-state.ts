import {
	BufferJSON,
	initAuthCreds,
	proto,
	type AuthenticationCreds,
	type AuthenticationState,
	type SignalDataSet,
	type SignalDataTypeMap
} from 'baileys'
import type { AnyBulkWriteOperation, Collection } from 'mongodb'
import mongoose from 'mongoose'
import { LegacySession } from '../db/models.js'

interface AuthDoc {
	_id: string
	session: string
	type: string
	id: string
	value: string
}

/** Minimal surface of a MongoDB collection, so the store can be unit-tested. */
export type AuthCollection = Pick<Collection<AuthDoc>, 'find' | 'findOne' | 'bulkWrite' | 'deleteMany' | 'countDocuments'>

const serialize = (value: unknown) => JSON.stringify(value, BufferJSON.replacer)
const deserialize = <T>(value: string): T => JSON.parse(value, BufferJSON.reviver)

/** Key names the old v6 store used for each signal data type. */
const LEGACY_KEY_MAP: Record<string, keyof SignalDataTypeMap> = {
	preKeys: 'pre-key',
	sessions: 'session',
	senderKeys: 'sender-key',
	appStateSyncKeys: 'app-state-sync-key',
	appStateVersions: 'app-state-sync-version',
	senderKeyMemory: 'sender-key-memory'
}

/**
 * Baileys v7 auth state stored in MongoDB.
 *
 * Every key is its own document, writes happen in one ordered bulk operation, and
 * all v7 key types (including lid-mapping, device-list and tctoken) are supported.
 */
export const useMongoAuthState = async (sessionId: string, collection?: AuthCollection) => {
	const col: AuthCollection = collection ?? (mongoose.connection.collection<AuthDoc>('baileys_auth') as unknown as AuthCollection)
	const docId = (type: string, id: string) => `${sessionId}:${type}:${id}`

	const writeCreds = async (creds: AuthenticationCreds) => {
		await col.bulkWrite([
			{
				replaceOne: {
					filter: { _id: docId('creds', 'main') },
					replacement: { session: sessionId, type: 'creds', id: 'main', value: serialize(creds) },
					upsert: true
				}
			}
		])
	}

	const setKeys = async (data: SignalDataSet) => {
		const ops: AnyBulkWriteOperation<AuthDoc>[] = []
		for (const type in data) {
			const entries = data[type as keyof SignalDataTypeMap]
			if (!entries) continue
			for (const id in entries) {
				const value = entries[id]
				const _id = docId(type, id)
				if (value === null || value === undefined) {
					ops.push({ deleteOne: { filter: { _id } } })
				} else {
					ops.push({
						replaceOne: {
							filter: { _id },
							replacement: { session: sessionId, type, id, value: serialize(value) },
							upsert: true
						}
					})
				}
			}
		}
		if (ops.length) await col.bulkWrite(ops, { ordered: true })
	}

	/** One-time import of a session saved by the old (Baileys v6) version of this bot. */
	const importLegacySession = async (): Promise<AuthenticationCreds | undefined> => {
		if (collection) return undefined // tests pass their own collection
		const legacy = await LegacySession.findOne({ sessionId }).lean().catch(() => null)
		if (!legacy?.session) return undefined
		const parsed = deserialize<{ creds?: AuthenticationCreds; keys?: Record<string, Record<string, unknown>> }>(legacy.session)
		if (!parsed.creds) return undefined
		const creds = { ...initAuthCreds(), ...parsed.creds }
		const data: SignalDataSet = {}
		for (const [legacyName, entries] of Object.entries(parsed.keys ?? {})) {
			const type = LEGACY_KEY_MAP[legacyName]
			if (type && entries) (data as Record<string, unknown>)[type] = entries
		}
		await setKeys(data)
		await writeCreds(creds)
		return creds
	}

	const stored = await col.findOne({ _id: docId('creds', 'main') })
	let migrated = false
	let creds: AuthenticationCreds
	if (stored) {
		creds = deserialize<AuthenticationCreds>(stored.value)
	} else {
		const legacy = await importLegacySession()
		migrated = Boolean(legacy)
		creds = legacy ?? initAuthCreds()
	}

	const state: AuthenticationState = {
		creds,
		keys: {
			get: async (type, ids) => {
				const result: { [id: string]: SignalDataTypeMap[typeof type] } = {}
				if (!ids.length) return result
				const docs = await col.find({ _id: { $in: ids.map(id => docId(type, id)) } }).toArray()
				for (const doc of docs) {
					let value = deserialize<any>(doc.value)
					if (type === 'app-state-sync-key' && value) {
						value = proto.Message.AppStateSyncKeyData.fromObject(value)
					}
					result[doc.id] = value
				}
				return result
			},
			set: setKeys,
			clear: async () => {
				await col.deleteMany({ session: sessionId, type: { $ne: 'creds' } })
			}
		}
	}

	return {
		state,
		/** True when an old v6 session was imported on this start. */
		migrated,
		saveCreds: () => writeCreds(state.creds),
		/** Delete everything stored for this session (used after a logout). */
		clearState: async () => {
			await col.deleteMany({ session: sessionId })
		}
	}
}
