import * as bip39 from 'bip39'
import * as bip32 from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'
import type { 
  MnemonicConfig, 
  DerivationPath, 
  AddressInfo, 
  NetworkConfig, 
  ValidationResult,
  Bip85Config,
  BipStandard
} from '@/types'
import { sha256 } from '@noble/hashes/sha256'

// Initialize crypto libraries with secp256k1 implementation
bitcoin.initEccLib(ecc)
const BIP32 = bip32.BIP32Factory(ecc)

export class BIP39Wallet {
  private mnemonic: string = ''
  private seed: Buffer | null = null
  private rootKey: bip32.BIP32Interface | null = null
  private network: NetworkConfig
  private passphrase: string = ''

  constructor(network: NetworkConfig) {
    this.network = network
  }

  /**
   * Generate a new mnemonic with specified configuration
   */
  generateMnemonic(config: MnemonicConfig = { strength: 256, language: 'english' }): string {
    try {
      let entropy: Buffer

      if (config.entropy) {
        // Use provided entropy
        const binaryEntropy = config.entropy
        const bytes = Math.ceil(binaryEntropy.length / 8)
        entropy = Buffer.alloc(bytes)
        
        for (let i = 0; i < binaryEntropy.length; i += 8) {
          const byte = binaryEntropy.slice(i, i + 8).padEnd(8, '0')
          entropy[Math.floor(i / 8)] = parseInt(byte, 2)
        }
      } else {
        // Generate random entropy
        const randomBytes = crypto.getRandomValues(new Uint8Array(config.strength / 8))
        entropy = Buffer.from(randomBytes)
      }

      this.mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy), bip39.wordlists[config.language])
      return this.mnemonic
    } catch (error) {
      throw new Error(`Failed to generate mnemonic: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Import an existing mnemonic
   */
  importMnemonic(mnemonic: string, passphrase: string = ''): ValidationResult {
    try {
      const trimmed = mnemonic.trim().toLowerCase()
      
      if (!bip39.validateMnemonic(trimmed)) {
        return {
          isValid: false,
          error: 'Invalid mnemonic phrase. Please check your words and try again.'
        }
      }

      this.mnemonic = trimmed
      this.passphrase = passphrase
      this.generateSeed()

      return { isValid: true }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Generate seed from mnemonic and passphrase
   */
  private generateSeed(): void {
    if (!this.mnemonic) {
      throw new Error('No mnemonic available')
    }

    this.seed = bip39.mnemonicToSeedSync(this.mnemonic, this.passphrase)
    this.rootKey = BIP32.fromSeed(this.seed, this.getBitcoinJSNetwork())
  }

  /**
   * Get the current mnemonic
   */
  getMnemonic(): string {
    return this.mnemonic
  }

  /**
   * Get the seed as hex string
   */
  getSeed(): string {
    if (!this.seed) {
      throw new Error('Seed not generated. Import or generate a mnemonic first.')
    }
    return this.seed.toString('hex')
  }

  /**
   * Get the root key
   */
  getRootKey(): string {
    if (!this.rootKey) {
      throw new Error('Root key not generated. Import or generate a mnemonic first.')
    }
    return this.rootKey.toBase58()
  }

  /**
   * Get extended keys for a specific path
   */
  getExtendedKeys(derivationPath: DerivationPath, standard: BipStandard): {
    privateKey: string
    publicKey: string
  } {
    if (!this.rootKey) {
      throw new Error('Root key not available')
    }

    const path = this.buildDerivationPath(derivationPath, standard)
    const child = this.rootKey.derivePath(path)

    return {
      privateKey: child.toBase58(),
      publicKey: child.neutered().toBase58()
    }
  }

  /**
   * Generate addresses for a derivation path
   */
  generateAddresses(
    derivationPath: DerivationPath, 
    count: number = 20, 
    startIndex: number = 0,
    standard: BipStandard = 'BIP44',
    hardened: boolean = false
  ): AddressInfo[] {
    if (!this.rootKey) {
      throw new Error('Root key not available')
    }

    const addresses: AddressInfo[] = []
    const basePath = this.buildDerivationPath(derivationPath, standard)
    
    for (let i = startIndex; i < startIndex + count; i++) {
      const indexPath = hardened ? `${basePath}/${i}'` : `${basePath}/${i}`
      const child = this.rootKey.derivePath(indexPath)
      
      const address = this.generateAddress(child, standard)
      const privateKey = child.privateKey
      
      if (!privateKey) {
        throw new Error('Failed to derive private key')
      }

      addresses.push({
        path: indexPath,
        address,
        publicKey: child.publicKey.toString('hex'),
        privateKey: privateKey.toString('hex'),
        wif: child.toWIF(),
        index: i
      })
    }

    return addresses
  }

  /**
   * Generate BIP85 child entropy
   */
  generateBip85(config: Bip85Config): string {
    if (!this.rootKey) {
      throw new Error('Root key not available')
    }

    // BIP85 derives child entropy from m/83696968'/app'/index'
    const path = `m/83696968'/${this.getBip85AppNumber(config.application)}'/${config.index}'`
    const child = this.rootKey.derivePath(path)
    
    if (!child.privateKey) {
      throw new Error('Failed to derive BIP85 private key')
    }

    const entropy = sha256(child.privateKey)
    
    switch (config.application) {
      case 'bip39':
        return this.bip85ToBip39(entropy, config.length || 12, config.language || 0)
      case 'wif':
        return this.bip85ToWif(entropy)
      case 'xprv':
        return this.bip85ToXprv(entropy)
      case 'hex':
        return Buffer.from(entropy.slice(0, (config.bytes || 64) / 8)).toString('hex')
      default:
        throw new Error('Unsupported BIP85 application')
    }
  }

  private getBip85AppNumber(app: string): number {
    const appNumbers: Record<string, number> = {
      bip39: 39,
      wif: 2,
      xprv: 32,
      hex: 128169
    }
    return appNumbers[app] || 0
  }

  private bip85ToBip39(entropy: Uint8Array, wordCount: number, language: number): string {
    const entropyBits = wordCount * 11 - wordCount / 3
    const entropyBytes = Math.ceil(entropyBits / 8)
    const truncatedEntropy = entropy.slice(0, entropyBytes)
    
    const wordlist = Object.values(bip39.wordlists)[language] || bip39.wordlists.english
    return bip39.entropyToMnemonic(Buffer.from(truncatedEntropy), wordlist)
  }

  private bip85ToWif(entropy: Uint8Array): string {
    const privateKey = Buffer.from(entropy.slice(0, 32))
    // For WIF generation, we'll use a simpler approach
    // since ECPair is not directly available in bitcoinjs-lib v6
    const wif = bitcoin.crypto.sha256(privateKey).toString('hex')
    return wif // Simplified for now - would need proper WIF encoding
  }

  private bip85ToXprv(entropy: Uint8Array): string {
    const seed = entropy.slice(0, 64)
    const child = BIP32.fromSeed(Buffer.from(seed), this.getBitcoinJSNetwork())
    return child.toBase58()
  }

  /**
   * Build derivation path string based on BIP standard
   */
  private buildDerivationPath(derivationPath: DerivationPath, standard: BipStandard): string {
    const { coin, account, change } = derivationPath
    
    switch (standard) {
      case 'BIP44':
        return `m/44'/${coin}'/${account}'/${change}`
      case 'BIP49':
        return `m/49'/${coin}'/${account}'/${change}`
      case 'BIP84':
        return `m/84'/${coin}'/${account}'/${change}`
      case 'BIP32':
        return `m/${account}/${change}`
      case 'BIP141':
        return `m/${account}`
      default:
        return `m/44'/${coin}'/${account}'/${change}`
    }
  }

  /**
   * Generate address based on BIP standard
   */
  private generateAddress(keyPair: bip32.BIP32Interface, standard: BipStandard): string {
    const network = this.getBitcoinJSNetwork()
    const publicKey = keyPair.publicKey
    
    switch (standard) {
      case 'BIP44':
        return bitcoin.payments.p2pkh({ pubkey: publicKey, network }).address || ''
      case 'BIP49':
        return bitcoin.payments.p2sh({
          redeem: bitcoin.payments.p2wpkh({ pubkey: publicKey, network }),
          network
        }).address || ''
      case 'BIP84':
        return bitcoin.payments.p2wpkh({ pubkey: publicKey, network }).address || ''
      case 'BIP141':
        return bitcoin.payments.p2wpkh({ pubkey: publicKey, network }).address || ''
      default:
        return bitcoin.payments.p2pkh({ pubkey: publicKey, network }).address || ''
    }
  }

  /**
   * Convert our network config to bitcoinjs network format
   */
  private getBitcoinJSNetwork(): bitcoin.networks.Network {
    return {
      messagePrefix: this.network.messagePrefix,
      bech32: this.network.bech32 || '',
      bip32: {
        public: 0x0488b21e, // xpub
        private: 0x0488ade4, // xprv
      },
      pubKeyHash: this.network.pubKeyHash,
      scriptHash: this.network.scriptHash,
      wif: this.network.wif,
    }
  }

  /**
   * Validate a mnemonic phrase
   */
  static validateMnemonic(mnemonic: string): ValidationResult {
    try {
      const trimmed = mnemonic.trim().toLowerCase()
      const isValid = bip39.validateMnemonic(trimmed)
      
      if (!isValid) {
        return {
          isValid: false,
          error: 'Invalid mnemonic phrase. Please check your words.'
        }
      }

      const wordCount = trimmed.split(' ').length
      const warnings: string[] = []
      
      if (wordCount < 12) {
        warnings.push('Mnemonics with less than 12 words have low entropy and may be guessed by an attacker.')
      }

      return {
        isValid: true,
        warnings: warnings.length > 0 ? warnings : undefined
      }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown validation error'
      }
    }
  }
}