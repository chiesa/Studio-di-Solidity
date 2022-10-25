// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

error RangeOutOfRanges();
error TransfertFailed();

contract RandomIPFS is VRFConsumerBaseV2, ERC721URIStorage{
    // Type Declaration
    enum Type{
        NFT1,
        NFT2,
        NFT3
    }

    // create mint a random NFT with different level of rarable
    // for do that we use Chainlink and random number
    address owner;
    uint256 amountEarn;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionID;
    uint32 private immutable i_callbackGasLimit;
    bytes32 private immutable i_gasLane;
    uint16 private constant RESQUEST_CONF = 2;
    uint32 private constant NUM_WORDS = 1;

    // VRF Helpers
    mapping(uint256=>address) public s_requestID2Sender;

    // NFT Variable
    uint256 public tokenCounter;
    uint256 internal constant MAX_CHANGE = 100;
    string[] internal NFTTokenUris;
    uint256 internal immutable mintPrice;

    // events
    event NFTRequest(uint requestId, address minter);
    event NFTMinted(Type NFTType, address minter);

    constructor(
        address VRFCoordinatorV2, 
        uint64 subscriptionID, 
        uint32 callbackGasLimit, 
        bytes32 gasLane,
        string[3] memory _NFTTokenUris,
        uint256 _mintPrice
    ) 
        VRFConsumerBaseV2(VRFCoordinatorV2)
        ERC721("Random", "rNFT")
    {
        owner = msg.sender;
        i_vrfCoordinator = VRFCoordinatorV2Interface(VRFCoordinatorV2);
        i_subscriptionID = subscriptionID;
        i_callbackGasLimit = callbackGasLimit;
        i_gasLane = gasLane;
        NFTTokenUris = _NFTTokenUris;
        mintPrice = _mintPrice;
    }

    // user have to pay to mint an NFT
    // check payment
    modifier userPay (uint256 amount) {
        require(amount >= mintPrice*1e18, "quantitativo inviato non sufficiente al pagamento");
        _;
    }

    // check owner contract
    modifier checkOwner {
        require(owner==msg.sender, "Non sei il creatore degli NFT");
        _;
    }

    function mintNFT() public payable userPay(msg.value) returns(uint256 requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(i_gasLane, i_subscriptionID, RESQUEST_CONF, i_callbackGasLimit, NUM_WORDS);
        s_requestID2Sender[requestId] = msg.sender;
        emit NFTRequest(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        // defination the parameter to create the NFT
        address NFTowner = s_requestID2Sender[requestId];
        uint256 tokenId = tokenCounter;

        // defintation the rarable
        uint256 nodded = randomWords[0] % MAX_CHANGE;
        Type NFTType = getType(nodded);

        //update tokenConter
        tokenCounter = tokenCounter + 1;

        // mint the NFT
        _safeMint(NFTowner, tokenId);
        // set token URI
        _setTokenURI(tokenId, NFTTokenUris[uint256(NFTType)]); 

        emit NFTMinted(NFTType, NFTowner);
    }

    function getType(uint256 modded) public pure returns(Type) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        for(uint256 i = 0; i <= chanceArray.length; i++){
            if(modded >= cumulativeSum && modded < cumulativeSum + chanceArray[i]){
                return Type(i);
            }
            cumulativeSum += chanceArray[i];
        }
        revert RangeOutOfRanges();
    }
 
    function getChanceArray() public pure returns(uint256[3] memory){
        // 3 differt level of rareble: 0-10 most rare, 10-30 and 30-100
        return [10,30,MAX_CHANGE];
    }

    function withdraw() public payable checkOwner{
        uint256 amount = address(this).balance;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        if(!success){
            revert TransfertFailed();
        }
    }


    // GET FUNCTION
    function getMintFee() public view returns(uint256) {
        return mintPrice;
    }

    function getNFTTokenUri(uint256 index) public view returns(string memory){
        return NFTTokenUris[index];
    }

    function getTokenCounter() public view returns(uint256){
        return tokenCounter;
    }
}