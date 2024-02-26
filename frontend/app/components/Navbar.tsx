'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from 'react'
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import DepositModal from "../components/DepositModal";
import logo from '../../public/logo64px.png';

function Navbar() {
    const pathname = usePathname();
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const [{ chains, connectedChain }, setChain] = useSetChain();
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [connectButtonTxt, setConnectButtonTxt] = useState("Connect");

    const openDepositModal = () => {
        setShowDepositModal(true);
    }

    const closeDepositModal = () => {
        setShowDepositModal(false);
    }

    useEffect(() => {
        if (!connectedChain) return;

        chains.forEach((chain) => {
            if (connectedChain.id == chain.id) return;
        })

        setChain({chainId: chains[0].id});

      }, [connectedChain])


    useEffect(() => {
        if (connecting) {
            setConnectButtonTxt('Connecting');
        } else if (wallet) {
            setConnectButtonTxt('Disconnect');
        } else {
            setConnectButtonTxt('Connect');
        }
    }, [connecting, wallet])

    return (
        <header className='header'>
            <Link href={"/"} className={`h-full grid grid-cols-1 items-center`}>
                <Image src={logo} alt='Cartridge Swap logo'/>
            </Link>

            <Link href={"/cartridges"} className={`invisible md:visible h-full grid grid-cols-1 items-center navbar-item ${pathname === "/cartridges" ? "link-active" : "" }`}>
                Cartridges
            </Link>

            <Link href={"/insert-cartridge"} className={`invisible md:visible h-full grid grid-cols-1 items-center navbar-item ${pathname === "/insert-cartridge" ? "link-active" : "" }`}>
                Upload Cartridge
            </Link>

            <div className='flex-1 flex justify-end'>
                <div className='p-2'>
                    <div>Balance</div>
                    <div className="text-blue-700">
                        <span>$20.00</span>
                    </div>
                </div>
                { showDepositModal && <DepositModal onClose={closeDepositModal}/>}
                <button className="btn btn-deposit" onClick={openDepositModal}>Deposit</button>
                <button className='navbar-item' disabled={connecting}
                    onClick={() => (wallet ? disconnect(wallet) : connect())}
                >
                    {connectButtonTxt}
                </button>
            </div>
        </header>
    )
}

export default Navbar