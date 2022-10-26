// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract PetShop {
    // some string type variables to identify the token.
    string public symbol = "DPS";
    string public name = "Devie's Pet Shop";
    uint256 totalSupply = 100000;

    // define struct of the pet
    struct Pet {
        address adopter;
        bool adopted;
    }

    // an address type variable is used to store ethereum accounts.
    address public owner;

    // define hashmap for pets
    mapping(uint256 => Pet) pets;

    // define variable for adoped pet list
    uint256[] public adoptedPetList;

    // a mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    // define event
    event AdoptedEvent();

    // the Recharge event helps off-chain aplications understand
    // what happens within your contract.
    event TransferEvent(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    constructor() {
        // the owner of contract
        owner = msg.sender;

        // owner‘s balances
        balances[msg.sender] = totalSupply;
        console.log("owner-balances: %s", balances[msg.sender]);
    }

    // function to adopt a pet
    function adopt(uint256 petId, address from, uint256 amount) external {
        pets[petId] = Pet({adopter: from, adopted: true});
        console.log("adopt from %s", from);
        adoptedPetList.push(petId);

        // save totkens from From-address‘ amount to owner's balances
        saveTokensToOwner(from, amount);

        // notify off-chain application to update pets' status
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

    // function to save tokens to owner's balances
    function saveTokensToOwner(address from, uint256 amount) private {
        console.log('saveTokensToOwner: %s %s', msg.sender, amount);
        require(amount > 0, "Not less than 0");
        require(balances[from] >= amount, "Not enough tokens");


        // transfer
        balances[msg.sender] += amount;
        balances[from] -= amount;

        // notify off-chain applications of the transfer.
        emit TransferEvent(from, msg.sender, amount);
    }

    // fucntion to transfer
    function transfer(address to, uint256 amount) external {
        console.log('transfer:: %s', balances[msg.sender]);
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // we can print messages and values using console.log.
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
