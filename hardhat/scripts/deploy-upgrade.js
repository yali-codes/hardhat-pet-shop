const fs = require('fs')
const path = require('path')

// save contract's artifact and address in the app directory
function saveAppFiles(contractName, address) {
  const contractsDir = path.join(__dirname, '..', '..', 'apps/pet-shop/src/contracts')

  // if there is no `contractsDir` directory, which creates the `contractsDir directory with fs
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  // get contract artifact from artifacts.readArtifactSync(contractName)
  const contractArtifact = artifacts.readArtifactSync(contractName)
  contractArtifact.address = address
  fs.writeFileSync(path.join(contractsDir, `${contractName}.json`), JSON.stringify(contractArtifact, null, 2))

  return Promise.resolve()
}

async function main() {
  // deploy PetShop Contract
  const PetShopV2Contract = await ethers.getContractFactory('PetShopV2')
  const petShopV2 = await upgrades.upgradeProxy(0xa3abbda93a850758f85598a47cf186c0bca085ac, PetShopV2Contract)
  await saveAppFiles('PetShop', petShop.address)
  console.log('PetShop was upgrated to ', petShopV2.address)
}

// excute contract deployment
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
