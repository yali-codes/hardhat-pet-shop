export default function useMetaMask() {
  // function to get metaMask's accounts
  const getMetaMaskAccounts = async message => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('getMetaMaskAccounts::', accounts);
      return accounts ? accounts : null;
    } catch (err) {
      message.error('connect wallet failed');
    }
  };

  // function to listen for changes to the selected account of MetaMask
  const onMetaMaskSelectedAccountChanged = (resetFn: Function, initialFn: Function) => {
    window.ethereum.on('accountsChanged', (accounts: [string]) => {
      if (!initialFn) {
        throw new Error('initalFn should be required!');
      }

      if (!resetFn) {
        throw new Error('resetFn should be required!');
      }

      const [newAccount] = accounts;
      if (!newAccount) {
        return resetFn('there is no a connected account');
      }

      // execute initalFn method
      initialFn(newAccount);
    });
  };

  return { getMetaMaskAccounts, onMetaMaskSelectedAccountChanged };
}
