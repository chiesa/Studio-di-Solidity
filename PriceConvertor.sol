//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConvertor{
    function getPrice() internal view returns(uint256){
        //address: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        (,int price,,,)=AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419).latestRoundData();
        return uint256(price*1e18);
    }

    function getConvertion(uint256 _amount) internal view returns (uint256){
        return getPrice()*_amount /1e18;
    }
}