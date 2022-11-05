import { Pet, WithDraw } from './pets-types';
import { MessageProviderInst } from './naive-types';
import { providers } from 'ethers';

export type BaseProvider = providers.BaseProvider | null;
export type JsonRpcProvider = providers.JsonRpcProvider;

export type { Pet, WithDraw, MessageProviderInst };
