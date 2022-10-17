//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNFT is ERC721{
    string public constant TOKEN_URI = "http://bafybeieoy22lqbdbrhcqziqqn5efsohte4u4g2lidz3cvecfl3yy2j3peu.ipfs.localhost:8080/?filename=SimpleNFT.json";
    uint256 private tokenId;
    constructor() ERC721("First","newNFT"){
        tokenId = 0;
    }

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender,tokenId,"");
        tokenId+=tokenId;
        return tokenId;
    }

    function tokenURI(/*uint256 _tokenId*/) public view /*override*/ returns(string memory){
        // require(_exists(tokenId))
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns(uint256){
        return tokenId;
    }

}