import React from 'react'
import { Shield, Settings, Github, AlertTriangle } from 'lucide-react'
import { Button } from './ui'
import { useWalletStore } from '@/stores/wallet'
import { getSupportedNetworks } from '@/lib/networks'

export function Header() {
  const { wallet, preferences, setNetwork, updatePreferences } = useWalletStore()
  const networks = getSupportedNetworks()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                BIP39 Mnemonic Tool
              </h1>
              <p className="text-xs text-gray-500">
                Secure cryptocurrency key generator
              </p>
            </div>
          </div>

          {/* Network Selector */}
          {wallet && (
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">
                  Network:
                </label>
                <select
                  value={wallet.network.symbol}
                  onChange={(e) => {
                    const network = networks.find(n => n.symbol === e.target.value)
                    if (network) setNetwork(network)
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {networks.map((network) => (
                    <option key={network.symbol} value={network.symbol}>
                      {network.name} ({network.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Privacy Screen Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updatePreferences({ privacyScreen: !preferences.privacyScreen })}
              title={preferences.privacyScreen ? 'Show sensitive data' : 'Hide sensitive data'}
              className={preferences.privacyScreen ? 'text-orange-600' : ''}
            >
              <AlertTriangle className="w-4 h-4" />
            </Button>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>

            {/* GitHub Link */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://github.com/iancoleman/bip39', '_blank')}
              title="View source code"
            >
              <Github className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}