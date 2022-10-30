// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import 'hardhat/console.sol';

// deployed to Goerli at 0xA3abbDA93A850758F85598A47cf186C0BCA085aC

contract PetShop {
	uint256 x;

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

  // constructor() {
  //   // the owner of contract
  //   owner = payable(msg.sender);
  // }

	function setOwner() external {
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
  function adopt(uint256 petId, address adoptedAddr) external payable {
    require(petId >= 0, "Pet's id is invalid.");
    pets[petId] = Pet({ adopter: adoptedAddr, adopted: true });
    adoptedPets.push(petId);

    // notify off-chain application to update pets' status
    emit TransferEvent(adoptedAddr, owner, petId);
  }

  // function to withdraw balance to contract's account
  function withDraw() public {
    require(address(this).balance > 0, 'Not enough tokens');

    (bool success, ) = owner.call{ value: address(this).balance }('');
    require(success, 'Withdraw failed.');
  }

  // fucntion to transfer
  function transfer(address payable to, uint256 amount) external {
    require(address(this).balance > 0, 'Not enough tokens');

    // transfer the amount.
    (bool success, ) = to.call{ value: amount }('');
    console.log('result: %s', success);
    require(success, 'Transfer failed');

    // notify off-chain applications of the transfer.
    emit TransferEvent(owner, to, amount);
  }

  function getBalance() external view returns (uint256) {
    return address(this).balance;
  }
}
