// https://eips.ethereum.org/EIPS/eip-20
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WorkHardToken is ERC20 {
    // Define the supply of FunToken: 996,996,996
    uint256 constant initialSupply = 996996996 * (10 ** 5);

    function decimals() public view virtual override returns (uint8) {
        return 5;
    }

    // Constructor will be called on contract creation
    constructor() ERC20("Work hard token", "WHT") {
        _mint(msg.sender, initialSupply);
    }
}
