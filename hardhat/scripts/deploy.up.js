const { saveAppFiles } = require('./helper')

async function main() {
  // local network
  // const [deployer] = await ethers.getSigners()
  // console.log('Account balances:', (await deployer.getBalance()).toString())
  // console.log('deploying the contracts with the account:', await deployer.getAddress())

  // deploy contract
  const proxyContractAddr = '0x610178dA211FEF7D417bC0e6FeD39F05609AD788'
  const PetShopV2 = await ethers.getContractFactory('PetShopV2')
  const instance = await upgrades.upgradeProxy(proxyContractAddr, PetShopV2)
  await saveAppFiles('PetShopV2', { named: 'PetShop' })
  console.log('PetShopV2 was upgrated to', instance.address)

  // local network
  // console.log('PetShop was deployed to', instance.address)
}

// excute contract deployment
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
