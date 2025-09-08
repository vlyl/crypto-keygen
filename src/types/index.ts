import type {
  WalletState,
  BipStandard,
} from './crypto'

export type {
  NetworkConfig,
  DerivationPath,
  AddressInfo,
  MnemonicConfig,
  Bip85Config,
  WalletState,
  EntropyType,
  BipStandard,
  EntropyAnalysis,
  CoinConfig,
  ValidationResult,
  QRCodeOptions,
} from './crypto'

export interface AppState {
  wallet: WalletState | null
  preferences: UserPreferences
  ui: UIState
}

export interface UserPreferences {
  showPrivateKeys: boolean
  showPublicKeys: boolean
  showAddresses: boolean
  showIndexes: boolean
  hardened: boolean
  bip38Enabled: boolean
  bip38Password: string
  addressCount: number
  autoCompute: boolean
  privacyScreen: boolean
}

export interface UIState {
  loading: boolean
  error: string | null
  currentTab: BipStandard
  showEntropy: boolean
  showBip85: boolean
  showSplitMnemonic: boolean
}