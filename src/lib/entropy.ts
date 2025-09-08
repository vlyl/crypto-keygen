import type { EntropyAnalysis, EntropyType } from '@/types'

interface EntropyEvent {
  [key: string]: number
}

// Entropy detection and processing based on the original implementation
export class EntropyProcessor {
  private readonly eventBits: Record<EntropyType, EntropyEvent> = {
    binary: { '0': 1, '1': 1 },
    base6: { '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1 },
    dice: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1 },
    decimal: {
      '0': 1, '1': 1, '2': 1, '3': 1, '4': 1,
      '5': 1, '6': 1, '7': 1, '8': 1, '9': 1
    },
    hexadecimal: {
      '0': 1, '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1,
      '8': 1, '9': 1, 'a': 1, 'b': 1, 'c': 1, 'd': 1, 'e': 1, 'f': 1
    },
    cards: {} // Will be populated in constructor
  }

  constructor() {
    // Initialize card entropy
    const suits = ['c', 'd', 'h', 's']
    const ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k']
    
    for (const rank of ranks) {
      for (const suit of suits) {
        this.eventBits.cards[rank + suit] = 1
      }
    }
  }

  analyzeEntropy(input: string): EntropyAnalysis {
    const cleaned = this.cleanInput(input)
    const detectedType = this.detectEntropyType(cleaned)
    const filtered = this.filterByType(cleaned, detectedType)
    const binary = this.convertToBinary(filtered, detectedType)
    
    const bits = binary.length
    const eventCount = this.getEventCount(filtered, detectedType)
    const strength = this.calculateStrength(bits)
    const crackTime = this.estimateCrackTime(strength)
    const wordCount = Math.floor(bits / 11) // BIP39 uses 11 bits per word

    return {
      type: detectedType,
      bits,
      strength,
      filtered,
      binary,
      wordCount,
      eventCount,
      crackTime,
    }
  }

  private cleanInput(input: string): string {
    return input.toLowerCase().replace(/\s/g, '')
  }

  private detectEntropyType(input: string): EntropyType {
    // Auto-detect entropy type based on characters present
    const binaryRegex = /^[01]+$/
    const base6Regex = /^[0-5]+$/
    const diceRegex = /^[1-6]+$/
    const decimalRegex = /^[0-9]+$/
    const hexRegex = /^[0-9a-f]+$/
    const cardRegex = /^[a2-9tjqk][cdhs]+$/

    if (binaryRegex.test(input)) return 'binary'
    if (base6Regex.test(input)) return 'base6'
    if (diceRegex.test(input)) return 'dice'
    if (cardRegex.test(input)) return 'cards'
    if (decimalRegex.test(input)) return 'decimal'
    if (hexRegex.test(input)) return 'hexadecimal'

    // Default to hexadecimal for mixed content
    return 'hexadecimal'
  }

  private filterByType(input: string, type: EntropyType): string {
    const validChars = Object.keys(this.eventBits[type])
    return input.split('').filter(char => validChars.includes(char)).join('')
  }

  private convertToBinary(input: string, type: EntropyType): string {
    switch (type) {
      case 'binary':
        return input
      case 'base6':
        return input.split('').map(char => 
          parseInt(char, 6).toString(2).padStart(3, '0')
        ).join('')
      case 'dice':
        return input.split('').map(char => 
          (parseInt(char) - 1).toString(2).padStart(3, '0')
        ).join('')
      case 'decimal':
        return input.split('').map(char => 
          parseInt(char).toString(2).padStart(4, '0')
        ).join('')
      case 'hexadecimal':
        return input.split('').map(char => 
          parseInt(char, 16).toString(2).padStart(4, '0')
        ).join('')
      case 'cards':
        return this.convertCardsToBinary(input)
      default:
        return ''
    }
  }

  private convertCardsToBinary(cards: string): string {
    const suits = ['c', 'd', 'h', 's']
    const ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', 't', 'j', 'q', 'k']
    
    let binary = ''
    for (let i = 0; i < cards.length; i += 2) {
      const rank = cards[i]
      const suit = cards[i + 1]
      
      const rankIndex = ranks.indexOf(rank?.toUpperCase() || '')
      const suitIndex = suits.indexOf(suit?.toUpperCase() || '')
      
      if (rankIndex >= 0 && suitIndex >= 0) {
        const cardValue = rankIndex * 4 + suitIndex
        binary += cardValue.toString(2).padStart(6, '0')
      }
    }
    
    return binary
  }

  private getEventCount(input: string, type: EntropyType): number {
    if (type === 'cards') {
      return Math.floor(input.length / 2)
    }
    return input.length
  }

  private calculateStrength(bits: number): number {
    // Simple entropy strength calculation
    return Math.pow(2, bits)
  }

  private estimateCrackTime(strength: number): string {
    const secondsPerAttempt = 1e-9 // Very optimistic attack rate
    const averageAttempts = strength / 2
    const seconds = averageAttempts * secondsPerAttempt

    if (seconds < 60) return `${seconds.toFixed(0)} seconds`
    if (seconds < 3600) return `${(seconds / 60).toFixed(0)} minutes`
    if (seconds < 86400) return `${(seconds / 3600).toFixed(0)} hours`
    if (seconds < 31536000) return `${(seconds / 86400).toFixed(0)} days`
    return `${(seconds / 31536000).toFixed(0)} years`
  }

  generateEntropyFromDice(rolls: number[]): string {
    return rolls.map(roll => roll.toString()).join('')
  }

  generateEntropyFromCoins(flips: boolean[]): string {
    return flips.map(flip => flip ? '1' : '0').join('')
  }
}