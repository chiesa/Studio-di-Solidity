//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFT_marketplace is ReentrancyGuard{
    // project:
    //  1. `listItem`: List NFTs on the marketplace
    //  2. `buyItem`: List NFTs on th marketplace
    //  3. `cancellItem`: Cancel a listing
    //  4. `updateListing`: Update Price
    //  5. `withdrawProceeds`: Withdraw payment for my bought NFTs
    
    // NFT Contract address -> (NFT TokenID) -> price
    mapping(address => mapping(uint =>  price)) mappingNFT;
    struct price{
        uint price;
        address seller;
    }

    // seller address -> earned
    mapping(address => uint) private s_proceeds;

    error Invalid_price();
    error NotApprovalForMarketPlace();

    event listing(address NFcontract, uint TokenID, price); // Event
    event changeOwner(string message);
    event NFTSold(address seller, address buyer, address nft_address, uint _tokenId, uint price);
    event itemCancel(address seller, address nft_address, uint _tokenId);
    event listUpdate(address seller, address nft_address, uint _tokenId, uint new_price);

    address owner;
    constructor(){
        owner = msg.sender;
    }

    modifier NotList(address nft_address, uint _tokenId, uint _price){
        // if the price isnt > 0 => get an error
        if(_price<=0){
            revert Invalid_price();
        }
        // if the NFT is already listed -> error
        require((mappingNFT[nft_address][_tokenId]).price>=0, "Il prodotto e' gia' listato");
        _;
    }

    //check if NFT is already listed
    modifier AlreadyList(address nft_address, uint _tokenId){
        uint _price = mappingNFT[nft_address][_tokenId].price*1e18;
        require(_price<=0, "NFT isn't listed");
        _;
    }

    // check if the NFT owner is how call the function
    modifier NFTOwner(address nft_address, uint _tokenId, address sender){         
        IERC721  nft = IERC721(nft_address);

        // require the NTF's owner made the operation => check: owner == seller
        address NFTowner = nft.ownerOf(_tokenId);
        address seller = mappingNFT[nft_address][_tokenId].seller;
        if(NFTowner != seller || NFTowner != sender){
            emit changeOwner("you are not the owner of the NFT");
        }
        _;
    }

    //  1. `listItem`: List NFTs on the marketplace
    /*
     * @title listItem
     * @notice Method for listing NFT item on marketplace
     * @param nft_address
     * @param _tokenId
     * @param _price
     */
    function listItem(address nft_address, uint _tokenId, uint _price) 
                    external NotList(nft_address, _tokenId, _price){ 
        // approvale of the owner to sell the NFT without move the NFT
        IERC721 nft = IERC721(nft_address);
        // if owner of NFT != msg.sender => error
        require( nft.ownerOf(_tokenId) != msg.sender, "Not NFT ownership");
 
        if(nft.getApproved(_tokenId) != address(this)){
            revert NotApprovalForMarketPlace();
        }
        // save the NFT
        mappingNFT[msg.sender][_tokenId] = price(_price,msg.sender);
        emit listing(nft_address,_tokenId,mappingNFT[msg.sender][_tokenId]);
    }

    // EVITARE RISCHIO DI REENTRANCYGUARD
    // per fare questo esistono 2 best practies: 
        //1) before call external contract do all the state change before 
        //2) usare sistema di reentrancyguard (con lib esterne o con una funzione come lock) 
    // impossible recall the function if the function is already called
    // possibile use the liberary ReentrancyGuard.sol
    bool locked;
    modifier LockFunction(){
        require(locked, "Impossible call the function");
        locked = true; 
        _;
        locked = false;
    }
            

    //  2. `buyItem`: List NFTs on th marketplace
    /*
     * @title buyItem
     * @notice Method for buy NFT item on marketplace
     * @param nft_address
     * @param _tokenId
     */
    function buyItem(address nft_address, uint _tokenId) external payable LockFunction{
        // check if the nft is listed
        // check ETH sent and price are equal
        uint _price = mappingNFT[nft_address][_tokenId].price*1e18;
        require(_price<=0,"NFT not listed");
        require(msg.value < _price, "invalid money sent");
        

        // transfert money & nft
        IERC721  nft = IERC721(nft_address);

        // check: actually nft owner == seller
        address NFTowner = nft.ownerOf(_tokenId);
        address seller = mappingNFT[nft_address][_tokenId].seller;
        if(NFTowner != seller){
            emit changeOwner("The owner of the product is change");
        }

        // log amount earn from a seller and after nft transfert withdraw money 
        s_proceeds[seller] = s_proceeds[seller] + msg.value;
        // delete NFT from mapping list NFT => NOTE: delete before nft transfert (1. point REENTRANCYGUARD)
        delete(mappingNFT[nft_address][_tokenId]);

        //send the nft and ETH
        nft.safeTransferFrom(seller, msg.sender, msg.value);

        // directly trasfert money 
        // payable(msg.sender).transfer(msg.value);
 
        // BUT in this case we have the withdraw money 
        // event operation
        emit NFTSold(seller, msg.sender, nft_address, _tokenId, _price);
    }

    //  3. `cancellItem`: Cancel am item listing
        // require item is listed
    /*
     * @title cancellItem
     * @notice Method for cancell a NFT listing on marketplace
     * @param nft_address
     * @param _tokenId
     */
   function cancellItem(address nft_address, uint _tokenId) external AlreadyList(nft_address, _tokenId) NFTOwner(nft_address, _tokenId, msg.sender){
        
       // delisted item
       delete(mappingNFT[nft_address][_tokenId]);

        // event itemCancel
        emit itemCancel(msg.sender, nft_address, _tokenId);
    }


    //  4. `updateListing`: Update Price
    // check owner of the NFT
    // check NFT is listed
    // update the price and emit the change 
    /*
     * @title updateListing
     * @notice Method for update NFT price on marketplace
     * @param nft_address
     * @param _tokenId
     * @param new_price
     */
    function updateListing(address nft_address, uint _tokenId, uint new_price) external AlreadyList(nft_address, _tokenId) NFTOwner(nft_address, _tokenId, msg.sender){
        // change price
        mappingNFT[nft_address][_tokenId].price = new_price;
        //emit notification
        emit listUpdate(msg.sender, nft_address, _tokenId, new_price);
    }

    //  5. `withdrawProceeds`: Withdraw payment for my bought NFTs
    // lock the operation (nonReentrant())
    // check the balance isn't 0 
    // send the money 
    // set balance to 0
    /*
     * @title withdrawProceeds
     * @notice Method for whitdraw token from marketplace
     */
    function withdrawProceeds() payable external ReentrancyGuard.nonReentrant(){
        uint amount = s_proceeds[msg.sender];
        require(amount <= 0, "Not budget to whitdraw");
        delete(s_proceeds[msg.sender]);
        // transfert non ottimale meglio call
        //payable(msg.sender).transfer(amount);
        (bool success,) = payable(msg.sender).call{value:msg.value}("");
        require(success, "Failure ETH not sent");
    }

    ////// GETTING FUNCTION /////// @title A title that should describe the contract/interface
}