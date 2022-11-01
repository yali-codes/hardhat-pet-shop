<template>
  <n-modal
    preset="dialog"
    positive-text="Confirm"
    negative-text="Cancel"
    :mask-closable="false"
    :title="`Adopt a pet named ${selectedPet.name}?`"
    v-model:show="visiable"
    @positive-click="positiveClickHandler"
    @negative-click="negativeClickHandler"
  >
    <h1 class="adopt-pet-content">Cost {{ selectedPet.price }} ETH</h1>
  </n-modal>
</template>

<script>
export default {
  name: 'AdoptPet',
}
</script>

<script setup>
import { ref } from 'vue'
import { NModal } from 'naive-ui'

const visiable = ref(false)
const selectedPet = ref({})

const emit = defineEmits(['on-confirm', 'on-cancel'])

// function to confirm
function positiveClickHandler() {
  visiable.value = false
  const { id, price } = selectedPet.value
  emit('on-confirm', { id, price })
}

// function to cancel
function negativeClickHandler() {
  visiable.value = false
  emit('on-cancel')
}

// function to show modal
function show(pet) {
  if (!pet) {
    throw new Error('Pet name needs to require.')
  }

  selectedPet.value = pet
  visiable.value = true
}

// expose methods or properties, etc.
defineExpose({ show })
</script>

<style lang="less" scoped>
.adopt-pet-content {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  color: red;
}
</style>
