import express from 'express'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import qrcode from 'qrcode'
import { config } from './config.js'
import { connectionState } from './core/socket.js'

const publicDir = join(fileURLToPath(import.meta.url), '..', '..', 'public')

/** Small web server: landing page, QR code at /qr?session=SESSION_ID, and /health for uptime checks. */
export const startServer = () => {
	const app = express()
	app.use('/', express.static(publicDir))

	app.get('/health', (_req, res) => {
		res.json({ status: connectionState.status })
	})

	app.get('/qr', async (req, res) => {
		res.setHeader('Content-Type', 'text/plain')
		if (!req.query.session) return void res.status(400).send('Provide the session id for authentication')
		if (req.query.session !== config.sessionId) return void res.status(403).send('Invalid session')
		if (connectionState.status === 'open') return void res.status(409).send('Session already exists')
		if (connectionState.pairingCode) return void res.send(`Pairing code: ${connectionState.pairingCode}`)
		if (!connectionState.qr) return void res.status(503).send('QR code not ready yet, refresh in a few seconds')
		res.setHeader('Content-Type', 'image/png')
		res.send(await qrcode.toBuffer(connectionState.qr, { width: 360 }))
	})

	app.listen(config.port, () => console.log(`[server] Listening on port ${config.port}`))
}
