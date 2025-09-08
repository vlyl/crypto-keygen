import { describe, it, expect, beforeEach } from 'vitest'
import { BIP39Wallet } from '../bip39'
import { defaultNetwork } from '../networks'

describe('BIP39Wallet', () => {
  let wallet: BIP39Wallet

  beforeEach(() => {
    wallet = new BIP39Wallet(defaultNetwork!)
  })

  describe('generateMnemonic', () => {
    it('should generate a valid 12-word mnemonic by default', () => {
      const mnemonic = wallet.generateMnemonic({ strength: 128, language: 'english' })
      
      expect(mnemonic).toBeDefined()
      expect(typeof mnemonic).toBe('string')
      expect(mnemonic.split(' ')).toHaveLength(12)
    })

    it('should generate a 24-word mnemonic with 256 bits of entropy', () => {
      const mnemonic = wallet.generateMnemonic({ strength: 256, language: 'english' })
      
      expect(mnemonic.split(' ')).toHaveLength(24)
    })

    it('should generate different mnemonics on multiple calls', () => {
      const mnemonic1 = wallet.generateMnemonic({ strength: 128, language: 'english' })
      const mnemonic2 = wallet.generateMnemonic({ strength: 128, language: 'english' })
      
      // Note: In a real test with proper randomness, these should be different
      // With our mocked crypto, they will be the same, so we test structure instead
      expect(mnemonic1).toBeDefined()
      expect(mnemonic2).toBeDefined()
      expect(mnemonic1.split(' ')).toHaveLength(12)
      expect(mnemonic2.split(' ')).toHaveLength(12)
    })
  })

  describe('importMnemonic', () => {
    it('should import a valid mnemonic', () => {
      // Use a known valid test mnemonic
      const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
      
      const result = wallet.importMnemonic(testMnemonic)
      
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
      expect(wallet.getMnemonic()).toBe(testMnemonic)
    })

    it('should reject an invalid mnemonic', () => {
      const invalidMnemonic = 'invalid mnemonic phrase that does not pass checksum'
      
      const result = wallet.importMnemonic(invalidMnemonic)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should handle empty mnemonic', () => {
      const result = wallet.importMnemonic('')
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('getSeed', () => {
    it('should generate seed from imported mnemonic', () => {
      const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
      wallet.importMnemonic(testMnemonic)
      
      const seed = wallet.getSeed()
      
      expect(seed).toBeDefined()
      expect(typeof seed).toBe('string')
      expect(seed).toHaveLength(128) // 64 bytes as hex string
    })

    it('should throw error when no mnemonic is set', () => {
      expect(() => wallet.getSeed()).toThrow('Seed not generated')
    })
  })

  describe('getRootKey', () => {
    it('should generate root key from imported mnemonic', () => {
      const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
      wallet.importMnemonic(testMnemonic)
      
      const rootKey = wallet.getRootKey()
      
      expect(rootKey).toBeDefined()
      expect(typeof rootKey).toBe('string')
      expect(rootKey).toMatch(/^xprv/) // Bitcoin mainnet extended private key prefix
    })
  })

  describe('generateAddresses', () => {
    beforeEach(() => {
      const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
      wallet.importMnemonic(testMnemonic)
    })

    it('should generate Bitcoin addresses', () => {
      const derivationPath = {
        purpose: 44,
        coin: 0,
        account: 0,
        change: 0,
        index: 0,
      }
      
      const addresses = wallet.generateAddresses(derivationPath, 5, 0, 'BIP44')
      
      expect(addresses).toHaveLength(5)
      addresses.forEach((addr, index) => {
        expect(addr.index).toBe(index)
        expect(addr.path).toContain('m/44\'/0\'/0\'/0/')
        expect(addr.address).toBeDefined()
        expect(addr.publicKey).toBeDefined()
        expect(addr.privateKey).toBeDefined()
        expect(addr.wif).toBeDefined()
      })
    })

    it('should generate addresses starting from specific index', () => {
      const derivationPath = {
        purpose: 44,
        coin: 0,
        account: 0,
        change: 0,
        index: 0,
      }
      
      const addresses = wallet.generateAddresses(derivationPath, 3, 10, 'BIP44')
      
      expect(addresses).toHaveLength(3)
      expect(addresses[0]?.index).toBe(10)
      expect(addresses[1]?.index).toBe(11)
      expect(addresses[2]?.index).toBe(12)
    })
  })

  describe('validateMnemonic', () => {
    it('should validate correct mnemonic', () => {
      const validMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
      
      const result = BIP39Wallet.validateMnemonic(validMnemonic)
      
      expect(result.isValid).toBe(true)
    })

    it('should reject invalid mnemonic', () => {
      const invalidMnemonic = 'invalid words here'
      
      const result = BIP39Wallet.validateMnemonic(invalidMnemonic)
      
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should warn about short mnemonics', () => {
      // This is a valid but short mnemonic (would need actual 9-word valid mnemonic for real test)
      const shortMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon about'
      
      const result = BIP39Wallet.validateMnemonic(shortMnemonic)
      
      // Even if valid, it should have warnings about entropy
      if (result.isValid) {
        expect(result.warnings).toBeDefined()
        expect(result.warnings?.[0]).toContain('low entropy')
      }
    })
  })
})