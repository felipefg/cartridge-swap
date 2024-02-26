"use client"

import React, { useContext, useEffect } from 'react'
import { selectedCartridgeContext } from '../cartridges/selectedCartridgeProvider';
import { CartridgeInfo as Cartridge } from "../backend-libs/app/ifaces"
import { cartridgeInfo } from '../backend-libs/app/lib';
import { envClient } from '../utils/clientEnv';
import { fontPressStart2P } from '../utils/font';
import Image from 'next/image';

function CartridgeSelectButton({cartridge, index}:{cartridge:Cartridge, index:number}) {
    const {selectedCartridge, changeCartridge} = useContext(selectedCartridgeContext);

    useEffect(() => {
        // const initialSelection = async () => {
        //    await handleCartridgeSelection({} as React.MouseEvent<HTMLElement>);
        // }
        // if (index == 0 && !selectedCartridge) initialSelection();
    })

    const handleCartridgeSelection = async (e:React.MouseEvent<HTMLElement>) => {

        const cartridgeWithInfo = await cartridgeInfo({id:cartridge.id},{decode:true, cartesiNodeUrl: envClient.CARTESI_NODE_URL,cache:"force-cache"});

		changeCartridge(cartridgeWithInfo);
	}

    return (
        <button hidden={!!selectedCartridge} className={
            selectedCartridge?.id==cartridge.id?
                `games-list-item games-list-selected-item`
            :
                `games-list-item`
            } value={cartridge.id} onClick={handleCartridgeSelection}>

            <Image width={256} height={192}
                style={{objectFit: "contain", background: "black", width: "256px", height: "192px", imageRendering: "pixelated"}}
                src={cartridge.cover? `data:image/png;base64,${cartridge.cover}`:"/logo.png"}/>
            <div className="flex items-center mt-1">
                <div className="w-2/3 text-sm text-left">{cartridge.name}</div>
                <div className="w-1/3 text-xs text-right text-blue-800">$20.00</div>
            </div>
        </button>
    )
}

export default CartridgeSelectButton