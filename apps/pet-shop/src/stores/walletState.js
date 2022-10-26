import { reactive } from 'vue'

export default reactive({
  account: null,
  balances: null,
  setAccount(account, meta = null) {
    this.account = account
    if (!account) {
      this.balances = null
      return
    }

    this.setBalances(account, meta)
  },
  async setBalances(account = this.account, meta) {
    if (!meta) return
    this.balances = Number((await meta.balanceOf(account)).toString())
  },
})
