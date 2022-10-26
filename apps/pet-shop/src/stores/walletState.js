import { reactive } from 'vue'
import { ethers } from 'ethers'
import ethState from './ethState'

export default reactive({
  account: null,
  balances: null,
  setAccount(account) {
    this.account = account
    if (!account) {
      this.balances = null
      return
    }

    this.setBalances(account)
  },
  async setBalances(account = this.account) {
    const _provider = ethState.getProvider()
    const balance = await _provider.getBalance(account)

    this.balances = Number(ethers.utils.formatEther(balance))
  },
})
