//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Encoding{
    // cheatsheet on solidity doc: globally avaible methods and variables
    // it's possible read the evm codes => linguaggio macchina di EVM: www.evm.codes

    // ENCODE FUNCTIONS

    // combine 2 string together
    function combineStrings() public pure returns(string memory){
        // encodePacked returns Bytes and then cast to string
        return string(abi.encodePacked("Hi mom","Miss you"));
    }

    // after 0.8.12 is possible do: string.concat(stringA, stringB)
    
    // encode how the computer understand #1
    function encodeNumber() public pure returns(bytes memory){
        bytes memory number = abi.encode(1);
        return number;
    }
    // encode how the computer understand "my strin g"
    function encodeString() public pure returns(bytes memory){
        bytes memory someString = abi.encode("my string");
        return someString;
    }
    // encodePacked is cheaper (less gas) and return a short result
    function encodeStringPacked() public pure returns(bytes memory){
        bytes memory someString = abi.encodePacked("some string");
        return someString;
    }
    // the follow code give the some result that the previous one
    function encodeStringBytes() public pure returns(bytes memory){
        bytes memory someString = bytes("some string");
        return someString;
    }

    // encode multi string together
    function multiEncode() public pure returns(bytes memory){
        bytes memory someString = abi.encode("my string","my sencond strings");
        return someString;
    }

    // endond multi string and return the pack version
    function multiEncodePack() public pure returns(bytes memory){
        bytes memory someString = abi.encodePacked("my string","my sencond strings");
        return someString;
    }


    // DECODE FUNCTIONS

    // decode the bytes create with encodeString() in string
    function decodeString() public pure returns(string memory){
        string memory someString = abi.decode(encodeString(),(string));
        return someString;
    }

    // decode multi strings in bytes create with multiEncode() in string
    function multiDecode() public pure returns(string memory, string memory){
        (string memory someString, string memory someOtherString) = abi.decode(multiEncode(),(string, string));
        return (someString, someOtherString);
    }

    // IT DOESNT WORK BECAUSE IT'S PACK
    function multiDecodePacked() public pure returns(string memory){
        string memory someString = abi.decode(multiEncodePack(), (string));
        return someString;
    }

    // is the decode of multiEcondePach() with a cast
    function multiStringCastPack() public pure returns(string memory){
        string memory someString = string(multiEncodePack());
        return someString;
    }


    
}