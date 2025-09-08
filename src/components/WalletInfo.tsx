import React, { useState } from 'react'
import { Copy, Eye, EyeOff } from 'lucide-react'
import { Card, CardHeader, CardBody, Button } from './ui'
import { useWalletStore } from '@/stores/wallet'
import { formatMiddleEllipsis, copyToClipboard } from '@/utils/format'
import { QRModal } from './QRModal'

export function WalletInfo() {
  const { wallet, preferences } = useWalletStore()
  const [showSensitive, setShowSensitive] = useState(!preferences.privacyScreen)
  const [qrData, setQrData] = useState<{ data: string; title: string } | null>(null)

  if (!wallet) {
    return null
  }

  const handleCopy = async (text: string) => {
    await copyToClipboard(text)
  }

  const handleShowQR = (data: string, title: string) => {
    setQrData({ data, title })
  }

  const InfoRow = ({ 
    label, 
    value, 
    sensitive = false,
    showQR = false 
  }: { 
    label: string
    value: string
    sensitive?: boolean
    showQR?: boolean
  }) => (
    <div className="space-y-2">
      <label className="form-label">{label}</label>
      <div className="flex items-center space-x-2">
        <div 
          className={`flex-1 p-3 bg-gray-50 rounded-md font-mono text-sm break-all ${
            sensitive && (preferences.privacyScreen || !showSensitive) ? 'privacy-blur' : ''
          }`}
        >
          {sensitive && !showSensitive ? 
            '•'.repeat(Math.min(value.length, 64)) : 
            formatMiddleEllipsis(value, 16, 16)
          }
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCopy(value)}
          title="Copy to clipboard"
        >
          <Copy className="w-4 h-4" />
        </Button>
        {showQR && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShowQR(value, label)}
            title="Show QR code"
          >
            QR
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Wallet Information</h2>
              <p className="text-sm text-gray-600">
                Derived keys and seed information for {wallet.network.name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSensitive(!showSensitive)}
            >
              {showSensitive ? (
                <EyeOff className="w-4 h-4 mr-1" />
              ) : (
                <Eye className="w-4 h-4 mr-1" />
              )}
              {showSensitive ? 'Hide' : 'Show'} Sensitive Data
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <InfoRow 
            label="BIP39 Seed (512-bit)" 
            value={wallet.seed} 
            sensitive={true}
            showQR={true}
          />
          
          <InfoRow 
            label="BIP32 Root Key" 
            value={wallet.rootKey} 
            sensitive={true}
            showQR={true}
          />
          
          <InfoRow 
            label="BIP32 Extended Private Key" 
            value={wallet.extendedPrivateKey} 
            sensitive={true}
            showQR={true}
          />
          
          <InfoRow 
            label="BIP32 Extended Public Key" 
            value={wallet.extendedPublicKey} 
            showQR={true}
          />
        </CardBody>
      </Card>

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