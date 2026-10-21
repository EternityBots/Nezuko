import { describe, expect, mock, test } from 'bun:test'

import { findParticipant, isAdminParticipant, isOwner } from '../src/core/identity.ts'
import { serialize } from '../src/core/serialize.ts'

// MODS=919000000001 is set in tests/setup.ts.

const fakeClient = (lidMap: Record<string, string> = {}) =>
	({
		user: { id: '919999999999:12@s.whatsapp.net', lid: '555555:12@lid' },
		toPn: async (jid?: string) => (jid?.endsWith('@lid') ? lidMap[jid] : jid),
		sendMessage: mock(async () => undefined),
		downloadMedia: mock(async () => Buffer.from('media'))
	}) as any

describe('serialize', () => {
	test('LID-addressed group message resolves the phone number from participantAlt', async () => {
		const m = await serialize(fakeClient(), {
			key: { remoteJid: '1203@g.us', id: 'ABC', participant: '777@lid', participantAlt: '919000000001@s.whatsapp.net' },
			pushName: 'Tanjiro',
			message: { extendedTextMessage: { text: '.help', contextInfo: { mentionedJid: ['888@lid'] } } }
		})
		expect(m).not.toBeNull()
		expect(m!.isGroup).toBe(true)
		expect(m!.sender).toBe('777@lid')
		expect(m!.senderLid).toBe('777@lid')
		expect(m!.senderPn).toBe('919000000001@s.whatsapp.net')
		expect(m!.text).toBe('.help')
		expect(m!.mentions).toEqual(['888@lid'])
		expect(isOwner([m!.sender, m!.senderPn])).toBe(true)
	})

	test('falls back to the stored LID mapping when no alt JID is sent', async () => {
		const m = await serialize(fakeClient({ '777@lid': '918888888888@s.whatsapp.net' }), {
			key: { remoteJid: '1203@g.us', id: 'X', participant: '777@lid' },
			message: { conversation: 'hi' }
		})
		expect(m!.senderPn).toBe('918888888888@s.whatsapp.net')
		expect(isOwner([m!.sender, m!.senderPn])).toBe(false)
	})

	test('DM with a phone-number JID and a quoted image', async () => {
		const client = fakeClient()
		const m = await serialize(client, {
			key: { remoteJid: '919000000002@s.whatsapp.net', id: 'Q1' },
			message: {
				extendedTextMessage: {
					text: '.sticker',
					contextInfo: {
						stanzaId: 'IMG1',
						participant: '919999999999@s.whatsapp.net',
						quotedMessage: { imageMessage: { mimetype: 'image/jpeg', caption: 'cat' } }
					}
				}
			}
		})
		expect(m!.isGroup).toBe(false)
		expect(m!.senderPn).toBe('919000000002@s.whatsapp.net')
		expect(m!.quoted?.type).toBe('imageMessage')
		expect(m!.quoted?.mimetype).toBe('image/jpeg')
		expect(m!.quoted?.text).toBe('cat')
		expect(m!.quoted?.fromMe).toBe(true) // quoted the bot's own number
		expect((await m!.quoted!.download()).toString()).toBe('media')
	})

	test('admin lookup matches by LID or phone number', () => {
		const participants = [
			{ id: '777@lid', phoneNumber: '919000000001@s.whatsapp.net', admin: 'admin' as const },
			{ id: '555555@lid', phoneNumber: '919999999999@s.whatsapp.net', admin: null }
		]
		expect(isAdminParticipant(findParticipant(participants, ['919000000001@s.whatsapp.net']))).toBe(true)
		expect(isAdminParticipant(findParticipant(participants, ['555555:12@lid']))).toBe(false)
		expect(findParticipant(participants, ['000@lid'])).toBeUndefined()
	})
})
