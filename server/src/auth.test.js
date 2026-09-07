import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import {
  checkCredentials,
  createToken,
  hashPassword,
  normaliseEmail,
  readToken,
  verifyPassword,
} from './auth.js'

describe('passwords', () => {
  test('accepts the right password and rejects the wrong one', () => {
    const stored = hashPassword('correct horse battery')
    assert.equal(verifyPassword('correct horse battery', stored), true)
    assert.equal(verifyPassword('correct horse batteryy', stored), false)
  })

  test('never stores the password itself', () => {
    const stored = hashPassword('hunter2hunter2')
    assert.ok(!stored.includes('hunter2'))
  })

  test('salts each hash, so two identical passwords do not match', () => {
    // Without a per-user salt, a leaked table would show at a glance which
    // accounts share a password.
    assert.notEqual(hashPassword('same password'), hashPassword('same password'))
  })

  test('survives a stored value that is missing or malformed', () => {
    assert.equal(verifyPassword('anything', undefined), false)
    assert.equal(verifyPassword('anything', 'nonsense'), false)
    assert.equal(verifyPassword('anything', 'only:one'), false)
  })
})

describe('session tokens', () => {
  test('reads back the user it was made for', () => {
    assert.equal(readToken(createToken('user-42')), 'user-42')
  })

  test('refuses a token that has been altered', () => {
    const token = createToken('user-42')
    assert.equal(readToken(token.replace('user-42', 'user-1')), null)
    assert.equal(readToken(`${token}x`), null)
  })

  test('refuses nonsense rather than throwing', () => {
    assert.equal(readToken(''), null)
    assert.equal(readToken(undefined), null)
    assert.equal(readToken('a.b'), null)
  })
})

describe('checkCredentials', () => {
  test('asks for an email and a password worth having', () => {
    assert.equal(checkCredentials('someone@example.com', 'longenough1'), null)
    assert.ok(checkCredentials('not-an-email', 'longenough1'))
    assert.ok(checkCredentials('someone@example.com', 'short'))
  })
})

describe('normaliseEmail', () => {
  test('treats the same address written differently as one address', () => {
    assert.equal(normaliseEmail('  Someone@Example.COM '), 'someone@example.com')
  })
})
