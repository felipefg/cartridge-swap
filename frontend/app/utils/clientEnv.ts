import { str, envsafe, url } from 'envsafe';


export const envClient = envsafe({
  DAPP_ADDR: str({
    input: process.env.NEXT_PUBLIC_DAPP_ADDR,
    desc: "Cartesi DApp ETH address."
  }),
  TOKEN_ADDR: str({
    input: process.env.NEXT_PUBLIC_TOKEN_ADDR,
    desc: "Cartesi DApp ERC20 Token address."
  }),
  CARTESI_NODE_URL: url({
    input: process.env.NEXT_PUBLIC_CARTESI_NODE_URL,
    desc: "Cartesi Node URL."
  }),
  NETWORK_CHAIN_ID: str({
    input: process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID,
    desc: "Network ChainId (in hex) where the Cartesi DApp was deployed."
  }),
  NFT_ADDR: str({
    input: process.env.NEXT_PUBLIC_NFT_ADDR,
    desc: "Rives Score NFT ETH address."
  })
})