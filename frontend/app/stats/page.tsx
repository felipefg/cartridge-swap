"use client"

import { useState, useEffect } from 'react'
import { BalancePayload } from '../backend-libs/wallet/ifaces';
import { balance } from '../backend-libs/wallet/lib';
import { envClient } from "../utils/clientEnv";

export default function Stats() {
  const [protocolBalance, setProtocolBalance] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);

  async function getBalance(address: string) {
    const input: BalancePayload = {address: address}
    const report = await balance(input, {decode:true, cartesiNodeUrl: envClient.CARTESI_NODE_URL});
    if (report.erc20 && report.erc20[envClient.TOKEN_ADDR.toLowerCase()]) {
      return report.erc20[envClient.TOKEN_ADDR.toLowerCase()];
    }
    return 0;
  }

  async function update() {
    setProtocolBalance(await getBalance('0x0000000000000000000000000000000000000000'));
    setTreasuryBalance(await getBalance('0xffffffffffffffffffffffffffffffffffffffff'));
  }

  useEffect(() => {
    update();
  });

  return (
    <main className="flex items-center justify-center">
      <section className="second-section">
        <div className="p-2">
            <div className="text-gray-400">Protocol Balance</div>
            <div className="text-blue-700">
                <span>${(protocolBalance / 1000000).toFixed(2)}</span>
            </div>
        </div>

        <div className="p-2">
            <div className="text-gray-400">Treasury Balance</div>
            <div className="text-blue-700">
                <span>${(treasuryBalance / 1000000).toFixed(2)}</span>
            </div>
        </div>
      </section>
    </main>
  )
}
