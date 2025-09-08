import QRCode from 'qrcode'
import type { QRCodeOptions } from '@/types'

export class QRCodeGenerator {
  private readonly defaultOptions: QRCodeOptions = {
    width: 256,
    margin: 2,
    color: {
      dark: '#1f2937',
      light: '#ffffff',
    },
  }

  /**
   * Generate QR code as data URL
   */
  async generateDataURL(
    text: string, 
    options: Partial<QRCodeOptions> = {}
  ): Promise<string> {
    const config = { ...this.defaultOptions, ...options }
    
    try {
      return await QRCode.toDataURL(text, {
        width: config.width,
        margin: config.margin,
        color: {
          dark: config.color.dark,
          light: config.color.light,
        },
        errorCorrectionLevel: 'M',
      })
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate QR code as SVG string
   */
  async generateSVG(
    text: string, 
    options: Partial<QRCodeOptions> = {}
  ): Promise<string> {
    const config = { ...this.defaultOptions, ...options }
    
    try {
      return await QRCode.toString(text, {
        type: 'svg',
        width: config.width,
        margin: config.margin,
        color: {
          dark: config.color.dark,
          light: config.color.light,
        },
        errorCorrectionLevel: 'M',
      })
    } catch (error) {
      throw new Error(`Failed to generate QR code SVG: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Validate text length for QR code generation
   */
  validateTextLength(text: string): { isValid: boolean; error?: string } {
    if (text.length === 0) {
      return { isValid: false, error: 'Text cannot be empty' }
    }
    
    if (text.length > 2953) {
      return { 
        isValid: false, 
        error: 'Text too long for QR code (max 2953 characters)' 
      }
    }
    
    return { isValid: true }
  }
}

export const qrCodeGenerator = new QRCodeGenerator()