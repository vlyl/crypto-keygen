import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { 
  WalletState, 
  UserPreferences, 
  UIState, 
  NetworkConfig,
  BipStandard,
  MnemonicConfig,
  Bip85Config
} from '@/types'
import { BIP39Wallet } from '@/lib/bip39'
import { EntropyProcessor } from '@/lib/entropy'
import { defaultNetwork } from '@/lib/networks'

interface AppStore {
  wallet: WalletState | null
  preferences: UserPreferences
  ui: UIState
  entropyProcessor: EntropyProcessor
  
  // Actions
  setNetwork: (network: NetworkConfig) => void
  generateMnemonic: (config?: MnemonicConfig) => Promise<void>
  importMnemonic: (mnemonic: string, passphrase?: string) => Promise<void>
  generateAddresses: (count?: number, startIndex?: number) => Promise<void>
  generateBip85: (config: Bip85Config) => Promise<string>
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  updateUI: (ui: Partial<UIState>) => void
  setCurrentTab: (tab: BipStandard) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  clearWallet: () => void
}

const initialPreferences: UserPreferences = {
  showPrivateKeys: true,
  showPublicKeys: true,
  showAddresses: true,
  showIndexes: true,
  hardened: false,
  bip38Enabled: false,
  bip38Password: '',
  addressCount: 20,
  autoCompute: true,
  privacyScreen: false,
}

const initialUI: UIState = {
  loading: false,
  error: null,
  currentTab: 'BIP44',
  showEntropy: false,
  showBip85: false,
  showSplitMnemonic: false,
}

export const useWalletStore = create<AppStore>()(
  persist(
    (set, get) => ({
      wallet: null,
      preferences: initialPreferences,
      ui: initialUI,
      entropyProcessor: new EntropyProcessor(),

      setNetwork: (network) => {
        const { wallet } = get()
        if (wallet) {
          set({
            wallet: {
              ...wallet,
              network: network as NetworkConfig,
            },
          })
        }
      },

      generateMnemonic: async (config) => {
        set({ ui: { ...get().ui, loading: true, error: null } })
        
        try {
          const { wallet } = get()
          const network = wallet?.network || defaultNetwork
          
          const bip39Wallet = new BIP39Wallet(network as NetworkConfig)
          const mnemonic = bip39Wallet.generateMnemonic(config)
          
          // Generate seed and keys
          await bip39Wallet.importMnemonic(mnemonic, config?.passphrase || '')
          
          const seed = bip39Wallet.getSeed()
          const rootKey = bip39Wallet.getRootKey()
          
          const derivationPath = {
            purpose: 44,
            coin: (network as NetworkConfig).bip44,
            account: 0,
            change: 0,
            index: 0,
          }
          
          const extendedKeys = bip39Wallet.getExtendedKeys(derivationPath, 'BIP44')
          
          set({
            wallet: {
              mnemonic,
              seed,
              rootKey,
              extendedPrivateKey: extendedKeys.privateKey,
              extendedPublicKey: extendedKeys.publicKey,
              network: network as NetworkConfig,
              derivationPath,
              addresses: [],
            },
            ui: { ...get().ui, loading: false },
          })

          // Auto-generate addresses if enabled
          if (get().preferences.autoCompute) {
            await get().generateAddresses()
          }
        } catch (error) {
          set({
            ui: {
              ...get().ui,
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to generate mnemonic',
            },
          })
        }
      },

      importMnemonic: async (mnemonic, passphrase = '') => {
        set({ ui: { ...get().ui, loading: true, error: null } })
        
        try {
          const { wallet } = get()
          const network = wallet?.network || defaultNetwork
          
          const bip39Wallet = new BIP39Wallet(network as NetworkConfig)
          const result = bip39Wallet.importMnemonic(mnemonic, passphrase)
          
          if (!result.isValid) {
            throw new Error(result.error || 'Invalid mnemonic')
          }
          
          const seed = bip39Wallet.getSeed()
          const rootKey = bip39Wallet.getRootKey()
          
          const derivationPath = {
            purpose: 44,
            coin: (network as NetworkConfig).bip44,
            account: 0,
            change: 0,
            index: 0,
          }
          
          const extendedKeys = bip39Wallet.getExtendedKeys(derivationPath, 'BIP44')
          
          set({
            wallet: {
              mnemonic,
              seed,
              rootKey,
              extendedPrivateKey: extendedKeys.privateKey,
              extendedPublicKey: extendedKeys.publicKey,
              network: network as NetworkConfig,
              derivationPath,
              addresses: [],
            },
            ui: { ...get().ui, loading: false },
          })

          // Show warnings if any
          if (result.warnings && result.warnings.length > 0) {
            console.warn('Mnemonic warnings:', result.warnings)
          }

          // Auto-generate addresses if enabled
          if (get().preferences.autoCompute) {
            await get().generateAddresses()
          }
        } catch (error) {
          set({
            ui: {
              ...get().ui,
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to import mnemonic',
            },
          })
        }
      },

      generateAddresses: async (count, startIndex = 0) => {
        const { wallet, preferences, ui } = get()
        if (!wallet) return

        set({ ui: { ...ui, loading: true } })

        try {
          const bip39Wallet = new BIP39Wallet(wallet.network)
          await bip39Wallet.importMnemonic(wallet.mnemonic)
          
          const addressCount = count || preferences.addressCount
          const addresses = bip39Wallet.generateAddresses(
            wallet.derivationPath,
            addressCount,
            startIndex,
            ui.currentTab,
            preferences.hardened
          )

          set({
            wallet: {
              ...wallet,
              addresses: startIndex === 0 ? addresses : [...wallet.addresses, ...addresses],
            },
            ui: { ...ui, loading: false },
          })
        } catch (error) {
          set({
            ui: {
              ...ui,
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to generate addresses',
            },
          })
        }
      },

      generateBip85: async (config) => {
        const { wallet } = get()
        if (!wallet) {
          throw new Error('No wallet available')
        }

        const bip39Wallet = new BIP39Wallet(wallet.network)
        await bip39Wallet.importMnemonic(wallet.mnemonic)
        
        return bip39Wallet.generateBip85(config)
      },

      updatePreferences: (newPreferences) => {
        set({
          preferences: {
            ...get().preferences,
            ...newPreferences,
          },
        })
      },

      updateUI: (newUI) => {
        set({
          ui: {
            ...get().ui,
            ...newUI,
          },
        })
      },

      setCurrentTab: (tab) => {
        set({
          ui: {
            ...get().ui,
            currentTab: tab,
          },
        })
        
        // Regenerate addresses with new derivation standard
        if (get().preferences.autoCompute) {
          get().generateAddresses()
        }
      },

      setError: (error) => {
        set({
          ui: {
            ...get().ui,
            error,
          },
        })
      },

      setLoading: (loading) => {
        set({
          ui: {
            ...get().ui,
            loading,
          },
        })
      },

      clearWallet: () => {
        set({
          wallet: null,
          ui: initialUI,
        })
      },
    }),
    {
      name: 'bip39-wallet-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        // Don't persist wallet data for security
      }),
    }
  )
)