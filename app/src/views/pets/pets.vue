<template>
  <div class="pets-page">
    <div class="pet-title">
      <span>Devie's Pet Shop</span>
      <div class="pet-title-right-btns">
        <template v-if="noAccount">
          <n-button size="small" type="primary" @click="handleConnectedWallet">Connect Wallet</n-button>
        </template>
        <n-button size="small" @click="$router.back()">Back</n-button>
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
                <div class="pet-btns">
                  <n-button size="small" :disabled="getAdoptedBtnStatus(pet)" @click="adoptHanlder(pet)">
                    {{ pet.statusText }}
                  </n-button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pets',
}
</script>

<script setup>
import petData from './pet-data'
import { useAssets } from '@hooks/index'
import { ethStore } from '@stores/index'
import { useEthers } from '@hooks/index'
import { onMounted, ref, computed } from 'vue'
import { NButton, useMessage } from 'naive-ui'

// reactivity varialbles
const message = useMessage()
const pets = ref(petData || [])
const noAccount = computed(() => ethStore.account === null)

// use hooks
const { getAssetUrl } = useAssets()
const { getMetaMaskAccounts, onMetaMaskSelectedAccountChanged } = useEthers()

onMounted(() => {
  try {
    _markAdoptedPets()
    _listenAccountChanged()
    _monitorBlockEvent()
    // listening
  } catch (err) {
    console.error(err)
  }
})

function _listenAccountChanged() {
  onMetaMaskSelectedAccountChanged(
    msg => {
      console.log(msg)
      ethStore.setAccount(null)
    },
    newAccount => {
      console.log('newAccount::', newAccount)
      ethStore.setAccount(newAccount)
    }
  )
}

function _monitorBlockEvent() {
  ethStore.getContract('PetShop').on('AdoptedEvent', (oldValue, newValue, event) => {
    console.log(oldValue, newValue, event)
    _markAdoptedPets()
  })
}

async function _markAdoptedPets() {
  const adoptedPetIds = await ethStore.getContract('PetShop').getAdoptedPets()
  if (adoptedPetIds.length) {
    const tempAdoptedPetIds = adoptedPetIds.map(petId => Number(petId))
    pets.value.forEach(pet => (tempAdoptedPetIds.includes(pet.id) ? (pet.statusText = 'Adopted') : 'Adopt'))
  }
}

// define adopted method
async function adoptHanlder(pet) {
  try {
    // judge whether the pet has been adopted
    if (await ethStore.getContract('PetShop').isAdopted(pet.id)) {
      return
    }

    // call the adopt method of smart contract
    await ethStore.getContract('PetShop').adopt(pet.id)

    // pop-up success message
    message.success('Adopt successfully!')
  } catch (err) {
    console.error(err)
  }
}

// get status of adopted button
function getAdoptedBtnStatus(pet) {
  return noAccount.value || pet.statusText === 'Adopted'
}

// connect wallet
async function handleConnectedWallet() {
  const accounts = await getMetaMaskAccounts(message)
  console.log('devie::', accounts)
}
</script>

<style lang="less" scoped>
@import url('./pets.less');
</style>
