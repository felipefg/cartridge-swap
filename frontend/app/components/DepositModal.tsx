"use client"

import { useState } from 'react'

function DepositModal({onClose}:{onClose():void}) {
    const [amount, setAmount] = useState('');
    return (<div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-30 outline-none focus:outline-none"
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
                                <div >
                                    <legend>
                                        Amount
                                    </legend>
                                    <input type="text" value={amount} onChange={e => setAmount(e.target.value)} />
                                </div>
                            </fieldset>
                            <div className="flex items-center justify-end pb-2 pr-6">
                                <button
                                className={`bg-red-500 text-white font-bold uppercase text-sm px-6 py-2 border border-red-500 hover:text-red-500 hover:bg-transparent`}
                                type="button"
                                onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                className={`bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-2 ml-1 border border-emerald-500 hover:text-emerald-500 hover:bg-transparent`}
                                type="button"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
}

export default DepositModal;
