/**
 * get some account's balance
 * @param {ether.providers[]} provider network provider
 * @param {string} address account's address
 * @returns account's balance
 */
async function getBalance(provider, address) {
  return await provider.getBalance(address)
}

module.exports = { getBalance }
