import { reactive } from 'vue'

export const ethStore = reactive({
  initial: false,
  account: null,
  contracts: {},
  setInitial() {
    this.initial = true
  },
  setAccount(account) {
    this.account = account
  },
  addContractMeta(contractName, contractMeta) {
    this.contracts[contractName] = contractMeta
  },
})
