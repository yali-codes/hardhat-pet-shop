import { reactive, toRaw } from 'vue'

export default reactive({
  provider: null,
  contracts: {},
  setProvider(provider) {
    this.provider = provider
  },
  addContractMeta(contractName, contractMeta) {
    this.contracts[contractName] = contractMeta
  },
  getContract(contractName) {
    return toRaw(this.contracts[contractName])
  },
  getProvider() {
    return toRaw(this.provider)
  },
})
