import { createHash, randomBytes } from 'node:crypto'

export function createPasswordResetToken() {
  const token = randomBytes(32).toString('hex')

  return {
    token,
    tokenHash: createHash('sha256').update(token).digest('hex'),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  }
}

export function hashPasswordResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}
