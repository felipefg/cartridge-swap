import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/app/components/Navbar';
import {Web3OnboardProviderClient} from './utils/web3OnboardProvider';
import { fontPressStart2P } from './utils/font';
import { BalanceProvider } from './components/balanceProvider';

export const metadata: Metadata = {
  title: 'Cartridge Swap',
  description: 'Marketplace of fantasy console games',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en-US">
      <Web3OnboardProviderClient>
        <BalanceProvider>
          <body className={fontPressStart2P.className}>
            <Navbar></Navbar>
            {children}
          </body>
        </BalanceProvider>
      </Web3OnboardProviderClient>
    </html>
  )
}
