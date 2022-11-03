import '@openzeppelin/hardhat-upgrades'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'
import type { HardhatUserConfig } from 'hardhat/config'
import './tasks'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: {
      url: process.env.RPC_URL,
      accounts: [<string>process.env.PRIVATE_KEY],
      // gas: 80000000, // delete it when contract upgrading
    },
  },
}

export default config
