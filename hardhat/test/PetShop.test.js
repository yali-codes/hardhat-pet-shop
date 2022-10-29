const { expect } = require('chai')
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

// pets's ids
const petIds = [1, 2, 3]

describe('PetShop contract', function () {
  // deploy PetShop contract
  async function deployPetShopFixture() {
    const PetShop = await ethers.getContractFactory('PetShopV2')
    const [owner, account1, account2] = await ethers.getSigners()
    const petShop = await PetShop.deploy()
    await petShop.deployed()

    // PetShop: artifact, petShop: contract instance, owner: contract account, addr1 and addr2: external account
    return { PetShop, petShop, owner, account1, account2 }
  }

  async function getBalance(address) {
    return await ethers.provider.getBalance(address)
  }

  describe('Deployment', function () {
    it('Should set right owner', async function () {
      const { petShop, owner } = await loadFixture(deployPetShopFixture)
      expect(await petShop.owner()).to.equal(owner.address)
    })
  })

  describe('Adopt', function () {
    it(`A pet should be apoted and check contract's balances`, async function () {
      const { petShop, account1, account2 } = await loadFixture(deployPetShopFixture)
      const amount = ethers.utils.parseEther('1')
      await petShop.connect(account1).adopt(petIds[0], account1.address, { value: amount })
      await petShop.connect(account2).adopt(petIds[1], account2.address, { value: amount })

      const adoptedPetIds = await petShop.getAdoptedPets()
      expect(adoptedPetIds.length).to.equal(2)

      // before withdrawing
      const balances = ethers.utils.formatEther(await getBalance(petShop.address))
      expect(balances).to.equal('2.0')
    })

    it(`Withdraw all balances to contract's account`, async function () {
      const { petShop, account1 } = await loadFixture(deployPetShopFixture)
      const amount = ethers.utils.parseEther('1')
      await petShop.connect(account1).adopt(petIds[0], account1.address, { value: amount })

      // after withdraw, get total balances -> '0.0'
      await petShop.withDraw()
      const balances = ethers.utils.formatEther(await getBalance(petShop.address))
      expect(balances).to.equal('0.0')
    })

    it(`Should emit TransferEvent`, async function () {
      const { petShop, owner, account1 } = await loadFixture(deployPetShopFixture)
      const amount = ethers.utils.parseEther('10')
      await petShop.connect(account1).adopt(petIds[0], account1.address, { value: amount })
      await expect(petShop.transfer(account1.address, amount))
        .to.emit(petShop, 'TransferEvent')
        .withArgs(owner.address, account1.address, amount)
    })
  })
})
