<template>
  <div ref="modalRef" class="buy-tokens-wrapper">
    <n-modal
      style="width: 500px"
      preset="dialog"
      positive-text="Confirm"
      negative-text="Cancel"
      title="Decide to buy some tokens?"
      :to="modalRef"
      :mask-closable="false"
      v-model:show="visiable"
      @positive-click="confirmHandler"
      @negative-click="cancelHandler"
    >
      <n-form ref="formRef" label-placement="left" size="small" :label-width="60" :model="formModel" :rules="rules">
        <n-form-item label="To" path="to">
          <n-input readonly v-model:value="formModel.to" />
        </n-form-item>
        <n-form-item label="From" path="from">
          <n-input readonly v-model:value="formModel.from" />
        </n-form-item>
        <n-form-item label="Value" path="amount">
          <n-input v-model:value="formModel.amount" />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script>
export default {
  name: 'BuyTokens',
}
</script>

<script setup>
import { ref, toRaw } from 'vue'
import { NModal, NForm, NInput, NFormItem, useMessage } from 'naive-ui'
import { ethState, walletState } from '@stores/index'
import { useEthers } from '@hooks/index'

const rules = {
  to: { required: true, message: 'To Addr needs to require.', trigger: 'blur' },
  from: { required: true, message: 'From Addr needs to require.', trigger: 'blur' },
  amount: [
    { required: true, message: 'Value needs to require.', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d+)?$/,
      message: 'Value should be begined with a number and ended with a number and can contain decimal.',
      trigger: ['input', 'blur'],
    },
  ],
}

// instance of the PetShop contract
const petShop = ethState.getContract('PetShop')

// define some reactivity variables
const visiable = ref(false)
const modalRef = ref(null)
const formModel = ref({})

// use hooks
const message = useMessage()
const { createActivedWallet } = useEthers()
const wallet = createActivedWallet()

// function to confirm
async function confirmHandler() {
  visiable.value = false
  const { amount, to } = toRaw(formModel.value)

  const bigAmount = amount * Math.pow(10, 18)
  try {
    // const tx = await petShop.transfer(to, bigAmount.toString())
    // const receipt = await tx.wait()
    // if (receipt.status === 0) {
    //   return message.error('Transaction failed!')
    // }

    const tx = await wallet.sendTransaction({ to, value: amount })
    const receipt = await tx.wait()
    console.log('devie:', receipt)
  } catch (err) {
    console.error(err)
    message.error('Not enough tokens!')
  }
}

// function to cancel
function cancelHandler() {
  visiable.value = false
}

// function to show modal
async function show() {
  debugger
  try {
    const to = walletState.account
    const from = await petShop.owner()
    formModel.value = { from, to }
    visiable.value = true
  } catch (err) {
    console.error(err)
  }
}

// expose methods or properties, etc.
defineExpose({ show })
</script>

<style lang="less" scoped>
.buy-tokens-wrapper {
  :deep(.n-form) {
    margin-top: 20px;
  }
}
</style>
