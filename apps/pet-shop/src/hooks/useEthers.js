import { ethers, BigNumber, FixedNumber } from 'ethers'
import { ethState } from '@stores/index'

export default function useEthers() {
  let _provider = null

  // initialize all smart contracts
  const _initialilzeContract = async () => {
    try {
      // read json file of all contracts
      // create the instance of each contract.
      const files = import.meta.glob('../contracts/*.json')
      for (const key in files) {
        const artifact = await files[key]()
        ethState.addContractMeta(
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
  async function initializeEthers() {
    // metaMask
    if (window.ethereum) {
      _provider = new ethers.providers.Web3Provider(window.ethereum)
    } else {
      _provider = ethers.providers.getDefaultProvider('ws://127.0.0.1:8545')
    }

    // mark ethers' initial status
    ethState.setProvider(_provider)

    // return promise's status
    return _initialilzeContract()
  }

  function createActivedWallet() {
    return new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', ethState.getProvider())
  }

  return { initializeEthers, createActivedWallet, ethers, BigNumber, FixedNumber }
}
