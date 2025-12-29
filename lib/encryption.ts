import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16

/**
 * Get encryption key from environment
 * Must be a 32-byte (64 character hex) string
 */
function getEncryptionKey(): Buffer {
  const key = process.env.BANK_ENCRYPTION_KEY
  if (!key) {
    throw new Error('BANK_ENCRYPTION_KEY environment variable is not set')
  }
  if (key.length !== 64) {
    throw new Error('BANK_ENCRYPTION_KEY must be 64 hex characters (32 bytes)')
  }
  return Buffer.from(key, 'hex')
}

/**
 * Encrypt a string value
 * Returns format: iv:encryptedData (both in hex)
 */
export function encrypt(text: string): string {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return `${iv.toString('hex')}:${encrypted}`
}

/**
 * Decrypt an encrypted string
 * Expects format: iv:encryptedData (both in hex)
 */
export function decrypt(encryptedText: string): string {
  const key = getEncryptionKey()
  const [ivHex, encryptedHex] = encryptedText.split(':')

  if (!ivHex || !encryptedHex) {
    throw new Error('Invalid encrypted text format')
  }

  const iv = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Get the last 4 characters of a string (for masking account numbers)
 */
export function getLast4(value: string): string {
  if (!value || value.length < 4) {
    return value || ''
  }
  return value.slice(-4)
}

/**
 * Mask a value showing only last 4 characters
 */
export function maskValue(value: string, visibleChars = 4): string {
  if (!value || value.length <= visibleChars) {
    return value || ''
  }
  const masked = '*'.repeat(value.length - visibleChars)
  return masked + value.slice(-visibleChars)
}

/**
 * Generate a content hash for agreement versioning
 */
export function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex')
}

/**
 * Generate a random encryption key (for setup)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex')
}
