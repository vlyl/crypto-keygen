import { describe, it, expect, vi } from 'vitest'
import {
  formatMiddleEllipsis,
  formatAddress,
  formatMnemonic,
  formatDerivationPath,
  formatDuration,
  copyToClipboard,
} from '../format'

describe('format utilities', () => {
  describe('formatMiddleEllipsis', () => {
    it('should add ellipsis to long strings', () => {
      const result = formatMiddleEllipsis('abcdefghijklmnopqrstuvwxyz', 4, 4)
      expect(result).toBe('abcd...wxyz')
    })

    it('should return original string if short enough', () => {
      const result = formatMiddleEllipsis('short', 4, 4)
      expect(result).toBe('short')
    })

    it('should handle edge cases', () => {
      expect(formatMiddleEllipsis('', 4, 4)).toBe('')
      expect(formatMiddleEllipsis('a', 4, 4)).toBe('a')
    })
  })

  describe('formatAddress', () => {
    it('should format Bitcoin addresses', () => {
      const address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      const result = formatAddress(address)
      
      expect(result).toContain('1A1zP1eP')
      expect(result).toContain('DivfNa')
      expect(result).toContain('...')
    })
  })

  describe('formatMnemonic', () => {
    it('should normalize mnemonic spacing', () => {
      const mnemonic = '  word1   word2\t\tword3  \n word4  '
      const result = formatMnemonic(mnemonic)
      
      expect(result).toBe('word1 word2 word3 word4')
    })

    it('should convert to lowercase', () => {
      const mnemonic = 'Word1 WORD2 Word3'
      const result = formatMnemonic(mnemonic)
      
      expect(result).toBe('word1 word2 word3')
    })
  })

  describe('formatDerivationPath', () => {
    it('should format BIP44 path correctly', () => {
      const result = formatDerivationPath(44, 0, 0, 0, 5)
      expect(result).toBe("m/44'/0'/0'/0/5")
    })

    it('should format path without index', () => {
      const result = formatDerivationPath(44, 0, 0, 0)
      expect(result).toBe("m/44'/0'/0'/0")
    })
  })

  describe('formatDuration', () => {
    it('should format seconds', () => {
      expect(formatDuration(30)).toBe('30 seconds')
    })

    it('should format minutes', () => {
      expect(formatDuration(90)).toBe('1.5 minutes')
    })

    it('should format hours', () => {
      expect(formatDuration(7200)).toBe('2.0 hours')
    })

    it('should format days', () => {
      expect(formatDuration(86400 * 2)).toBe('2.0 days')
    })

    it('should format years', () => {
      expect(formatDuration(31536000 * 2)).toBe('2.0 years')
    })

    it('should format billion years', () => {
      expect(formatDuration(31536000000 * 2)).toBe('2.0 billion years')
    })
  })

  describe('copyToClipboard', () => {
    it('should copy using modern clipboard API', async () => {
      const mockWriteText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)

      const result = await copyToClipboard('test text')
      
      expect(result).toBe(true)
      expect(mockWriteText).toHaveBeenCalledWith('test text')
      
      mockWriteText.mockRestore()
    })

    it('should handle clipboard API failure', async () => {
      const mockWriteText = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Failed'))

      // Mock document.execCommand for fallback
      const mockExecCommand = vi.fn().mockReturnValue(true)
      document.execCommand = mockExecCommand
      
      const result = await copyToClipboard('test text')
      
      expect(result).toBe(true)
      expect(mockExecCommand).toHaveBeenCalledWith('copy')
      
      mockWriteText.mockRestore()
    })

    it('should return false on complete failure', async () => {
      const mockWriteText = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Failed'))

      // Mock failing execCommand
      const mockExecCommand = vi.fn().mockReturnValue(false)
      document.execCommand = mockExecCommand
      
      const result = await copyToClipboard('test text')
      
      expect(result).toBe(false)
      
      mockWriteText.mockRestore()
    })
  })
})