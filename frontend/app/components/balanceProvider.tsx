'use client'

import { ContractReceipt, ethers } from "ethers";
import { createContext, useState } from 'react';
import { useConnectWallet } from "@web3-onboard/react";
import { BalancePayload } from '../backend-libs/app/ifaces';
import { depositErc20, balance } from '../backend-libs/wallet/lib';
import { envClient } from "../utils/clientEnv";

export const balanceContext = createContext<{
    walletBalance: number|null, setWalletBalance:Function, getWalletBalance:Function, updateWalletBalance:Function, depositWalletBalance:Function
}>({walletBalance: null, setWalletBalance: () => null, getWalletBalance: () => null, updateWalletBalance: () => null, depositWalletBalance: () => null});

export function BalanceProvider({ children }:{ children: React.ReactNode }) {
    const [{ wallet }, connect] = useConnectWallet();
    const [walletBalance, setWalletBalance] = useState<number|null>(null);

    async function getWalletBalance() {
        const input: BalancePayload = {address: wallet.accounts[0].address.toLowerCase()}
        const report = await balance(input, {decode:true, cartesiNodeUrl: envClient.CARTESI_NODE_URL});
        if (report.erc20 && report.erc20[envClient.TOKEN_ADDR.toLowerCase()]) {
            return report.erc20[envClient.TOKEN_ADDR.toLowerCase()];
        }
        return 0;
    }

    async function updateWalletBalance() {
        if (!wallet) {
            setWalletBalance(null);
        } else {
            try {
                setWalletBalance(await getWalletBalance());
            } catch (error) {
                await alert(error.message);
            }
        }
    }

    async function depositWalletBalance(amount: number) {
        if (!wallet) {
            await alert("Connect first to upload a gameplay log.");
            await connect();
            return;
        }

        try {
            const signer = new ethers.providers.Web3Provider(wallet.provider, 'any').getSigner();
            await depositErc20(signer, envClient.DAPP_ADDR, envClient.TOKEN_ADDR, Math.floor(amount), {decode:true, cartesiNodeUrl: envClient.CARTESI_NODE_URL});
            await updateWalletBalance();
        } catch (error) {
            await alert(error.message);
        }
    }

    return (
        <balanceContext.Provider value={ {walletBalance, setWalletBalance, getWalletBalance, updateWalletBalance, depositWalletBalance} }>
            { children }
        </balanceContext.Provider>
    );
}
