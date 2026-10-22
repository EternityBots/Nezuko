import { readdir } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import type { Category, Command } from '../types.js'

export class CommandRegistry {
	private byName = new Map<string, Command>()
	private byAlias = new Map<string, Command>()

	add(command: Command) {
		const name = command.name.toLowerCase()
		if (this.byName.has(name)) throw new Error(`Duplicate command name "${name}"`)
		this.byName.set(name, command)
		for (const alias of command.alias ?? []) {
			const key = alias.toLowerCase()
			const existing = this.byAlias.get(key)
			if (existing && existing !== command) console.warn(`[commands] Alias "${key}" is used by both ${existing.name} and ${command.name}`)
			this.byAlias.set(key, command)
		}
	}

	get(name: string) {
		const key = name.toLowerCase()
		return this.byName.get(key) ?? this.byAlias.get(key)
	}

	all() {
		return [...this.byName.values()]
	}

	byCategory() {
		const groups = new Map<Category, Command[]>()
		for (const cmd of this.all()) {
			if (cmd.hidden) continue
			const list = groups.get(cmd.category) ?? []
			list.push(cmd)
			groups.set(cmd.category, list)
		}
		return groups
	}

	get size() {
		return this.byName.size
	}
}

/**
 * Load every command in src/commands/<Category>/*.
 * Works from TypeScript sources (Bun) and from the compiled dist folder (Node).
 */
export const loadCommands = async () => {
	const registry = new CommandRegistry()
	const here = fileURLToPath(import.meta.url)
	const ext = extname(here) // ".ts" under Bun, ".js" after tsc
	const root = join(here, '..', '..', 'commands')
	for (const dir of await readdir(root, { withFileTypes: true })) {
		if (!dir.isDirectory()) continue
		for (const file of await readdir(join(root, dir.name))) {
			if (extname(file) !== ext || file.endsWith('.d.ts')) continue
			const mod = await import(pathToFileURL(join(root, dir.name, file)).href)
			const command: Command | undefined = mod.default
			if (!command?.name || typeof command.start !== 'function') {
				console.warn(`[commands] ${dir.name}/${file} has no default command export, skipped`)
				continue
			}
			registry.add(command)
		}
	}
	return registry
}
