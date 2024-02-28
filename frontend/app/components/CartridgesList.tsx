"use client"

import CartridgeSelectButton from './CartridgeSelectButton';
import { useContex, useState } from 'react';
import { cartridges as cartridgerequest} from "../backend-libs/app/lib";
import { envClient } from '../utils/clientEnv';

function CartridgesList() {
    const [cartridges, setCartridges] = useState([]);

    async function updateCartridges() {
        setCartridges((await cartridgerequest({},{decode:true, cartesiNodeUrl: envClient.CARTESI_NODE_URL,cache:"no-cache"})).data);
    }

    if (cartridges.length == 0) {
        updateCartridges();
    }

    return (
        <div
         className="container mx-auto mt-8 mb-8" style={{maxWidth: "768px"}}>
            <div className="grid grid-cols-3 gap-2">
                {
                    cartridges.map((cartridge: any, index: number) => {
                        return (
                            <div key={index}>
                                <CartridgeSelectButton index={index} cartridge={cartridge} />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}


export default CartridgesList