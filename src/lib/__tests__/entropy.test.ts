import { describe, it, expect, beforeEach } from 'vitest'
import { EntropyProcessor } from '../entropy'

describe('EntropyProcessor', () => {
  let processor: EntropyProcessor

  beforeEach(() => {
    processor = new EntropyProcessor()
  })

  describe('analyzeEntropy', () => {
    it('should detect binary entropy', () => {
      const result = processor.analyzeEntropy('101010')
      
      expect(result.type).toBe('binary')
      expect(result.binary).toBe('101010')
      expect(result.bits).toBe(6)
      expect(result.eventCount).toBe(6)
    })

    it('should detect hexadecimal entropy', () => {
      const result = processor.analyzeEntropy('1a2b3c4d')
      
      expect(result.type).toBe('hexadecimal')
      expect(result.bits).toBe(32)
      expect(result.eventCount).toBe(8)
    })

    it('should detect dice entropy', () => {
      const result = processor.analyzeEntropy('123456')
      
      expect(result.type).toBe('dice')
      expect(result.eventCount).toBe(6)
    })

    it('should detect base6 entropy', () => {
      const result = processor.analyzeEntropy('012345')
      
      expect(result.type).toBe('base6')
      expect(result.eventCount).toBe(6)
    })

    it('should detect decimal entropy', () => {
      const result = processor.analyzeEntropy('0123456789')
      
      expect(result.type).toBe('decimal')
      expect(result.eventCount).toBe(10)
    })

    it('should detect card entropy', () => {
      const result = processor.analyzeEntropy('acjs2h')
      
      expect(result.type).toBe('cards')
      expect(result.eventCount).toBe(3) // 3 cards (2 chars each)
    })

    it('should filter invalid characters', () => {
      const result = processor.analyzeEntropy('101xyz010')
      
      expect(result.type).toBe('binary')
      expect(result.filtered).toBe('101010')
      expect(result.binary).toBe('101010')
    })

    it('should calculate strength and crack time', () => {
      const result = processor.analyzeEntropy('11111111') // 8 bits
      
      expect(result.strength).toBe(256) // 2^8
      expect(result.crackTime).toBeDefined()
    })

    it('should handle empty input', () => {
      const result = processor.analyzeEntropy('')
      
      expect(result.bits).toBe(0)
      expect(result.eventCount).toBe(0)
    })

    it('should handle whitespace', () => {
      const result = processor.analyzeEntropy(' 1 0 1 0 ')
      
      expect(result.type).toBe('binary')
      expect(result.filtered).toBe('1010')
      expect(result.binary).toBe('1010')
    })
  })

  describe('generateEntropyFromDice', () => {
    it('should convert dice rolls to string', () => {
      const rolls = [1, 2, 3, 4, 5, 6]
      const result = processor.generateEntropyFromDice(rolls)
      
      expect(result).toBe('123456')
    })

    it('should handle empty rolls', () => {
      const result = processor.generateEntropyFromDice([])
      
      expect(result).toBe('')
    })
  })

  describe('generateEntropyFromCoins', () => {
    it('should convert coin flips to binary', () => {
      const flips = [true, false, true, false]
      const result = processor.generateEntropyFromCoins(flips)
      
      expect(result).toBe('1010')
    })

    it('should handle empty flips', () => {
      const result = processor.generateEntropyFromCoins([])
      
      expect(result).toBe('')
    })
  })
})