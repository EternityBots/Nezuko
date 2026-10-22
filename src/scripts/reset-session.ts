/**
 * Deletes the stored WhatsApp session so the bot shows a new QR / pairing code on next start.
 * Usage: bun run reset-session   (or: npm run build && npm run reset-session:node)
 */
import mongoose from 'mongoose'
import { config } from '../config.js'
import { useMongoAuthState } from '../core/auth-state.js'
import { connectDatabase } from '../db/models.js'

if (!config.mongodb) {
	console.error('MONGODB is not set')
	process.exit(1)
}

await connectDatabase(config.mongodb)
const { clearState } = await useMongoAuthState(config.sessionId)
await clearState()
await mongoose.connection.collection('sessionschemas').deleteOne({ sessionId: config.sessionId })
console.log(`Session "${config.sessionId}" deleted. Start the bot to link it again.`)
await mongoose.disconnect()
