import { areJidsSameUser, isLidUser, isPnUser, jidNormalizedUser, type GroupParticipant } from 'baileys'
import { config } from '../config.js'

/**
 * WhatsApp now addresses users by LID (`123@lid`) as well as phone number (`91…@s.whatsapp.net`).
 * These helpers compare users across both forms.
 */

export const OWNER_JIDS = new Set(config.owners.map(n => `${n}@s.whatsapp.net`))

/** Every JID we know for a participant. */
export const participantIds = (p: GroupParticipant) => [p.id, p.phoneNumber, p.lid].filter((j): j is string => Boolean(j))

export const isSameUser = (ids: (string | undefined)[], others: (string | undefined)[]) =>
	ids.some(a => a && others.some(b => b && areJidsSameUser(a, b)))

export const findParticipant = (participants: GroupParticipant[], ids: (string | undefined)[]) =>
	participants.find(p => isSameUser(participantIds(p), ids))

export const isAdminParticipant = (p?: GroupParticipant) => Boolean(p && (p.admin === 'admin' || p.admin === 'superadmin' || p.isAdmin || p.isSuperAdmin))

export const isOwner = (ids: (string | undefined)[]) => ids.some(j => j && isPnUser(j) && OWNER_JIDS.has(jidNormalizedUser(j)))

/** Stable ID for storing per-user data: phone-number JID when known, otherwise the LID. */
export const canonicalId = (pn: string | undefined, jid: string) => jidNormalizedUser(pn ?? jid)

export { isLidUser, isPnUser, jidNormalizedUser }
