import { join } from 'path'
import { existsSync, readFileSync } from 'fs'
import { task } from 'hardhat/config'

task('faucet', 'Sends ETH and tokens to an address')
  .addPositionalParam('receiver', 'The address that will receive them')
  .setAction(async ({ receiver }, { ethers }) => {
    const contractsAddressFilepaht = join(__dirname, '../../apps/pet-shop/src/contracts/contracts-address.json')
    if (!existsSync(contractsAddressFilepaht)) {
      console.error('You need to deploy your contract first')
      return
    }

    const artifact = JSON.parse(readFileSync(contractsAddressFilepaht, { encoding: 'utf-8' }))
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
