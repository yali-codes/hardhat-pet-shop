require('@openzeppelin/hardhat-upgrades')
require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

require('./tasks/faucet.js')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5,
      gas: 80000000,
    },
  },
}
