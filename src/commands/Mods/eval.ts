import { inspect } from 'node:util'
import { defineCommand } from '../../types.js'

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor as new (...args: string[]) => (...a: unknown[]) => Promise<unknown>

export default defineCommand({
	name: 'eval',
	alias: ['evaluate'],
	desc: 'Evaluates JavaScript (mods only). `client`, `m` and `ctx` are in scope.',
	usage: '%prefix%command <code>',
	category: 'Mods',
	react: '✅',
	ownerOnly: true,
	start: async (client, m, ctx) => {
		if (!ctx.text) return m.reply('Give me some code to run')
		let result: unknown
		try {
			// Try as an expression first, then as statements.
			try {
				result = await new AsyncFunction('client', 'm', 'ctx', `return (${ctx.text})`)(client, m, ctx)
			} catch (err) {
				if (!(err instanceof SyntaxError)) throw err
				result = await new AsyncFunction('client', 'm', 'ctx', ctx.text)(client, m, ctx)
			}
		} catch (err) {
			return m.reply(`❌ ${err instanceof Error ? err.message : String(err)}`)
		}
		const out = typeof result === 'string' ? result : inspect(result, { depth: 2 })
		await m.reply(out?.slice(0, 4000) || 'Evaluated JavaScript')
	}
})
