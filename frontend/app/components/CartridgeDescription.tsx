"use client"


import { useContext } from 'react';
import { selectedCartridgeContext } from '../cartridges/selectedCartridgeProvider';
import { fontPressStart2P } from '../utils/font';


import { ContractReceipt, ethers } from "ethers";
import { useConnectWallet } from "@web3-onboard/react";
import { BuyCartridgePayload} from '../backend-libs/app/ifaces';
import { buyCartridge } from '../backend-libs/app/lib';
import { envClient } from "../utils/clientEnv";
import { balanceContext } from '../components/balanceProvider';

function CartridgeDescription() {
    const [{ wallet }, connect] = useConnectWallet();
    const {selectedCartridge, updateCartridge} = useContext(selectedCartridgeContext);
    const {walletBalance, updateWalletBalance} = useContext(balanceContext);

    if (!selectedCartridge) {
        return <></>;
    }

    async function buy() {
        try {
            const signer = new ethers.providers.Web3Provider(wallet.provider, 'any').getSigner();
            const payload: BuyCartridgePayload = {id: "0x"+selectedCartridge.id};
            const receipt = await buyCartridge(signer, envClient.DAPP_ADDR, payload, {sync:false, cartesiNodeUrl: envClient.CARTESI_NODE_URL}) as ContractReceipt;
            if (receipt == undefined || receipt.events == undefined)
                throw new Error("Couldn't send transaction");
            await updateWalletBalance();
            await updateCartridge();
        } catch (error) {
            await alert(error.message);
        }
    }

    async function sell() {
        try {
            const signer = new ethers.providers.Web3Provider(wallet.provider, 'any').getSigner();
            // const payload: SellCartridgePayload = {id: "0x"+selectedCartridge.id};
            // const receipt = await sellCartridge(signer, envClient.DAPP_ADDR, inputData, {sync:false, cartesiNodeUrl: envClient.CARTESI_NODE_URL}) as ContractReceipt;
            if (receipt == undefined || receipt.events == undefined)
                throw new Error("Couldn't send transaction");
            await updateWalletBalance();
            await updateCartridge();
        } catch (error) {
            await alert(error.message);
        }
    }

    return (
        <div className='p-2 pt-0 text-xs overflow-auto custom-scrollbar max-h-96'>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 mb-2">Owned</span>

            <h2 className='text-lg text-gray-700 pt-2'>Summary</h2>
            <span>{selectedCartridge.info?.summary}</span>

            <div className="grid grid-cols-2">
                <div>
                    <h2 className='text-lg text-gray-700 mt-4'>Buy Price</h2>
                    <pre className={fontPressStart2P.className}>
                        <span className="text-lg text-blue-700">${(selectedCartridge.buy_price / 1000000).toFixed(2)}</span>
                        <button disabled={!wallet} className="btn w-1/3 ml-1" onClick={buy}>
                            BUY
                        </button>
                    </pre>
                </div>

                <div>
                    <h2 className='text-lg text-gray-700 mt-4'>Sell Price</h2>
                    <pre className={fontPressStart2P.className}>
                        <span className="text-lg text-blue-700">${(selectedCartridge.sell_price / 1000000).toFixed(2)}</span>
                        <button disabled={!wallet} className="btn w-1/3 ml-1" onClick={sell}>
                            SELL
                        </button>
                    </pre>
                </div>

                <div>
                    <h2 className='text-md text-gray-700 mt-4'>Initial Supply</h2>
                    <pre className={fontPressStart2P.className}>
                        {selectedCartridge.initial_supply}
                    </pre>
                </div>

                <div>
                    <h2 className='text-md text-gray-700 mt-4'>Total Supply</h2>
                    <pre className={fontPressStart2P.className}>
                        {selectedCartridge.total_supply}
                    </pre>
                </div>
            </div>

            <h2 className='text-lg text-gray-700 mt-4'>Description</h2>
            <pre className={fontPressStart2P.className} style={{whiteSpace: "pre-wrap"}}>
                {selectedCartridge.info?.description}
            </pre>
        </div>
    )
}

export default CartridgeDescription;