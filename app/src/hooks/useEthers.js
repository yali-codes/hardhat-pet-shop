import { ethers } from 'ethers'
import { ethStore } from '@stores/index'

export default function useEthers(next) {
  let _provider = null

  // initialize all smart contracts
  const _initialilzeContract = async () => {
    try {
      // read json file of all contracts
      // create the instance of each contract.
      const files = import.meta.glob('../contracts/*.json')
      for (const key in files) {
        const artifact = await files[key]()
        ethStore.addContractMeta(
          artifact.contractName,
          new ethers.Contract(artifact.address, artifact.abi, _provider.getSigner(0))
        )
      }

      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  // initialize ethers
  const initializeEthers = async () => {
    // metaMask
    // if (window.ethereum) {
    //   _provider = new ethers.providers.Web3Provider(window.ethereum)
    //   return _initialilzeContract()
    // }

    _provider = ethers.providers.getDefaultProvider('ws://127.0.0.1:8545')

    // mark ethers' initial status
    ethStore.setInitial()

    // return promise's status
    return _initialilzeContract(next)
  }

  // get metaMask's accounts
  const getMetaMaskAccounts = async message => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      console.log('getMetaMaskAccounts::', accounts)
      return accounts ? accounts : null
    } catch (err) {
      message.error('connect wallet failed')
    }
  }

  // listen for changes to the selected account of MetaMask
  const onMetaMaskSelectedAccountChanged = (resetFn, initialFn) => {
    window.ethereum.on('accountsChanged', accounts => {
      debugger
      if (!initialFn) {
        throw new Error('initalFn should be required!')
      }

      if (!resetFn) {
        throw new Error('resetFn should be required!')
      }

      const [newAccount] = accounts
      if (!newAccount) {
        return resetFn('there is no a connected account')
      }

      // execute initalFn method
      initialFn(newAccount)
    })
  }

  return { initializeEthers, getMetaMaskAccounts, onMetaMaskSelectedAccountChanged }
}
