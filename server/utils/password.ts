import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [saltHex, hashHex] = stored.split(':')
    if (!saltHex || !hashHex) return false
    const salt = Buffer.from(saltHex, 'hex')
    const expected = Buffer.from(hashHex, 'hex')
    const actual = scryptSync(password, salt, 64)
    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}
