//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";

contract DynamicSVGNFT is ERC721{
    //FUNCTION:
    // mint: for mint NFT
    // store: to store SVG information somewhere
    // logic for show different image (if ETH price > X)

    uint256 private tokenCounter;
    string private lowImageURI;
    string private highImageURI;
    string private constant prefix_base64Enc = "data:image/svg+xml;base64,";
    AggregatorV3Interface internal immutable priceFeed;
    mapping(uint256=>int256) public tokenIdtoTrigger;

    event CreateNFT(uint256 indexed tokenId, int256 highValue);

    constructor(address priceFeedAddr, string memory _lowSvg, string memory _highSvg) ERC721("Dynamic SVG NFT", "DNS"){
        tokenCounter = 0;
        lowImageURI = svgToTokenUri(_lowSvg);
        highImageURI = svgToTokenUri(_highSvg);
        priceFeed = AggregatorV3Interface(priceFeedAddr);
    }

    // trigger is the price at the image will change
    function mintNFT(int _trigger) public {
        tokenIdtoTrigger[tokenCounter]=_trigger;
        _safeMint(msg.sender, tokenCounter);
        tokenCounter = tokenCounter+1;
        emit CreateNFT(tokenCounter, _trigger);
    }

    // on chain convertion SVG in TokenURI
    // first I convert the SVG in base64 (it's possible use the URL)
    // view the SVG after the encoding in browser: data:image/svg+hml;base64,[encoding_SVG]

    function svgToTokenUri(string memory svg) public pure returns(string memory){
        string memory svgEncode = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(prefix_base64Enc,svgEncode));
    }

    // creation on the prefix for the imageURI
    function _baseURI() internal pure override returns(string memory){
        // the prefix for imgare: data:image/svg+xml;base64,
        // the prefix for base64: data:application/json;base64,
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view virtual override returns(string memory){
        // function _exist is from ERC721
        require(_exists(tokenId), "non esiste il tocken per il quale viene fatta la richiesta di URI");

        ( , int256 price, , , ) = priceFeed.latestRoundData();
        string memory imageURI = lowImageURI;
        if( price >= tokenIdtoTrigger[tokenId] ){
            imageURI = highImageURI;
        }

        // return the string: append _baseURI + the base64 encode of the concatenation of the data relative the image
        return  string(
            abi.encodePacked(
                // baseURI + base64 image
                _baseURI(),
                // encode base64 image
                Base64.encode(
                    // encode bytes image
                    bytes(
                        // concatenation of the image component
                        abi.encodePacked(
                            '{"name":"', name(), 
                            '", "description":"an NFT that change on based on the Chainlink feed,"',
                            '"attributes": [{"trait_type":"coolness","value":100}], "image":"', imageURI,'"}')
                    )
                )
            )
        );
    }

        function getLowSVG() public view returns (string memory) {
        return lowImageURI;
    }

    function getHighSVG() public view returns (string memory) {
        return highImageURI;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return priceFeed;
    }

    function getTokenCounter() public view returns (uint256) {
        return tokenCounter;
    }
}