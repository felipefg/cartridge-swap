"use client"

import React, { useContext, useEffect, useState } from 'react'
import UploadIcon from "@mui/icons-material/Upload";

export default function InsertCartridge() {
  let [cartridgeSize, setCartridgeSize] = useState(null);
  let [cartridgeName, setCartridgeName] = useState(null);
  const onCartridgeData = function(name: string, data: Uint8Array) {
    setCartridgeSize(data.length / 1024);
    setCartridgeName(name);
  }
  const onFileChange = function(e:React.ChangeEvent<HTMLInputElement>) {
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
                    { cartridgeSize ?
                      <p className="text-xs text-gray-500 dark:text-gray-400">{cartridgeName}<br/>{cartridgeSize} KB</p>
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
                <input type="number" id="number-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  block w-full p-2.5" placeholder="100.00" required />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Initial Supply
                </label>
              </div>
              <div className="md:w-2/3">
                <input type="number" id="number-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  block w-full p-2.5" placeholder="100" required />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Bonding Curve
                </label>
              </div>
              <div className="relative">
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                  <option>Normal</option>
                  <option>Flatter</option>
                  <option>Steeper</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

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
          </div>

          <button className="btn mt-5 w-48">
            Upload Cartridge
          </button>
        </div>
      </section>
    </main>
  )
}
