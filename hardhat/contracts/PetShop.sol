// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract PetShop {
    // some string type variables to identify the token.
    string public symbol = "DPS";
    string public name = "Devie's Pet Shop";

    // define struct of the pet
    struct Pet {
        address adopter;
        bool adopted;
    }

    // an address type variable is used to store ethereum accounts.
    address public owner;

    // the fixed amount of tokens stored in an unsigned integer type variable.
    uint256 public totalSupply = 1000000;

    // define hashmap for pets
    mapping(uint256 => Pet) pets;

    // define variable for adoped pet list
    uint256[] public adoptedPetList;

    // a mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    // define event
    event AdoptedEvent();

    // the TransferEvent event helps off-chain aplications understand
    // what happens within your contract.
    event TransferEvent(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    constructor() {
        // the owner of contract
        owner = msg.sender;

        // the totalSupply is assigned to the transaction sender,
        // which is the account that is deploying the contract.
        balances[msg.sender] = totalSupply;
    }

    // function to adopt a pet
    function adopt(uint256 petId, address from) external {
        pets[petId] = Pet({adopter: from, adopted: true});
        console.log("adopt from %s", from);
        adoptedPetList.push(petId);
        emit AdoptedEvent();
    }

    // function to check pet's adopted status
    function isAdopted(uint256 petId) external view returns (bool) {
        return pets[petId].adopted;
    }

    // function to get adopted pets
    function getAdoptedPets() external view returns (uint256[] memory) {
        return adoptedPetList;
    }

    // fucntion to transfer
    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // we can print messages and values using console.log, a feature of Hardhat Network:
        console.log(
            "Transferring from %s to %s %s tokens",
            msg.sender,
            to,
            amount
        );

        // transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;

        // notify off-chain applications of the transfer.
        emit TransferEvent(msg.sender, to, amount);
    }

    // function to query the balance of account
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
