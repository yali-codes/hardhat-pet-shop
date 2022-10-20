import { ethers } from 'ethers'
import { ethStore } from '@stores/index'

export default function useEthers(next) {
  let _provider = null

  // initialize ethers
  const _initializeEthers = () => {
    // metaMask
    if (window.ethereum) {
      _provider = new ethers.providers.Web3Provider(window.ethereum)
      return _initialilzeContract(next)
    }

    _provider = ethers.providers.getDefaultProvider('ws://127.0.0.1:8545')
    ethStore.setInitial()
    _initialilzeContract(next)
  }

  // initialize all smart contracts
  const _initialilzeContract = async next => {
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

      // jump routing
      next && next()
    } catch (err) {
      console.error(err)
    }
  }

  _initializeEthers()
}
