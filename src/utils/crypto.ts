/**
 * Cryptographic utility functions
 */

/**
 * Secure random number generation
 */
export function generateSecureRandom(byteCount: number): Uint8Array {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(byteCount))
  }
  
  // Fallback for older browsers (should show warning)
  console.warn('crypto.getRandomValues not available, using Math.random fallback (not cryptographically secure)')
  const array = new Uint8Array(byteCount)
  for (let i = 0; i < byteCount; i++) {
    array[i] = Math.floor(Math.random() * 256)
  }
  return array
}

/**
 * Check if crypto.getRandomValues is available
 */
export function isCryptoSecure(): boolean {
  return typeof crypto !== 'undefined' && !!crypto.getRandomValues
}

/**
 * Convert bytes to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Convert hex string to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleaned = hex.replace(/^0x/, '').replace(/\s/g, '')
  if (cleaned.length % 2 !== 0) {
    throw new Error('Invalid hex string length')
  }
  
  const bytes = new Uint8Array(cleaned.length / 2)
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.slice(i, i + 2), 16)
  }
  return bytes
}

/**
 * Validate hex string
 */
export function isValidHex(hex: string): boolean {
  const cleaned = hex.replace(/^0x/, '').replace(/\s/g, '')
  return /^[0-9a-fA-F]+$/.test(cleaned) && cleaned.length % 2 === 0
}

/**
 * Clear sensitive data from memory (best effort)
 */
export function clearSensitiveData(obj: unknown): void {
  if (typeof obj === 'string') {
    // Can't actually clear string in JS, but zero out if it's in an array
    return
  }
  
  if (obj instanceof Uint8Array || obj instanceof Array) {
    obj.fill(0)
  }
  
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      try {
        delete (obj as Record<string, unknown>)[key]
      } catch {
        // Ignore errors for non-configurable properties
      }
    })
  }
}

/**
 * Timing-safe string comparison
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Validate Bitcoin address format
 */
export function isValidBitcoinAddress(address: string): boolean {
  // Basic format validation for common address types
  const patterns = [
    /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Legacy P2PKH and P2SH
    /^bc1[a-z0-9]{39,59}$/, // Bech32 P2WPKH and P2WSH
    /^tb1[a-z0-9]{39,59}$/, // Testnet Bech32
  ]
  
  return patterns.some(pattern => pattern.test(address))
}

/**
 * Calculate checksum for validation
 */
export function calculateChecksum(data: Uint8Array): Uint8Array {
  // Simple XOR checksum - replace with proper implementation for production
  let checksum = 0
  for (const byte of data) {
    checksum ^= byte
  }
  return new Uint8Array([checksum])
}