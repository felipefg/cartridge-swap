import Image from 'next/image'
import logo from '../public/logo.png';


export default function Home() {
  return (
    <main>
      <section id="presentation-section" className="first-section">
        <div className="flex space-x-2">
          <Image src={logo} alt='Cartridge Swap logo'/>
        </div>

        <div className=' max-w-[640px] text-center text-white'>
          <h2 className='mt-6 text-xl'>
            Cartridge Swap
          </h2>

          <p className="mt-6">
            Own cartridges, prove scores & contribute with infinite creativity
          </p>
        </div>

        <div className='w-11/12 my-16 h-1 rainbow-background'></div>

        <a className='mt-10 btn' href={"/cartridges"}>
          Start Playing
        </a>

      </section>
      {/* <section id="statistical-section" className="h-svh">
        placeholder for statistical info retrieved from DApp
      </section> */}
    </main>
  )
}
