import { all, create } from 'mathjs'
import { defineCommand } from '../../types.js'

// A restricted mathjs instance: user input can't import, define functions or reach the parser.
const math = create(all)
const evaluate = math.evaluate.bind(math)
const blocked = () => {
	throw new Error('Function disabled')
}
math.import(
	{ import: blocked, createUnit: blocked, evaluate: blocked, parse: blocked, simplify: blocked, derivative: blocked, resolve: blocked, reviver: blocked },
	{ override: true }
)

export default defineCommand({
	name: 'calculator',
	alias: ['calc'],
	desc: 'Solves a math expression',
	usage: '%prefix%command 2+2*3',
	category: 'Education',
	react: '📖',
	start: async (client, m, { text }) => {
		if (!text) return m.reply('*Please give me an expression to solve*')
		try {
			const answer = math.format(evaluate(text), { precision: 14 })
			await m.reply(`*📘 Question :-*\n${text}\n\n*💡 Answer :-*\n${answer}`)
		} catch {
			await m.reply(`*${text}* isn't a valid expression`)
		}
	}
})
