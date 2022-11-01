import { reactive } from 'vue'
import { ethers } from 'ethers'
import ethState from './ethState'

export default reactive({
  account: null,
  balance: null,
  setAccount(account) {
    this.account = account
    if (!account) {
      this.balance = null
      return
    }

    this.setBalances(account)
  },
  async setBalances(account = this.account) {
    const _provider = ethState.getProvider()
    const balance = await _provider.getBalance(account)

    this.balance = Number(ethers.utils.formatEther(balance))
  },
})
