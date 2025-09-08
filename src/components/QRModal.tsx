import React, { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'
import { Button, Alert } from './ui'
import { qrCodeGenerator } from '@/lib/qr'
import { downloadAsFile } from '@/utils/format'

interface QRModalProps {
  data: string
  title: string
  onClose: () => void
}

export function QRModal({ data, title, onClose }: QRModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const generateQR = async () => {
      try {
        const validation = qrCodeGenerator.validateTextLength(data)
        if (!validation.isValid) {
          setError(validation.error || 'Invalid data for QR code')
          return
        }

        const dataUrl = await qrCodeGenerator.generateDataURL(data, {
          width: 300,
          margin: 2,
        })
        setQrDataUrl(dataUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate QR code')
      }
    }

    generateQR()
  }, [data])

  const handleDownload = async () => {
    try {
      const svg = await qrCodeGenerator.generateSVG(data, { width: 512 })
      downloadAsFile(svg, `${title.toLowerCase().replace(/\s+/g, '_')}_qr.svg`, 'image/svg+xml')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download QR code')
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full max-h-full overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : qrDataUrl ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="qr-code">
                  <img
                    src={qrDataUrl}
                    alt={`QR code for ${title}`}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Scan this QR code to copy the data
                </p>
                
                <div className="flex justify-center space-x-2">
                  <Button variant="secondary" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" />
                    Download SVG
                  </Button>
                  <Button variant="secondary" size="sm" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-500 break-all font-mono">
                {data}
              </div>

              <Alert variant="warning">
                <div className="text-sm">
                  <strong>Warning:</strong> QR code scanners may keep a history of scanned codes. 
                  Only scan with trusted devices and applications.
                </div>
              </Alert>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <div className="loading-spinner w-8 h-8" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}