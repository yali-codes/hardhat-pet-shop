import { ethers } from 'ethers';
import { ethState } from '@stores/index';
import { BaseProvider, JsonRpcProvider } from '@interfaces/index';
import contractsAddress from '@contracts/contracts-address.json';

export default function useEthers() {
  let _provider: BaseProvider;

  // initialize all smart contracts
  const _initialilzeContract = async () => {
    try {
      // read json file of all contracts
      // create the instance of each contract.
      for (const key in contractsAddress) {
        const artifact = await import(`../contracts/${key}.json`);
        const address: string = (contractsAddress as any)[key];
        ethState.addContractMeta(key, new ethers.Contract(address, artifact.abi, (_provider as JsonRpcProvider).getSigner(0)));
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // initialize ethers
  async function initializeEthers() {
    // metaMask
    if (window.ethereum) {
      _provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
      _provider = ethers.providers.getDefaultProvider('ws://127.0.0.1:8545');
    }

    // mark ethers' initial status
    ethState.setProvider(_provider);

    // return promise's status
    return _initialilzeContract();
  }

  function twoAddressAreEqual(addr1: string, addr2: string) {
    const { getAddress } = ethers.utils;
    return getAddress(addr1) === getAddress(addr2);
  }

  return { initializeEthers, twoAddressAreEqual, ethers };
}
