import type { CoinConfig } from '@/types'

export const networks: Record<string, CoinConfig> = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    bip44: 0,
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    bech32: 'bc',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    segwitAvailable: true,
    segwitP2SH: true,
  },
  bitcoin_testnet: {
    name: 'Bitcoin Testnet',
    symbol: 'tBTC',
    bip44: 1,
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    bech32: 'tb',
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    segwitAvailable: true,
    segwitP2SH: true,
  },
  litecoin: {
    name: 'Litecoin',
    symbol: 'LTC',
    bip44: 2,
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
    bech32: 'ltc',
    messagePrefix: '\x19Litecoin Signed Message:\n',
    segwitAvailable: true,
    segwitP2SH: true,
  },
  dogecoin: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    bip44: 3,
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    segwitAvailable: false,
    segwitP2SH: false,
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    bip44: 60,
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    messagePrefix: '\x19Ethereum Signed Message:\n',
    segwitAvailable: false,
    segwitP2SH: false,
  },
  bitcoin_cash: {
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    bip44: 145,
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    segwitAvailable: false,
    segwitP2SH: false,
    baseSymbol: 'BTC',
  },
  zcash: {
    name: 'Zcash',
    symbol: 'ZEC',
    bip44: 133,
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
    messagePrefix: '\x16Zcash Signed Message:\n',
    segwitAvailable: false,
    segwitP2SH: false,
  },
}

export const defaultNetwork = networks.bitcoin

export function getNetworkBySymbol(symbol: string): CoinConfig | undefined {
  return Object.values(networks).find(
    (network) => network.symbol.toLowerCase() === symbol.toLowerCase()
  )
}

export function getNetworkByBip44(bip44: number): CoinConfig | undefined {
  return Object.values(networks).find((network) => network.bip44 === bip44)
}

export function getSupportedNetworks(): CoinConfig[] {
  return Object.values(networks)
}