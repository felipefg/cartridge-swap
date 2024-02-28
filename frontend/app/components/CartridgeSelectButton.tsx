"use client"

import React, { useContext, useEffect } from 'react'
import { selectedCartridgeContext } from '../cartridges/selectedCartridgeProvider';
import { CartridgeInfo as Cartridge } from "../backend-libs/app/ifaces"
import { cartridgeInfo } from '../backend-libs/app/lib';
import { envClient } from '../utils/clientEnv';
import { fontPressStart2P } from '../utils/font';
import { useConnectWallet } from "@web3-onboard/react";
import Image from 'next/image';

function CartridgeSelectButton({cartridge, index, updateCartridges}:{cartridge:Cartridge, index:number}) {
    const {selectedCartridge, changeCartridge} = useContext(selectedCartridgeContext);
    const [{ wallet }] = useConnectWallet();

    useEffect(() => {
        // const initialSelection = async () => {
        //    await handleCartridgeSelection({} as React.MouseEvent<HTMLElement>);
        // }
        // if (index == 0 && !selectedCartridge) initialSelection();
    })

    const handleCartridgeSelection = async (e:React.MouseEvent<HTMLElement>) => {
        let wallet_addr = wallet ? wallet.accounts[0].address.toLowerCase() : undefined;
        const cartridgeWithInfo = await cartridgeInfo({id:cartridge.id, owner:wallet_addr},{decode:true, cartesiNodeUrl: envClient.CARTESI_NODE_URL,cache:"no-cache"});
		changeCartridge(cartridgeWithInfo);
	}

    return (
        <button hidden={!!selectedCartridge} className={
            selectedCartridge?.id==cartridge.id?
                `games-list-item games-list-selected-item`
            :
                `games-list-item`
            } value={cartridge.id} onClick={handleCartridgeSelection}>

            <div className="relative">
                <Image width={0} height={0}
                alt="Cartridge Screenshot"
                style={{objectFit: "contain", background: "black", width: "256px", height: "192px", imageRendering: "pixelated"}}
                src={cartridge.cover? `data:image/png;base64,${cartridge.cover}`:"/logo.png"}/>
                {cartridge.owned_copies > 0 &&
                    <div className="absolute bottom-0 end-0 bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 mb-2">Owned</div>}
            </div>
            <div className="flex items-center mt-1">
                <div className="w-2/3 text-sm text-left">{cartridge.name}</div>
                <div className="w-1/3 text-xs text-right text-blue-800">${(cartridge.buy_price / 1000000).toFixed(2)}</div>
            </div>
        </button>
    )
}

export default CartridgeSelectButton
