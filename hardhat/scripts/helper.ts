import { join } from 'path'
import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs'
import { SaveAppFilsParams } from '../types-helper'
import { artifacts } from 'hardhat'

/**
 * save contract's artifact and address in the app directory
 * @param {string} contractName smart contract name
 * @param {object} param1 { address -> a address of the deployed contract, named -> the name of json file in the `apps/[app-folder]/src/contracts` }
 * @returns Promise.resolve()
 */
export const saveAppFiles = (contractName: string, params: SaveAppFilsParams): void => {
  const { address, named } = params
  const contractsDir = join(__dirname, '..', '..', 'apps/pet-shop/src/contracts')

  // if there is no `contractsDir` directory and create the `contractsDir` directory with fs
  if (!existsSync(contractsDir)) {
    mkdirSync(contractsDir)
  }

  if (address) {
    // define `contracts-address.json` filepath
    const contractsAddressPath: string = join(contractsDir, 'contracts-address.json')

    // if there is no `contractsAddressPath` filepath and create the `contractsAddressPath` filepath with fs
    if (!existsSync(contractsAddressPath)) {
      writeFileSync(contractsAddressPath, JSON.stringify({}, null, 2))
    }

    // read `contracts-address.json` contents
    const contractsAddress = JSON.parse(readFileSync(contractsAddressPath, { encoding: 'utf-8' }))
    contractsAddress[contractName] = address
    writeFileSync(contractsAddressPath, JSON.stringify(contractsAddress, null, 2))
  }

  // get contract's artifact from artifacts.readArtifactSync(contractName)
  const contractArtifact = artifacts.readArtifactSync(contractName)
  writeFileSync(join(contractsDir, `${named || contractName}.json`), JSON.stringify(contractArtifact, null, 2))
}
