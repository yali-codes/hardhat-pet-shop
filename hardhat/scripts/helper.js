const fs = require('fs')
const path = require('path')

/**
 * save contract's artifact and address in the app directory
 * @param {string} contractName smart contract name
 * @param {object} param1 { address -> a address of the deployed contract, named -> the name of json file in the `apps/[app-folder]/src/contracts` }
 * @returns Promise.resolve()
 */
function saveAppFiles(contractName, { address, named }) {
  const contractsDir = path.join(__dirname, '..', '..', 'apps/pet-shop/src/contracts')

  // if there is no `contractsDir` directory and create the `contractsDir` directory with fs
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  if (address) {
    // define `contracts-address.json` filepath
    const contractsAddressPath = path.join(contractsDir, 'contracts-address.json')

    // if there is no `contractsAddressPath` filepath and create the `contractsAddressPath` filepath with fs
    if (!fs.existsSync(contractsAddressPath)) {
      fs.writeFileSync(contractsAddressPath, JSON.stringify({}, null, 2))
    }

    // read `contracts-address.json` contents
    const contractsAddress = JSON.parse(fs.readFileSync(contractsAddressPath, { encoding: 'utf-8' }))
    contractsAddress[contractName] = address
    fs.writeFileSync(contractsAddressPath, JSON.stringify(contractsAddress, null, 2))
  }

  // get contract's artifact from artifacts.readArtifactSync(contractName)
  const contractArtifact = artifacts.readArtifactSync(contractName)
  fs.writeFileSync(path.join(contractsDir, `${named || contractName}.json`), JSON.stringify(contractArtifact, null, 2))
  return Promise.resolve()
}

module.exports = { fs, path, saveAppFiles }
