//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './SimpleStorage.sol';

// ExtraStorage eredita tutto di SimpleStorage
contract ExtraStorage is SimpleStorage{
    // we wanna +5 to the favorite numeber
    // 2 possibility: override (nel figlio) & virtual override (nel padre)
    function store(uint256 _favoriteNumber) public override{
        favoriteNumber = _favoriteNumber +5;
        
    }
}