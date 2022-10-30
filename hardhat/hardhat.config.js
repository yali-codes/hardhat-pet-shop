require('./tasks/faucet.js')
require('@nomicfoundation/hardhat-toolbox')
require('@openzeppelin/hardhat-upgrades')
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}
