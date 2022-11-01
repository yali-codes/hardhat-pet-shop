<template>
  <div class="pets-page">
    <div class="pet-title">
      <span>{{ name }}</span>
      <div class="pet-title-right-btns">
        <template v-if="!account">
          <n-button size="small" type="primary" @click="connectWalletHandler">Connect Wallet</n-button>
        </template>
        <n-button size="small" @click="$router.back()">Back</n-button>
      </div>
    </div>
    <div class="user-info-container">
      <div class="user-info-inner-bg"></div>
      <div class="user-info">
        <p>
          <strong>Account: </strong>
          <span>{{ formatAddress(account) || 'no account' }}</span>
        </p>
        <template v-if="account">
          <p>
            <strong>Balances: </strong>
            <span :data="balance">{{ formatBalance(balance) || 0 }} GOA</span>
          </p>
          <template v-if="isOwner">
            <n-button size="tiny" type="warning" @click="withdrawRef.show()">Withddraw</n-button>
          </template>
        </template>
      </div>
    </div>
    <div class="pet-list-container">
      <div class="pet-list">
        <template v-for="pet in pets" :key="pet.id">
          <div class="pet-item-container">
            <div class="pet-item">
              <div class="pet-item-head">{{ pet.name }}</div>
              <div class="pet-item-body">
                <img :src="getAssetUrl(pet.picture)" />
                <p>
                  <strong>Price</strong>:
                  <span class="pet-price">{{ pet.price + ' GOA' }}</span>
                </p>
                <p>
                  <strong>Breed</strong>:
                  <span>{{ pet.breed }}</span>
                </p>
                <p>
                  <strong>Age</strong>:
                  <span>{{ pet.age }}</span>
                </p>
                <p>
                  <strong>Location</strong>:
                  <span>{{ pet.location }}</span>
                </p>
                <div class="pet-btns" v-if="!isOwner">
                  <n-button size="small" :disabled="getAdoptedBtnStatus(pet)" @click="decideToAdoptPet(pet)">
                    {{ pet.statusText }}
                  </n-button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- amodal to adopt a pet -->
    <AdoptPet ref="adoptPetRef" @on-confirm="confirmAdoptionHanlder" @on-cancel="cancelAdoptionHandler" />

    <!-- a modal to buy some tokens -->
    <WithDraw ref="withdrawRef" />
  </div>
</template>

<script>
export default {
  name: 'Pets',
}
</script>

<script setup>
import { petData } from './config'
import { AdoptPet } from './components'
import { WithDraw } from '@components/withdraw'
import { ethState, walletState } from '@stores/index'
import { useAssets, useMetaMask, useEthers } from '@hooks/index'
import { formatAddress, formatBalance } from '@utils/index'
import { onMounted, ref, computed } from 'vue'
import { NButton, useMessage } from 'naive-ui'

// instance of the PetShop contract
const petShop = ethState.getContract('PetShop')

// reactivity varialbles
const name = ref('')
const pets = ref(petData)
const isOwner = ref(false)
const adoptPetRef = ref(null)
const withdrawRef = ref(null)
const selectedPet = ref(null)
const account = computed(() => walletState.account)
const balance = computed(() => walletState.balance)

// use hooks
const message = useMessage()
const { getAssetUrl } = useAssets()
const { ethers, twoAddressAreEqual } = useEthers()
const { getMetaMaskAccounts, onMetaMaskSelectedAccountChanged } = useMetaMask()

onMounted(() => {
  try {
    _initializeData()
    _listenAccountChanged()
    _monitorBlockEvent()
  } catch (err) {
    console.error(err)
  }
})

function _listenAccountChanged() {
  onMetaMaskSelectedAccountChanged(
    msg => {
      console.log(msg)
      walletState.setAccount(null)
    },
    newAccount => {
      console.log('newAccount::', newAccount)
      walletState.setAccount(newAccount)
      _checkOwner(newAccount)
    }
  )
}

function _monitorBlockEvent() {
  petShop.on('TransferEvent', (from, to, value) => {
    console.log('TransferEvent::', from, to, value)
    walletState.setBalances(account.value)
    _initializeData()
  })
}

async function _checkOwner(newAccount) {
  isOwner.value = twoAddressAreEqual(newAccount, await petShop.owner())
}

async function _initializeData() {
  name.value = await petShop.name()
  const petIds = await petShop.getAdoptedPets()
  if (petIds.length) {
    const tempPetIds = petIds.map(petId => Number(petId))
    pets.value.forEach(pet => (tempPetIds.includes(pet.id) ? (pet.statusText = 'Adopted') : 'Adopt'))
  }
}

// function to decide to adopt a pet
function decideToAdoptPet(pet) {
  if (balance.value < pet.price) {
    return message.warning('Not enough tokens!')
  }
  pet.statusText = 'Adopting'
  selectedPet.value = pet
  adoptPetRef.value.show({ ...pet })
}

function cancelAdoptionHandler() {
  selectedPet.value.statusText = 'Adopt'
}

// define adopted method
// eslint-disable-next-line no-unused-vars
async function confirmAdoptionHanlder(pet) {
  try {
    // judge whether the pet has been adopted
    if (await petShop.isAdopted(pet.id)) {
      return
    }

    // call the adopt method of smart contract
    const price = pet.price.toString()
    const amount = ethers.utils.parseEther(price)
    const tx = await petShop.adopt(pet.id, account.value, { value: amount })
    await tx.wait()
    pet.statusText = 'Adopted'

    // pop-up success message
    message.success('Adopt successfully!')
  } catch (err) {
    pet.statusText = 'Adopt'
    message.error('Cancel the transaction!')
    console.error(err)
  }
}

// function to get status of adopted button
function getAdoptedBtnStatus(pet) {
  return !account.value || ['Adopted', 'Adopting'].includes(pet.statusText)
}

// function to connect wallet
async function connectWalletHandler() {
  const [newAccount] = await getMetaMaskAccounts(message)
  walletState.setAccount(newAccount)
  _checkOwner(newAccount)
}
</script>

<style lang="less" scoped>
@import url('./pets.less');
</style>
