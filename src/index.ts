import cfonts from 'cfonts'
import chalk from 'chalk'
import { config } from './config.js'
import { loadCommands } from './core/commands.js'
import { startSocket } from './core/socket.js'
import { connectDatabase } from './db/models.js'
import { handleParticipants } from './handlers/group-events.js'
import { createMessageHandler } from './handlers/message.js'
import { randomHex } from './lib/utils.js'
import { startServer } from './server.js'

const bun = (globalThis as { Bun?: { version: string } }).Bun
const runtime = bun ? `Bun ${bun.version}` : `Node ${process.version}`

cfonts.say('NEZUKO\n\nBY\n\nETERNITY', {
	font: 'block',
	align: 'center',
	gradient: [randomHex(), randomHex()],
	transitionGradient: true,
	space: true
})
console.log(chalk.gray(`Running on ${runtime}`))

if (!config.mongodb) {
	console.error(chalk.red('MONGODB is not set. Add your MongoDB connection string to .env (see .env.example).'))
	process.exit(1)
}
if (!config.owners.length) {
	console.warn(chalk.yellow('MODS is empty: nobody can use owner commands. Add your number to .env.'))
}

try {
	await connectDatabase(config.mongodb)
	console.log('[db] Connected to MongoDB')
} catch (err) {
	console.error(chalk.red(`[db] Could not connect to MongoDB: ${err instanceof Error ? err.message : err}`))
	console.error(chalk.red('Check the MONGODB connection string and that your database allows connections from this server.'))
	process.exit(1)
}

const commands = await loadCommands()
console.log(`[commands] Loaded ${commands.size} commands`)

startServer()
await startSocket({
	onMessages: createMessageHandler(commands),
	onParticipants: handleParticipants
})

process.on('unhandledRejection', err => console.error('[unhandledRejection]', err))
