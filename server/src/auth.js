import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

/**
 * Accounts and sessions.
 *
 * Passwords are hashed with scrypt and a per-user salt; sessions are signed
 * tokens rather than rows in a table, so nothing has to be looked up on every
 * request and nothing has to be cleaned up when they expire.
 *
 * The signing secret comes from the environment. In development one is
 * generated at startup, which means restarting the server signs everyone out —
 * the right trade for a machine with no secret configured, since the
 * alternative is shipping a default secret that would be the same everywhere.
 */

const SECRET = process.env.SITEBUILDER_SECRET ?? randomBytes(32).toString('hex')
const SESSION_DAYS = 30

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored ?? '').split(':')
  if (!salt || !hash) return false

  const attempt = scryptSync(password, salt, 64)
  const expected = Buffer.from(hash, 'hex')
  // Lengths must match before timingSafeEqual, and comparing this way keeps a
  // wrong password from being distinguishable by how long the check took.
  if (attempt.length !== expected.length) return false
  return timingSafeEqual(attempt, expected)
}

function sign(payload) {
  return createHmac('sha256', SECRET).update(payload).digest('base64url')
}

export function createToken(userId) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  const payload = `${userId}.${expires}`
  return `${payload}.${sign(payload)}`
}

/** The user id in a token, or null if it is forged, altered or expired. */
export function readToken(token) {
  const parts = String(token ?? '').split('.')
  if (parts.length !== 3) return null

  const [userId, expires, signature] = parts
  const payload = `${userId}.${expires}`

  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null

  if (Number(expires) < Date.now()) return null
  return userId
}

export function normaliseEmail(email) {
  return String(email ?? '').trim().toLowerCase()
}

/** Why a sign-up should be refused, or null when it is fine. */
export function checkCredentials(email, password) {
  if (!normaliseEmail(email).includes('@')) return 'That does not look like an email address'
  if (String(password ?? '').length < 8) return 'Please use a password of at least 8 characters'
  return null
}
