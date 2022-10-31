const fs = require('fs')
const path = require('path')

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.
task('faucet', 'Sends ETH and tokens to an address')
  .addPositionalParam('receiver', 'The address that will receive them')
  .setAction(async ({ receiver }, { ethers }) => {
    if (network.name === 'hardhat') {
      console.warn(
        'You are running the faucet task with Hardhat network, which' +
          'gets automatically created and destroyed every time. Use the Hardhat' +
          " option '--network localhost'"
      )
    }

    const contractsAddressFilepaht = path.join(__dirname, '../../apps/pet-shop/src/contracts/contracts-address.json')
    if (!fs.existsSync(contractsAddressFilepaht)) {
      console.error('You need to deploy your contract first')
      return
    }

    const artifact = JSON.parse(fs.readFileSync(contractsAddressFilepaht, { encoding: 'utf-8' }))
    if ((await ethers.provider.getCode(artifact.PetShop)) === '0x') {
      console.error('You need to deploy your contract first')
      return
    }

    const [, owner] = await ethers.getSigners()
    const amount = '2'
    const tx2 = await owner.sendTransaction({ to: receiver, value: ethers.utils.parseEther(amount) })
    await tx2.wait()

    console.log(`Transferred ${amount} CPAY to ${receiver}`)
  })
