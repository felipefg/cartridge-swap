"use client"

import React, { useState, useContext } from 'react'
import { balanceContext } from './balanceProvider';
import { useConnectWallet } from "@web3-onboard/react";

function DepositModal() {
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [amount, setAmount] = useState(10);
    const [{ wallet }] = useConnectWallet();
    const {walletBalance, updateWalletBalance, depositWalletBalance} = useContext(balanceContext);

    const openDepositModal = () => {
        setShowDepositModal(true);
    }

    const closeDepositModal = () => {
        setShowDepositModal(false);
    }

    async function deposit() {
        await depositWalletBalance(amount * 1000000);
        closeDepositModal();
    }

    if (wallet) {
        updateWalletBalance();
    }

    return (<>
        { (wallet && walletBalance >= 0) && <>
                <div className="p-2">
                    <div>Balance</div>
                    <div className="text-blue-700">
                        <span>${(walletBalance / 1000000).toFixed(2)}</span>
                    </div>
                </div>
                <button className="btn btn-deposit" onClick={openDepositModal}>Deposit</button>
            </>
        }
        { showDepositModal &&
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-30 outline-none focus:outline-none"
            >
                <div className="relative w-max my-6 mx-auto">
                    {/*content*/}
                    <div className="border-0 shadow-lg relative flex flex-col w-full bg-gray-500 outline-none focus:outline-none p-4">
                        {/*header*/}
                        <div className='relative p-2 text-center'>
                             <span>Deposit</span>
                        </div>
                        {/*body*/}
                        <div>
                            <fieldset className={`relative my-6 px-6 flex-auto h-full`}>
                                <div>
                                    <legend>
                                        Amount
                                    </legend>
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                                </div>
                            </fieldset>
                            <div className="flex items-center justify-end pb-2 pr-6">
                                <button
                                className={`bg-red-500 text-white font-bold uppercase text-sm px-6 py-2 border border-red-500 hover:text-red-500 hover:bg-transparent`}
                                type="button"
                                onClick={closeDepositModal}
                                >
                                    Cancel
                                </button>
                                <button
                                className={`bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-2 ml-1 border border-emerald-500 hover:text-emerald-500 hover:bg-transparent`}
                                type="button"
                                onClick={deposit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default DepositModal;
