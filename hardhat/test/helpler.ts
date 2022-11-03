/**
 * get some account's balance
 * @param {ether.providers[]} provider network provider
 * @param {string} address account's address
 * @returns account's balance
 */
export const getBalance = async (provider, address) => {
  return await provider.getBalance(address)
}
