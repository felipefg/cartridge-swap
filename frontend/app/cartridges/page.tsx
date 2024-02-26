// import Title from "../components/Title";
import CartridgesList from "../components/CartridgesList";
import CartridgeInfo from "../components/CartridgeInfo";
import Rivemu from "../components/Rivemu";
import { Suspense } from "react";



function listLoaderFallback() {
	const arr = Array.from(Array(10).keys());
	return (
		<ul className="animate-pulse space-y-2">
            {
                arr.map((num, index) => {
                    return (
						<li key={index} className="flex">
							<button className="game-list-fallback-animation">
								<div></div>
							</button>
						</li>
					);
                })
            }
        </ul>
	)
}

export default async function Cartridges() {
    return (
      <main>
		<section id="cartridges-section" className="second-section p-4">
			<CartridgeInfo />
			<Suspense fallback={listLoaderFallback()}>
				<CartridgesList />
			</Suspense>
		</section>

		<Rivemu />
      </main>
    )
  }
