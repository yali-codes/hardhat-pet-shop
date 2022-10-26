import { reactive } from 'vue'
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
  async setBalances(account = null) {
    const _provider = ethState.getProvider()
    this.balances = Number(await _provider.getBalance(account))
  },
})
