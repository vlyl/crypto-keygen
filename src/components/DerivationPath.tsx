import React from 'react'
import { Card, CardHeader, CardBody, Tabs, TabsList, TabsTrigger, TabsContent, Input } from './ui'
import { useWalletStore } from '@/stores/wallet'
import { formatDerivationPath } from '@/utils/format'
import type { BipStandard } from '@/types'

export function DerivationPath() {
  const { wallet, ui, setCurrentTab } = useWalletStore()

  if (!wallet) {
    return null
  }

  const { derivationPath, network } = wallet

  const handleTabChange = (value: string) => {
    setCurrentTab(value as BipStandard)
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Derivation Path</h2>
        <p className="text-sm text-gray-600">
          Select the derivation standard and configure the path parameters
        </p>
      </CardHeader>
      <CardBody>
        <Tabs value={ui.currentTab} onValueChange={handleTabChange} defaultValue="BIP44">
          <TabsList>
            <TabsTrigger value="BIP32">BIP32</TabsTrigger>
            <TabsTrigger value="BIP44">BIP44</TabsTrigger>
            <TabsTrigger value="BIP49">BIP49</TabsTrigger>
            <TabsTrigger value="BIP84">BIP84</TabsTrigger>
            <TabsTrigger value="BIP141">BIP141</TabsTrigger>
          </TabsList>

          <TabsContent value="BIP32">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                BIP32 allows for custom derivation paths. For more info see the{' '}
                <a 
                  href="https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  BIP32 spec
                </a>
                .
              </p>
              
              <Input
                label="BIP32 Derivation Path"
                value={`m/${derivationPath.account}/${derivationPath.change}`}
                readOnly
                className="font-mono"
              />

              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Bitcoin Core:</strong> Use path m/0'/0' with hardened addresses</p>
                <p><strong>Block Explorers:</strong> Use path m/44'/0'/0' (only enter xpub, never xprv)</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="BIP44">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                BIP44 defines a logical hierarchy for deterministic wallets. For more info see the{' '}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Purpose"
                  value="44"
                  readOnly
                  helperText="Fixed value for BIP44"
                />
                
                <Input
                  label="Coin"
                  value={network.bip44.toString()}
                  readOnly
                  helperText={`${network.name} coin type`}
                />
                
                <Input
                  label="Account"
                  value={derivationPath.account.toString()}
                  readOnly
                  helperText="Account index (0-based)"
                />
                
                <Input
                  label="Change"
                  value={derivationPath.change.toString()}
                  readOnly
                  helperText="0 = external, 1 = internal"
                />
              </div>

              <Input
                label="BIP32 Derivation Path"
                value={formatDerivationPath(44, network.bip44, derivationPath.account, derivationPath.change)}
                readOnly
                className="font-mono"
              />

              <div className="text-xs text-gray-500">
                <p>The account extended keys can be used for importing to most BIP44 compatible wallets.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="BIP49">
            <div className="space-y-4">
              {!('segwitP2SH' in network && network.segwitP2SH) ? (
                <div className="text-yellow-600 text-sm">
                  BIP49 is not available for {network.name}.
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    BIP49 defines derivation scheme for P2WPKH-nested-in-P2SH based accounts. For more info see the{' '}
                    <a 
                      href="https://github.com/bitcoin/bips/blob/master/bip-0049.mediawiki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      BIP49 spec
                    </a>
                    .
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Purpose"
                      value="49"
                      readOnly
                      helperText="Fixed value for BIP49"
                    />
                    
                    <Input
                      label="Coin"
                      value={network.bip44.toString()}
                      readOnly
                      helperText={`${network.name} coin type`}
                    />
                    
                    <Input
                      label="Account"
                      value={derivationPath.account.toString()}
                      readOnly
                      helperText="Account index (0-based)"
                    />
                    
                    <Input
                      label="Change"
                      value={derivationPath.change.toString()}
                      readOnly
                      helperText="0 = external, 1 = internal"
                    />
                  </div>

                  <Input
                    label="BIP32 Derivation Path"
                    value={formatDerivationPath(49, network.bip44, derivationPath.account, derivationPath.change)}
                    readOnly
                    className="font-mono"
                  />
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="BIP84">
            <div className="space-y-4">
              {!('segwitAvailable' in network && network.segwitAvailable) ? (
                <div className="text-yellow-600 text-sm">
                  BIP84 is not available for {network.name}.
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    BIP84 defines derivation scheme for P2WPKH based accounts. For more info see the{' '}
                    <a 
                      href="https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      BIP84 spec
                    </a>
                    .
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Purpose"
                      value="84"
                      readOnly
                      helperText="Fixed value for BIP84"
                    />
                    
                    <Input
                      label="Coin"
                      value={network.bip44.toString()}
                      readOnly
                      helperText={`${network.name} coin type`}
                    />
                    
                    <Input
                      label="Account"
                      value={derivationPath.account.toString()}
                      readOnly
                      helperText="Account index (0-based)"
                    />
                    
                    <Input
                      label="Change"
                      value={derivationPath.change.toString()}
                      readOnly
                      helperText="0 = external, 1 = internal"
                    />
                  </div>

                  <Input
                    label="BIP32 Derivation Path"
                    value={formatDerivationPath(84, network.bip44, derivationPath.account, derivationPath.change)}
                    readOnly
                    className="font-mono"
                  />
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="BIP141">
            <div className="space-y-4">
              {!('segwitAvailable' in network && network.segwitAvailable) ? (
                <div className="text-yellow-600 text-sm">
                  BIP141 is not available for {network.name}.
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    BIP141 defines segregated witness for Bitcoin. For more info see the{' '}
                    <a 
                      href="https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      BIP141 spec
                    </a>
                    .
                  </p>

                  <Input
                    label="BIP32 Derivation Path"
                    value={`m/${derivationPath.account}`}
                    readOnly
                    className="font-mono"
                  />

                  <div>
                    <label className="form-label">Script Semantics</label>
                    <select className="form-input">
                      <option value="p2wpkh">P2WPKH</option>
                      <option value="p2wpkh-p2sh" selected>P2WPKH nested in P2SH</option>
                      <option value="p2wsh">P2WSH (1-of-1 multisig)</option>
                      <option value="p2wsh-p2sh">P2WSH nested in P2SH (1-of-1 multisig)</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardBody>
    </Card>
  )
}