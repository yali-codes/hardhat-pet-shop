<template>
  <div ref="modalRef" class="withdraw-balance-wrapper">
    <n-modal
      style="width: 430px"
      preset="dialog"
      positive-text="Confirm"
      negative-text="Cancel"
      title="Withdraw the balance?"
      :mask-closable="false"
      :to="modalMountedDom"
      v-model:show="visiable"
      @positive-click="confirmHandler"
      @negative-click="cancelHandler"
    >
      <n-form ref="formRef" size="small" :label-width="80" :model="formModel" :rules="rules">
        <n-form-item label="Contract total" path="balance">
          <n-input disabled v-model:value="formModel.balance" />
        </n-form-item>
        <n-form-item label="Receiver" path="to">
          <n-input disabled v-model:value="formModel.to" />
        </n-form-item>
        <n-form-item label="Value" path="amount">
          <n-input v-model:value="formModel.amount" />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BuyTokens',
};
</script>

<script lang="ts" setup>
import { ref, toRaw, computed, ComputedRef } from 'vue';
import { NModal, NForm, NInput, NFormItem, useMessage } from 'naive-ui';
import { WithDraw } from '@interfaces/index';
import { ethState, walletState } from '@stores/index';
import { useEthers } from '@hooks/index';

const rules = {
  to: { required: true, message: 'To Addr needs to require.', trigger: 'blur' },
  from: { required: true, message: 'From Addr needs to require.', trigger: 'blur' },
  amount: [
    { required: true, message: 'Value needs to require.', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d+)?$/,
      message: 'Please enter a valid number!',
      trigger: ['input', 'blur'],
    },
  ],
};

// instance of the PetShop contract
const petShop = ethState.getContract('PetShop');

// define some reactivity variables
const visiable = ref<boolean>(false);
const modalRef = ref<HTMLElement | null | undefined>(null);
const formModel = ref<WithDraw>({ to: '', from: '', amount: '', balance: '' });
const transfering = ref(false);
const modalMountedDom: ComputedRef = computed(() => modalRef.value);

// use hooks
const message = useMessage();
const { ethers } = useEthers();

// function to confirm
async function confirmHandler() {
  const { amount, to } = toRaw(formModel.value);
  const bigAmount = ethers.utils.parseEther(amount);

  try {
    const tx = await petShop.transfer(to, bigAmount);
    const res = await tx.wait();
    transfering.value = true;
    if (res.status === 1) {
      visiable.value = false;
      message.success('Transfer successfully!');
    } else {
      transfering.value = false;
      message.error('Transfer failed!');
    }
    console.log('devie::', res);
  } catch ({ code }) {
    if (code === 'ACTION_REJECTED') {
      message.error('User denied transaction signature!');
    }
  }
}

// function to cancel
function cancelHandler() {
  visiable.value = false;
}

// function to show modal
async function show() {
  visiable.value = true;
  transfering.value = false;
  const to = walletState.account;
  const from = await petShop.owner();
  const balance = ethers.utils.formatEther(await petShop.getBalance());
  formModel.value = { from, to, balance, amount: balance };
}

// expose methods or properties, etc.
defineExpose({ show });
</script>

<style lang="less" scoped>
.withdraw-balance-wrapper {
  :deep(.n-form) {
    margin-top: 20px;
  }
}
</style>
