const fs = require('fs')
const path = require('path')

// save contract's artifact and address in the app directory
function saveAppFiles(contractName, address) {
  console.log(`devie-${contractName}::`, address)
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
  const PetShopContract = await ethers.getContractFactory('PetShop')
  const petShop = await upgrades.deployProxy(PetShopContract, [], { initializer: 'setOwner' })
  await petShop.deployed()
  await saveAppFiles('PetShop', petShop.address)
  console.log('PetShop was deployed to ', petShop.address)
}

// excute contract deployment
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
