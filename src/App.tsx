import React from 'react'
import { Header } from './components/Header'
import { MnemonicGenerator } from './components/MnemonicGenerator'
import { WalletInfo } from './components/WalletInfo'
import { DerivationPath } from './components/DerivationPath'
import { AddressList } from './components/AddressList'
import { Alert } from './components/ui'
import { useWalletStore } from './stores/wallet'

export default function App() {
  const { wallet, ui } = useWalletStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Mnemonic Code Converter
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A secure tool for generating and converting BIP39 mnemonic phrases to cryptocurrency 
              addresses and private keys. Supports Bitcoin, Ethereum, and 200+ other cryptocurrencies.
            </p>
          </div>

          {/* Security Warnings */}
          <div className="max-w-4xl mx-auto space-y-4">
            <Alert variant="error">
              <div>
                <strong>SECURITY WARNING:</strong> This tool handles sensitive cryptographic material. 
                Never share your mnemonic phrase, seed, or private keys with anyone. 
                <strong> They can steal all your cryptocurrency.</strong>
              </div>
            </Alert>
            
            <Alert variant="warning">
              <div>
                <strong>OFFLINE USE RECOMMENDED:</strong> For maximum security, download this tool 
                and run it offline on an air-gapped computer when generating keys for significant 
                amounts of cryptocurrency.
              </div>
            </Alert>
          </div>

          {/* Mnemonic Generation */}
          <div className="max-w-4xl mx-auto">
            <MnemonicGenerator />
          </div>

          {/* Wallet Information - Only show if wallet exists */}
          {wallet && (
            <>
              <div className="max-w-4xl mx-auto">
                <WalletInfo />
              </div>

              <div className="max-w-6xl mx-auto">
                <DerivationPath />
              </div>

              <div className="max-w-7xl mx-auto">
                <AddressList />
              </div>
            </>
          )}

          {/* Error Display */}
          {ui.error && (
            <div className="max-w-4xl mx-auto">
              <Alert variant="error">
                {ui.error}
                <button
                  onClick={() => useWalletStore.getState().setError(null)}
                  className="ml-2 underline"
                >
                  Dismiss
                </button>
              </Alert>
            </div>
          )}

          {/* Footer Information */}
          <footer className="max-w-4xl mx-auto border-t border-gray-200 pt-8 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About BIP39</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>BIP39</strong> defines a standard for mnemonic code for generating 
                    deterministic keys. Read more at the{' '}
                    <a 
                      href="https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      official BIP39 spec
                    </a>
                    .
                  </p>
                  <p>
                    <strong>BIP32</strong> enables Hierarchical Deterministic Wallets. 
                    See the{' '}
                    <a 
                      href="https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      BIP32 spec
                    </a>
                    {' '}and demo at{' '}
                    <a 
                      href="http://bip32.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      bip32.org
                    </a>
                    .
                  </p>
                  <p>
                    <strong>BIP44</strong> defines Multi-Account Hierarchy for Deterministic 
                    Wallets. Read the{' '}
                    <a 
                      href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      BIP44 spec
                    </a>
                    .
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Notes</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Entropy:</strong> This tool uses cryptographically secure random 
                    number generation when available in your browser. You can also provide 
                    your own entropy from dice, coins, or other random sources.
                  </p>
                  <p>
                    <strong>Storage:</strong> Store your mnemonic phrase securely. Consider 
                    writing it down on paper and storing it in a safe place. Never store 
                    it digitally on internet-connected devices.
                  </p>
                  <p>
                    <strong>Open Source:</strong> This tool is 100% open source. View the 
                    code on{' '}
                    <a 
                      href="https://github.com/iancoleman/bip39" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      GitHub
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>
                BIP39 Mnemonic Code Converter - Built with modern web technologies
              </p>
              <p className="mt-1">
                Original tool by Ian Coleman - Modernized with TypeScript, React, and Vite
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}