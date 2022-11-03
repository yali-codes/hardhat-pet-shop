import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { ethers, upgrades } from 'hardhat'

// pets's ids
const petIds = [1, 2, 3]

describe('PetShop contract', function () {
  // deploy PetShop contract
  async function deployPetShopFixture() {
    const [owner, account1, account2] = await ethers.getSigners()
    const PetShop = await ethers.getContractFactory('PetShop')
    const instance = await upgrades.deployProxy(PetShop, [], { initializer: 'setOwner' })
    await instance.deployed()

    // instance: contract instance, owner: contract account, account1 and account2: external accounts
    return { instance, owner, account1, account2 }
  }

  describe('Deployment', function () {
    it(`Should set right owner`, async function () {
      const { instance, owner } = await loadFixture(deployPetShopFixture)
      expect(await instance.owner()).to.equal(owner.address)
    })
  })

  describe('Adopt', function () {
    it(`A pet should be apoted and check contract's balances`, async function () {
      const { instance, account1, account2 } = await loadFixture(deployPetShopFixture)
      const amount = ethers.utils.parseEther('1')
      await instance.connect(account1).adopt(petIds[0], account1.address, { value: amount })
      await instance.connect(account2).adopt(petIds[1], account2.address, { value: amount })

      const adoptedPetIds = await instance.getAdoptedPets()
      expect(adoptedPetIds.length).to.equal(2)

      // before withdrawing
      const balances = ethers.utils.formatEther(await instance.getBalance())
      expect(balances).to.equal('2.0')
    })

    it(`Withdraw all balances to contract's account`, async function () {
      const { instance, account1 } = await loadFixture(deployPetShopFixture)
      const amount = ethers.utils.parseEther('1')
      await instance.connect(account1).adopt(petIds[0], account1.address, { value: amount })

      // after withdraw, get total balances -> '0.0'
      await instance.withDraw()
      const balances = ethers.utils.formatEther(await instance.getBalance())
      expect(balances).to.equal('0.0')
    })

    it(`Should emit TransferEvent`, async function () {
      const { instance, owner, account1 } = await loadFixture(deployPetShopFixture)
      const amount = ethers.utils.parseEther('10')
      await instance.connect(account1).adopt(petIds[0], account1.address, { value: amount })
      await expect(instance.transfer(account1.address, amount))
        .to.emit(instance, 'TransferEvent')
        .withArgs(owner.address, account1.address, amount)
    })
  })
})
