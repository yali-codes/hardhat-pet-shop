const { saveAppFiles } = require('./helper')

async function main() {
  // local network
  // const [deployer] = await ethers.getSigners()
  // console.log('Account balances:', (await deployer.getBalance()).toString())
  // console.log('deploying the contracts with the account:', await deployer.getAddress())

  // deploy contract
  const proxyContractAddr = '0x6e5f886C66B9263205857A0f9FdD3bCF77f15Ac9'
  const PetShopV2 = await ethers.getContractFactory('PetShopV2')
  const instance = await upgrades.upgradeProxy(proxyContractAddr, PetShopV2)
  await saveAppFiles('PetShopV2', { named: 'PetShop' })
  console.log('PetShop was upgrated to', instance.address)

  // local network
  // console.log('PetShop was deployed to', instance.address)
}

// excute contract deployment
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
