import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { envClient } from './clientEnv'


const chain = {
  id: envClient.NETWORK_CHAIN_ID
}


const chains = [chain]

const wallets = [injectedModule()]

const appMetadata = {
  name: 'Cartridge Swap',
  icon: '<svg>My App Icon</svg>',
  description: 'Cartridge Swap allows users to play and trade fantasy console games',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
  ]
}

// initialize and export Onboard
const web3Onboard = init({
  wallets,
  chains,
  appMetadata,
  connect: {
    autoConnectLastWallet: true
  },
  accountCenter: {desktop: {enabled: false}, mobile: {enabled: false}}
})

export default web3Onboard;