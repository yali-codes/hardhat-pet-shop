// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "hardhat/console.sol";

contract PetShop {

    // define struct of the pet
    struct Pet {
        address adopter;
        bool adopted;
    }

    // define hashmap for pets
    mapping (uint => Pet) pets;

    // define variable for adoped pet list
    uint[] public adoptedPetList;

    // define event
    event AdoptedEvent();

    // define an adoped method.
    // store petId as key and Pet as value in map named pets.
    // store petId in adoptedPetList.
    // notify front-end by emitting event.
    function adopt(uint petId) external {
        pets[petId] = Pet({ adopter: msg.sender, adopted: true });
        adoptedPetList.push(petId);
        emit AdoptedEvent();
    }

    // return pet's adopted status
    function isAdopted(uint petId) external view returns (bool) {
        return pets[petId].adopted;
    }

    // return adopted pets
    function getAdoptedPets() external view returns (uint[] memory) {
        return adoptedPetList;
    }
}
