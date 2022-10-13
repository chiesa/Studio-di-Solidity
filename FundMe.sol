// Get funds from users
// Withdraw funds
// Set a minimum funding

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './PriceConvertor.sol';

error notOwner();

contract ReadMe{
    using PriceConvertor for uint256;

    address immutable i_owner;
    uint256 funds;
    address[] funder;
    mapping(address=>uint256) addressToAmountOfFund;

    constructor(){
        i_owner = msg.sender;
    }

    // NOTA BENE 1e18 = 1* 10^18 = 1 ETH
    // il costo di una costante è molto più basso che quello di una variabile
    uint256 public constant MINIMUM_USD = 50*1e18;

    function sendFund() public payable{ 
        require(msg.value.getConvertion()>= MINIMUM_USD,"minimo fund e' 1");
        funds += msg.value;
        funder.push(msg.sender);
        addressToAmountOfFund[msg.sender]=msg.value;

    }

    modifier justOwner{
        //require(msg.sender==i_owner, "you are not the owner");
        if(msg.sender!=i_owner){revert notOwner();}
        _;
    }

    function withdrawFund(/*address payable _addressWhitdraw, uint _amount*/) public payable justOwner{
        for(uint256 funderIndex; funderIndex < funder.length; funderIndex++){
            addressToAmountOfFund[funder[funderIndex]]=0;
            funder = new address[](0); //new blank array
        } 

        // INVIO VALUTE IN 3 MODI:
        // 1) transfert:
        //      payable(msg.sender).transfer(amount);
        // 2) send:
        //      bool sendSuccess = payable(msg.sender).send(amount);
        //      required(sendSuccess, "Send failed");
        // 3) call:
        //      (bool callSuccess, bytes memory dataReturned) = payable(msg.sender).call{value: amount}("")
        //      required(callSuccess, "Call failed");
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");


        /*
        CODICE VECCHIO
        require(msg.sender==i_owner);
        require(_amount>funds,"importo non valido");
        if(_amount>funds){
            _addressWhitdraw.transfer(_amount);
        }
        */
    }

    // receive & fallback
    // receive è chiamata se qualcuno manda soldi senza funzioni
    receive() external payable{
        fund();
    }

    fallback(){
        fund();
    }
}