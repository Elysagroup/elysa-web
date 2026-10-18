import 'server-only'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const candidate = scryptSync(password, salt, 64)
  const storedHash = Buffer.from(hash, 'hex')
  if (storedHash.length !== candidate.length) return false
  return timingSafeEqual(storedHash, candidate)
}

export function generateTemporaryPassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  const bytes = randomBytes(12)
  let password = 'Ey'
  for (let i = 0; i < 10; i += 1) password += alphabet[bytes[i] % alphabet.length]
  return `${password}!`
}
