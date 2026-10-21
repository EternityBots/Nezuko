import { expect, spyOn, test } from 'bun:test'
import { loadCommands } from '../src/core/commands.ts'

test('all commands load with unique names and aliases', async () => {
	const warn = spyOn(console, 'warn')
	const registry = await loadCommands()
	expect(registry.size).toBe(60)
	expect(warn).not.toHaveBeenCalled()

	for (const cmd of registry.all()) {
		expect(cmd.category).toBeTruthy()
		expect(typeof cmd.start).toBe('function')
	}
	// A few lookups by name and alias.
	expect(registry.get('menu')?.name).toBe('help')
	expect(registry.get('ytmp3')?.name).toBe('yta')
	expect(registry.get('pat')?.name).toBe('reaction')
	expect(registry.get('slap')?.name).toBe('slap')
	expect(registry.get('tagall')?.name).toBe('ping')
	expect(registry.get('nope')).toBeUndefined()
	warn.mockRestore()
})
