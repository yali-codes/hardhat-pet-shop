import { reactive, toRaw } from 'vue';
import { BaseProvider } from '@interfaces/index';

type EthState = {
  provider: BaseProvider;
  contracts: any;
  setProvider: (provider: any) => void;
  addContractMeta: (contractName: string, contractMeta: any) => void;
  getContract: (contractName: string) => any;
  getProvider: () => any;
};

export default reactive<EthState>({
  provider: null,
  contracts: {},
  setProvider(provider: BaseProvider) {
    this.provider = provider;
  },
  addContractMeta(contractName: string, contractMeta: any): any {
    this.contracts[contractName] = contractMeta;
  },
  getContract(contractName: string) {
    return toRaw(this.contracts[contractName]);
  },
  getProvider(): BaseProvider {
    return toRaw(this.provider);
  },
});
