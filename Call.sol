//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// Scope: populate a function data field and send this function
// use low-level keyword: 
//  - "call": how call a function to change the state of the blockchain
//  - "staticcall": how do a "view" or "pure" functions calls, potentialy don't change the blockchain state
//  - "send"


// in order to call a function using only the data field of call, we need to encode:
// 1) the function name
// 2) the parameters 
// encode 1 ans 2 down to the binary level

// we need to work with 2 concept:
//  - "function selector" is the first 4 byte of the bytes of the function signature
//  - "function signature" is a string that defines the function name & parameters
// EXAMPLE:
// Function Signature: "transfer(address,uint256")
// function Selection: 0xa9059cbb //the first 4 bytes if I encode the signature

contract CallAnything{
    address public someAddress;
    uint256 public amount;

    // create a function with Function Signature equal to the function signature in the top
    function transfer(address _someAddress, uint256 _amount) public {
        someAddress = _someAddress;
        amount = _amount;
    }

    // ------------ GET function selector -------------
    // getSelectorOne() return Function Signature
    function getSelectorOne() public pure returns(bytes4 selector){
        selector = bytes4(keccak256(bytes("transfer(address,uint256)")));
    }

    // here we add the paramiter
    function getDataToCallTransfer(address _someAddress, uint256 _amount) public pure returns(bytes memory){
        return abi.encodeWithSelector(getSelectorOne(), _someAddress, _amount); 
    }

    // here with do the call with the paramite e return the first 4 bytes
    function callTransferDirectly(address _someAddress, uint256 _amount) public returns(bytes4, bool){
        (bool success, bytes memory returnData) = address(this).call(
            // can call getDataToCallTransfer or diractly abi.encodeWithSelector()
            //getDataToCallTransfer(_someAddress, _amount)
            abi.encodeWithSelector(getSelectorOne(), _someAddress, _amount) 
        );
        return (bytes4(returnData), success);
    }

    // I can the same of callTransferDirectly with the signature
    function callTransferDirectlySig(address _someAddress, uint256 _amount) public returns(bytes4, bool){
        (bool success, bytes memory returnData) = address(this).call(
            // tra questa funzione e la precedente cambia solo la seguente chiamata
            abi.encodeWithSignature("transfer(address,uint256)", _someAddress, _amount) 
        );
        return (bytes4(returnData), success);
    }

    // Way to get a function selector from data sent into the call
    function getSelectorTwo() public view returns (bytes4 selector) {
        bytes memory functionCallData = abi.encodeWithSignature(
            "transfer(address,uint256)",
            address(this),
            123
        );
        selector = bytes4(
            bytes.concat(
                functionCallData[0],
                functionCallData[1],
                functionCallData[2],
                functionCallData[3]
            )
        );
    }

    // Another way to get data (hard coded)
    function getCallData() public view returns (bytes memory) {
        return abi.encodeWithSignature("transfer(address,uint256)", address(this), 123);
    }
    
    // This is another low level way to get function selector using assembly
        function getSelectorThree(bytes calldata functionCallData)
        public
        pure
        returns (bytes4 selector)
    {
        // offset is a special attribute of calldata
        assembly {
            selector := calldataload(functionCallData.offset)
        }
    }

    // Another way to get your selector with the "this" keyword
    function getSelectorFour() public pure returns (bytes4 selector) {
        return this.transfer.selector;
    }
}

contract CallFunctionWithoutContract {
    address public s_selectorsAndSignaturesAddress;

    constructor(address selectorsAndSignaturesAddress) {
        s_selectorsAndSignaturesAddress = selectorsAndSignaturesAddress;
    }

    function callTransferFunctionDirectlyThree(address someAddress, uint256 amount)
        public
        returns (bytes4, bool)
    {
        (bool success, bytes memory returnData) = s_selectorsAndSignaturesAddress.call(
            abi.encodeWithSignature("transfer(address,uint256)", someAddress, amount)
        );
        return (bytes4(returnData), success);
    }
}