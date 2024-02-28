// import Title from "../components/Title";
import CartridgesList from "../components/CartridgesList";
import CartridgeInfo from "../components/CartridgeInfo";
import Rivemu from "../components/Rivemu";

export default async function Cartridges() {
    return (
      <main>
		<section id="cartridges-section" className="second-section p-4">
			<CartridgeInfo />
			<CartridgesList />
		</section>

		<Rivemu />
      </main>
    )
  }
