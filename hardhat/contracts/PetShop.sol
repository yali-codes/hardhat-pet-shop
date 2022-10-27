// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import 'hardhat/console.sol';

// deployed to Goerli at 0xA3abbDA93A850758F85598A47cf186C0BCA085aC

contract PetShop {
  // define struct of the pet
  struct Pet {
    address adopter;
    bool adopted;
  }

  // an address type variable is used to store ethereum accounts.
  address payable public owner;

  // define hashmap for pets
  mapping(uint256 => Pet) pets;

  // define variable for adoped pet list
  uint256[] public adoptedPets;

  // a mapping is a key/value map. Here we store each account balance.
  mapping(address => uint256) balances;

  // the Recharge event helps off-chain aplications understand
  // what happens within your contract.
  event TransferEvent(address indexed from, address indexed to, uint256 value);

  constructor() {
    // the owner of contract
    owner = payable(msg.sender);
  }

  // function to check pet's adopted status
  function isAdopted(uint256 petId) external view returns (bool) {
    return pets[petId].adopted;
  }

  // function to get adopted pets
  function getAdoptedPets() external view returns (uint256[] memory) {
    return adoptedPets;
  }

  // function to adopt a pet
  function adopt(uint256 petId, address from) external payable {
    pets[petId] = Pet({ adopter: from, adopted: true });
    adoptedPets.push(petId);

    console.log("before: Owner's balance: %s", owner.balance);
    withDraw();

    // notify off-chain application to update pets' status
    emit TransferEvent(owner, from, petId);
  }

  function withDraw() public {
    (bool success, ) = owner.call{ value: address(this).balance }('');
    require(success, 'Transfer failed.');
    console.log("after: Owner's balance: %s", owner.balance);
  }

  // fucntion to transfer
  function transfer(
    address from,
    address to,
    uint256 amount
  ) external payable {
    console.log('transfer:: %s', balances[msg.sender]);
    require(from.balance >= amount, 'Not enough tokens');

    // transfer the amount.

    // notify off-chain applications of the transfer.
    emit TransferEvent(msg.sender, to, amount);
  }
}
