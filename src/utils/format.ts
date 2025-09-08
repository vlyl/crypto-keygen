/**
 * Formatting utilities for display
 */

/**
 * Format long strings with ellipsis in the middle
 */
export function formatMiddleEllipsis(
  str: string, 
  startLength: number = 6, 
  endLength: number = 6
): string {
  if (str.length <= startLength + endLength) {
    return str
  }
  return `${str.slice(0, startLength)}...${str.slice(-endLength)}`
}

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
  return formatMiddleEllipsis(address, 8, 8)
}

/**
 * Format private key for display
 */
export function formatPrivateKey(privateKey: string): string {
  return formatMiddleEllipsis(privateKey, 4, 4)
}

/**
 * Format public key for display
 */
export function formatPublicKey(publicKey: string): string {
  return formatMiddleEllipsis(publicKey, 6, 6)
}

/**
 * Format BIP39 mnemonic with proper spacing
 */
export function formatMnemonic(mnemonic: string): string {
  return mnemonic.trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Format seed for display
 */
export function formatSeed(seed: string): string {
  return formatMiddleEllipsis(seed, 8, 8)
}

/**
 * Format derivation path for display
 */
export function formatDerivationPath(
  purpose: number,
  coin: number,
  account: number,
  change: number,
  index?: number
): string {
  const base = `m/${purpose}'/${coin}'/${account}'/${change}`
  return index !== undefined ? `${base}/${index}` : base
}

/**
 * Add spaces to hex strings for readability
 */
export function formatHexWithSpaces(hex: string, groupSize: number = 2): string {
  return hex.replace(new RegExp(`(.{${groupSize}})`, 'g'), '$1 ').trim()
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Format file size in bytes to human readable
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Format time duration
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(0)} seconds`
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`
  if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} days`
  if (seconds < 31536000000) return `${(seconds / 31536000).toFixed(1)} years`
  return `${(seconds / 31536000000).toFixed(1)} billion years`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      return result
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Download text as file
 */
export function downloadAsFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}