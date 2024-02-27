"use client"


import { useContext } from 'react';
import { selectedCartridgeContext } from '../cartridges/selectedCartridgeProvider';
import { fontPressStart2P } from '../utils/font';

function CartridgeDescription() {
    const {selectedCartridge} = useContext(selectedCartridgeContext);

    if (!selectedCartridge) {
        return <></>;
    }

    return (
        <div className='p-2 pt-0 text-xs overflow-auto custom-scrollbar'>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 mb-2">Owned</span>

            <h2 className='text-lg text-gray-700 pt-2'>Summary</h2>
            <span>{selectedCartridge.info?.summary}</span>

            <div className="grid grid-cols-2">
                <div>
                    <h2 className='text-lg text-gray-700 mt-4'>Buy Price</h2>
                    <pre className={fontPressStart2P.className}>
                        <span className="text-lg text-blue-700">${(selectedCartridge.buy_price / 1000000).toFixed(2)}</span>
                        <button className="btn w-1/3 ml-1">
                            BUY
                        </button>
                    </pre>
                </div>

                <div>
                    <h2 className='text-lg text-gray-700 mt-4'>Sell Price</h2>
                    <pre className={fontPressStart2P.className}>
                        <span className="text-lg text-blue-700">${(selectedCartridge.sell_price / 1000000).toFixed(2)}</span>
                        <button className="btn w-1/3 ml-1">
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