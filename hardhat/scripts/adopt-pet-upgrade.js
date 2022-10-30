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
  if (network.name === 'hardhat') {
    console.warn(
      'You are trying to deploy a contract to the Hardhat Network, which' +
        'gets automatically created and destroyed every time. Use the Hardhat' +
        " option '--network localhost'"
    )
  }

  const [deployer] = await ethers.getSigners()
  console.log('Account balances:', (await deployer.getBalance()).toString())
  console.log('deploying the contracts with the account:', await deployer.getAddress())

  // deploy PetShop Contract
  const PetShopV2Contract = await ethers.getContractFactory('PetShopV2')
  const petShop = await upgrades.deployProxy('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', PetShopV2Contract)
  await petShop.deployed()
  await saveAppFiles('PetShop', petShop.address)

  console.log('Account balances:', (await deployer.getBalance()).toString())
}

// excute contract deployment
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
