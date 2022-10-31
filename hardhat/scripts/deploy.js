const { saveAppFiles } = require('./helper')

async function main() {
  if (network.name === 'hardhat') {
    console.warn(
      'You are trying to deploy a contract to the Hardhat Network, which' +
        'gets automatically created and destroyed every time. Use the Hardhat' +
        " option '--network localhost'"
    )
  }

  // local network
  // const [deployer] = await ethers.getSigners()
  // console.log('Account balances:', (await deployer.getBalance()).toString())
  // console.log('deploying the contracts with the account:', await deployer.getAddress())

  // deploy contract
  const PetShop = await ethers.getContractFactory('PetShop')
  const instance = await upgrades.deployProxy(PetShop, [], { initializer: 'setOwner' })
  await instance.deployed()
  await saveAppFiles('PetShop', { address: instance.address })
  console.log('PetShop was deployed to', instance.address)

  // local network
  // console.log('Account balances:', (await deployer.getBalance()).toString())
}

// excute contract deployment
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
