//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './SimpleStorage.sol';

contract StorageFactory{
    
    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public{
        simpleStorageArray.push(new SimpleStorage());
    }

    function fsStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public {
        // address
        // ABI - Application Binary Interface
        simpleStorageArray[_simpleStorageIndex].store(_simpleStorageNumber);
    }

    function fsGet(uint256 _simpleStorageIndex) public view returns(uint256){
        return simpleStorageArray[_simpleStorageIndex].retrieve();
    }
}