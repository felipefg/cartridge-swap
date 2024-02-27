"use client"

import { ContractReceipt, ethers } from "ethers";
import React, { useContext, useEffect, useState} from 'react'
import UploadIcon from "@mui/icons-material/Upload";
import { RadioGroup } from '@headlessui/react'
import CheckIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import { useConnectWallet } from "@web3-onboard/react";
import { InsertCartridgePayload } from '../backend-libs/app/ifaces';
import { insertCartridge } from '../backend-libs/app/lib';
import { envClient } from "../utils/clientEnv";
import { balanceContext } from '../components/balanceProvider';

export default function InsertCartridge() {
  let [cartridgeData, setCartridgeData] = useState(null);
  let [cartridgeName, setCartridgeName] = useState(null);
  let [basePrice, setBasePrice] = useState(10);
  let [initialSupply, setInitialSupply] = useState(100);
  let [curve, setCurve] = useState("standard");
  const [{ wallet }, connect] = useConnectWallet();
  const {walletBalance, updateWalletBalance} = useContext(balanceContext);

  function onCartridgeData(name: string, data: Uint8Array) {
    setCartridgeData(data);
    setCartridgeName(name);
  }

  function onFileChange(e:React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length == 0) {
        return;
    }

    let file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = async (readerEvent) => {
        let data: ArrayBuffer;
        if (readerEvent.target?.result instanceof ArrayBuffer) {
            data = readerEvent.target?.result;
        } else {
            data = {} as ArrayBuffer;
        }
        if (data) {
            onCartridgeData(file.name, new Uint8Array(data));
        }
    };

    reader.readAsArrayBuffer(file);
  }

  async function uploadCartridge() {
    if (!wallet) {
        await alert("Connect first to upload a cartridge.");
        await connect();
        return;
    }
    if (!cartridgeData) {
        await alert("Choose a cartridge file first.");
        return;
    }

    try {
      let smoothingFactor = 1280;
      let exponent = 1700;
      if (curve == "flatter") {
        smoothingFactor = 670;
        exponent = 1500;
      } else if (curve == "steeper") {
        smoothingFactor = 5000;
        exponent = 2000;

      }

      const signer = new ethers.providers.Web3Provider(wallet.provider, 'any').getSigner();
      const inputData: InsertCartridgePayload = {
          base_price: basePrice * 1000000,
          initial_supply: initialSupply * 1,
          smoothing_factor: smoothingFactor,
          exponent: exponent,
          data: ethers.utils.hexlify(cartridgeData)
      }
      const receipt = await insertCartridge(signer, envClient.DAPP_ADDR, inputData, {sync:false, cartesiNodeUrl: envClient.CARTESI_NODE_URL}) as ContractReceipt;
      if (receipt == undefined || receipt.events == undefined)
          throw new Error("Couldn't send transaction");
    } catch (error) {
        await alert(error.message);
    }
    await updateWalletBalance();
    window.location = '/cartridges';
  }

  return (
    <main className="flex items-center justify-center">
      <section className="second-section">
        <div className="flex flex-col items-center text-white mt-4">
          <div className="w-full max-w-xd">
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Cartridge File
                </label>
              </div>
              <div className="md:w-2/3">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon/>
                    { cartridgeData ?
                      <p className="text-xs text-gray-500 dark:text-gray-400">{cartridgeName}<br/>{cartridgeData.length / 1024} KB</p>
                      :
                      <>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click </span> or drop file</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">.SQFS</p>
                      </>
                    }
                  </div>
                  <input type="file" className="hidden" onChange={onFileChange}/>
                </label>
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Base Price
                </label>
              </div>
              <div className="md:w-2/3">
                <input type="number" id="number-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  block w-full p-2.5" required
                  value={basePrice}
                  onChange={e => setBasePrice(e.target.value)}/>

              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Initial Supply
                </label>
              </div>
              <div className="md:w-2/3">
                <input type="number" id="number-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  block w-full p-2.5" required
                  value={initialSupply}
                  onChange={e => setInitialSupply(e.target.value)}/>
              </div>
            </div>

            <RadioGroup value={curve} onChange={setCurve} className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <RadioGroup.Label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">Extra Supply Bonding Curve</RadioGroup.Label>
              </div>
              <div className="relative">
                <RadioGroup.Option value="standard">
                  {({ checked }) => (
                    <div className="flex items-center mb-4">
                      { checked ? <CheckIcon className="mr-2" /> : <CircleIcon className="mr-2" /> }
                      <span className={checked ? 'text-blue-500' : ''}>Standard</span>
                    </div>
                  )}
                </RadioGroup.Option>
                <RadioGroup.Option value="flatter">
                  {({ checked }) => (
                    <div className="flex items-center mb-4">
                      { checked ? <CheckIcon className="mr-2" /> : <CircleIcon className="mr-2" /> }
                      <span className={checked ? 'text-blue-500' : ''}>Flatter</span>
                    </div>
                  )}
                </RadioGroup.Option>
                <RadioGroup.Option value="steeper">
                  {({ checked }) => (
                    <div className="flex items-center mb-4">
                      { checked ? <CheckIcon className="mr-2" /> : <CircleIcon className="mr-2" /> }
                      <span className={checked ? 'text-blue-500' : ''}>Steeper</span>
                    </div>
                  )}
                </RadioGroup.Option>
              </div>
            </RadioGroup>

{/*
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Cost to Store
                </label>
              </div>
              <div className="md:w-2/3">
                <div className="appearance-none border-2 border-blue-500 w-full py-2 px-4 text-blue-400">$100</div>
              </div>
            </div>
            */}
          </div>

          <button className="btn w-48" onClick={uploadCartridge}>
            Upload Cartridge
          </button>
        </div>
      </section>
    </main>
  )
}
