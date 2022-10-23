require("@nomicfoundation/hardhat-toolbox");
require("./tasks/faucet.js");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};
