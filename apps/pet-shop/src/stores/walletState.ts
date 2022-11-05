import { reactive } from 'vue';
import { ethers } from 'ethers';
import ethState from './ethState';

type Account = string | null;
type Balance = number | null;

type WalletState = {
  account: Account;
  balance: Balance;
  setAccount: (account: Account) => void;
  setBalances: (account: Account) => Promise<void>;
};

export default reactive<WalletState>({
  account: null,
  balance: null,
  setAccount(account: Account) {
    this.account = account;
    if (!account) {
      this.balance = null;
      return;
    }

    this.setBalances(account);
  },
  async setBalances(account: Account) {
    const _provider = ethState.getProvider();
    const balance: string = await _provider.getBalance(account || this.account);
    this.balance = Number(ethers.utils.formatEther(balance));
  },
});
