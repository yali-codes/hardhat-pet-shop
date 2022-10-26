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

    const artifactDir = path.join(__dirname, '../../apps/pet-shop/src/contracts/PetShop.json')

    if (!fs.existsSync(artifactDir)) {
      console.error('You need to deploy your contract first')
      return
    }

    const result = fs.readFileSync(artifactDir, { encoding: 'utf-8' })
    const artifact = JSON.parse(result)

    if ((await ethers.provider.getCode(artifact.address)) === '0x') {
      console.error('You need to deploy your contract first')
      return
    }

    const [, owner] = await ethers.getSigners()
    const tx2 = await owner.sendTransaction({ to: receiver, value: ethers.constants.WeiPerEther })
    await tx2.wait()

    console.log(`Transferred 1 CPAY to ${receiver}`)
  })
