import React, { useState } from 'react'
import { Copy, Eye, EyeOff, Download, Plus } from 'lucide-react'
import { Button, Card, CardHeader, CardBody, Alert } from './ui'
import { useWalletStore } from '@/stores/wallet'
import { formatAddress, formatPrivateKey, formatPublicKey, copyToClipboard, downloadAsFile } from '@/utils/format'
import { QRModal } from './QRModal'
import type { AddressInfo } from '@/types'

export function AddressList() {
  const { wallet, preferences, ui, generateAddresses } = useWalletStore()
  const [showPrivateKeys, setShowPrivateKeys] = useState(!preferences.privacyScreen)
  const [qrData, setQrData] = useState<{ data: string; title: string } | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!wallet || !wallet.addresses.length) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <p className="text-gray-500">No addresses generated yet. Generate a mnemonic first.</p>
        </CardBody>
      </Card>
    )
  }

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const handleShowQR = (data: string, title: string) => {
    setQrData({ data, title })
  }

  const handleLoadMore = async () => {
    const startIndex = wallet.addresses.length
    await generateAddresses(preferences.addressCount, startIndex)
  }

  const handleExportCSV = () => {
    const headers = ['Index', 'Path', 'Address', 'Public Key', 'Private Key', 'WIF']
    const rows = wallet.addresses.map(addr => [
      addr.index.toString(),
      addr.path,
      addr.address,
      addr.publicKey,
      addr.privateKey,
      addr.wif
    ])
    
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    
    downloadAsFile(csv, 'addresses.csv', 'text/csv')
  }

  const columnVisibility = {
    index: preferences.showIndexes,
    address: preferences.showAddresses,
    publicKey: preferences.showPublicKeys,
    privateKey: preferences.showPrivateKeys && showPrivateKeys,
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Derived Addresses</h2>
              <p className="text-sm text-gray-600">
                Addresses derived from your BIP32 extended key using {ui.currentTab}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrivateKeys(!showPrivateKeys)}
              >
                {showPrivateKeys ? (
                  <EyeOff className="w-4 h-4 mr-1" />
                ) : (
                  <Eye className="w-4 h-4 mr-1" />
                )}
                {showPrivateKeys ? 'Hide' : 'Show'} Private Keys
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-1" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Column Toggle Controls */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={columnVisibility.index}
                onChange={(e) => useWalletStore.getState().updatePreferences({ showIndexes: e.target.checked })}
                className="mr-2"
              />
              Show Index
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={columnVisibility.address}
                onChange={(e) => useWalletStore.getState().updatePreferences({ showAddresses: e.target.checked })}
                className="mr-2"
              />
              Show Addresses
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={columnVisibility.publicKey}
                onChange={(e) => useWalletStore.getState().updatePreferences({ showPublicKeys: e.target.checked })}
                className="mr-2"
              />
              Show Public Keys
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.showPrivateKeys}
                onChange={(e) => useWalletStore.getState().updatePreferences({ showPrivateKeys: e.target.checked })}
                className="mr-2"
              />
              Show Private Keys
            </label>
          </div>
        </CardBody>
      </Card>

      {/* Address Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  {columnVisibility.index && (
                    <th>
                      <button className="text-left">Path</button>
                    </th>
                  )}
                  {columnVisibility.address && (
                    <th>
                      <button className="text-left">Address</button>
                    </th>
                  )}
                  {columnVisibility.publicKey && (
                    <th>
                      <button className="text-left">Public Key</button>
                    </th>
                  )}
                  {columnVisibility.privateKey && (
                    <th>
                      <button className="text-left">Private Key</button>
                    </th>
                  )}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wallet.addresses.map((address: AddressInfo) => (
                  <tr key={address.index}>
                    {columnVisibility.index && (
                      <td className="font-mono text-sm">{address.path}</td>
                    )}
                    {columnVisibility.address && (
                      <td>
                        <div 
                          className={`font-mono text-sm ${preferences.privacyScreen ? 'privacy-blur' : ''}`}
                          title={address.address}
                        >
                          {formatAddress(address.address)}
                        </div>
                      </td>
                    )}
                    {columnVisibility.publicKey && (
                      <td>
                        <div 
                          className={`font-mono text-sm ${preferences.privacyScreen ? 'privacy-blur' : ''}`}
                          title={address.publicKey}
                        >
                          {formatPublicKey(address.publicKey)}
                        </div>
                      </td>
                    )}
                    {columnVisibility.privateKey && (
                      <td>
                        <div 
                          className={`font-mono text-sm ${preferences.privacyScreen ? 'privacy-blur' : ''}`}
                          title={address.privateKey}
                        >
                          {formatPrivateKey(address.privateKey)}
                        </div>
                      </td>
                    )}
                    <td>
                      <div className="flex items-center space-x-1">
                        {columnVisibility.address && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(address.address, `address-${address.index}`)}
                              title="Copy address"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShowQR(address.address, `Address ${address.index}`)}
                              title="Show QR code"
                            >
                              QR
                            </Button>
                          </>
                        )}
                        {columnVisibility.privateKey && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(address.privateKey, `private-${address.index}`)}
                            title="Copy private key"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Load More Addresses */}
      <div className="flex justify-center">
        <Button
          onClick={handleLoadMore}
          loading={ui.loading}
          variant="secondary"
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Load {preferences.addressCount} More Addresses
        </Button>
      </div>

      {copiedField && (
        <Alert variant="success">
          Successfully copied to clipboard!
        </Alert>
      )}

      {qrData && (
        <QRModal
          data={qrData.data}
          title={qrData.title}
          onClose={() => setQrData(null)}
        />
      )}
    </div>
  )
}