//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Token {
    // some string type variables to identify the token.
    string public name = "My Hardhat Token";
    string public symbol = "MHT";

    // the fixed amount of tokens stored in an unsigned integer type variable.
    uint256 public totalSupply = 1000000;

    // an address type variable is used to store ethereum accounts.
    address public owner;

    // a mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    // the Transfer event helps off-chain aplications understand
    // what happens within your contract.
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() {
        // the totalSupply is assigned to the transaction sender, which is the
        // account that is deploying the contract.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // we can print messages and values using console.log, a feature of
        // Hardhat Network:
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
        emit Transfer(msg.sender, to, amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
