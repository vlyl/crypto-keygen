export interface NetworkConfig {
  name: string
  symbol: string
  bip44: number
  pubKeyHash: number
  scriptHash: number
  wif: number
  bech32?: string
  messagePrefix: string
}

export interface DerivationPath {
  purpose: number
  coin: number
  account: number
  change: number
  index: number
}

export interface AddressInfo {
  path: string
  address: string
  publicKey: string
  privateKey: string
  wif: string
  index: number
}

export interface MnemonicConfig {
  strength: number // 128, 160, 192, 224, 256
  language: string
  passphrase?: string
  entropy?: string
  entropyType?: EntropyType
}

export interface Bip85Config {
  application: 'bip39' | 'wif' | 'xprv' | 'hex'
  index: number
  language?: number
  length?: number
  bytes?: number
}

export interface WalletState {
  mnemonic: string
  seed: string
  rootKey: string
  extendedPrivateKey: string
  extendedPublicKey: string
  network: NetworkConfig
  derivationPath: DerivationPath
  addresses: AddressInfo[]
}

export type EntropyType = 
  | 'binary' 
  | 'base6' 
  | 'dice' 
  | 'decimal' 
  | 'hexadecimal' 
  | 'cards'

export type BipStandard = 'BIP32' | 'BIP44' | 'BIP49' | 'BIP84' | 'BIP141'

export interface EntropyAnalysis {
  type: EntropyType
  bits: number
  strength: number
  filtered: string
  binary: string
  wordCount: number
  eventCount: number
  crackTime: string
}

export interface CoinConfig extends NetworkConfig {
  segwitAvailable: boolean
  segwitP2SH: boolean
  baseSymbol?: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  warnings?: string[]
}

export interface QRCodeOptions {
  width: number
  margin: number
  color: {
    dark: string
    light: string
  }
}