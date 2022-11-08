// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
// the  sequent lib have _setTokenURI()
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

error RandomIPFS__InvalidAmount();
error RandomIPFS__InvalidRandomNumber();

contract RandomIPFS is VRFConsumerBaseV2, ERC721URIStorage{
    // Type Declaration
    enum TypeNFT{ NFT1, NFT2, NFT3 }

    // Variable
    address private immutable i_owner;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint256 private immutable i_priceMint;

    // VRF Helpers map(requestId->owner)
    mapping ( uint256 => address ) RequestNFT;

    // NFT Variable
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONF = 1;
    uint32 private constant NUM_WORD = 1;
    uint256 private constant MAX_CHANCE = 100;
    uint256 private s_tokenConter;
    string[] private s_tokenURI;

    // events
    event NFTRequest(uint requestId, address minter);
    event NFTMinted(TypeNFT NFTType, address minter);
        
    constructor(
        address _VRFCoordinatorV2,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit,        
        bytes32 _gasLane,
        string[] memory _tokenURI,
        uint256 _priceMint
    )
        VRFConsumerBaseV2(_VRFCoordinatorV2)
        ERC721("Random", "rNFT")
    {
        i_vrfCoordinator = VRFCoordinatorV2Interface(_VRFCoordinatorV2);
        i_priceMint = _priceMint;
        i_subscriptionId = _subscriptionId;
        i_gasLane = _gasLane;
        i_callbackGasLimit = _callbackGasLimit;
        s_tokenConter = 0;
        i_owner = msg.sender;
        s_tokenURI = _tokenURI;
    }

    // check owner contract
    modifier checkOwner {
        require(i_owner==msg.sender, "Non sei il creatore degli NFT");
        _;
    }

    // research random value (requestId with call to fulfillRandomWords) and insert in mapping 
    function mintNFT() public payable returns(uint256 requestId) {
        if( msg.value < i_priceMint ){
            revert RandomIPFS__InvalidAmount();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONF,
            i_callbackGasLimit,
            NUM_WORD
        );
        RequestNFT[requestId] = msg.sender;
        emit NFTRequest(requestId,msg.sender);
    }

        function fulfillRandomWords(uint256 requestId, uint256[] memory /*randomWords*/) internal override {
        // defination the parameter to create the NFT 
        address owner = RequestNFT[requestId];
        uint tokenId = s_tokenConter;

        // definition type
        TypeNFT NFTCreate = getType( (requestId % MAX_CHANCE) );

        // update tokenConter
        s_tokenConter += 1;

        // mint the NFT
        _safeMint(owner, tokenId);
        // set token URI
        _setTokenURI(tokenId,s_tokenURI[uint256(NFTCreate)]);

        emit NFTMinted(NFTCreate, owner); 
    }

    function getType(uint256 modded) public pure returns(TypeNFT) {
        uint baseNum = 0;
        uint[3] memory topNum = getChanceArray();
        for(uint i = 0; i < topNum.length; i++){
            if( modded >= baseNum && modded < topNum[i]){
                return TypeNFT(i);
            }
            baseNum = topNum[i];
        }
        // errore se non trovato
        revert RandomIPFS__InvalidRandomNumber();
    }
 
    function getChanceArray() public pure returns(uint256[3] memory){
        // 3 differt level of rareble: 0-10 most rare, 10-30 and 30-100
        return [10,30,MAX_CHANCE];
    }

    function withdraw() public payable checkOwner{
        // definizione bilancio
        uint256 balance = address(this).balance;
        // call per il trasgerimento
        (bool success,)= i_owner.call{value: balance}("");
        // se non ha successo errore
        if(!success){
            revert();
        }
    }


    // GET FUNCTION
    function getMintFee() public view returns(uint256) {
        return i_priceMint;
    }

    function getNFTTokenUri(uint256 index) public view returns(string memory){
        return s_tokenURI[index];
    }

    function getTokenCounter() public view returns(uint256){
        return s_tokenConter;
    }
}