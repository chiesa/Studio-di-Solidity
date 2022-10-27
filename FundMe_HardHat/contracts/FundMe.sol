// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe_NotOwner();

/** @title Fund Me contract
 *  @author Samuele
 *  @notice This contract is a contract to study solidity
 *  @dev this is a very simple contract (note for dev = developer)
 */
// solc è poi possibile generare la documentazione automaticamente
contract FundMe {
    using PriceConverter for uint256;

    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;
    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address public /* immutable */ i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;

    AggregatorV3Interface public priceFeed;
    
    modifier onlyOwner {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundMe_NotOwner();
        _;
    }

    constructor(address priceFeedAdd) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAdd);
    }

    /** 
     *  @notice This function funds this 
     */
     // se ci fossero si potrebbe aggiungere nel commento sopra:
     //@param noparamaters
     //@return noreturn 
    function fund() public payable {
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "You need to spend more ETH!");
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }
        
    function withdraw() public payable onlyOwner {
        for (uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        //cheaper because we dont work on funders but on a local array (fundersArr)
        address[] memory fundersArr = funders;
        // mapping can't be in memory
        for(uint256 funderIndex = 0; funderIndex < fundersArr.length; funderIndex++){
            address funder = fundersArr[funderIndex];
            addressToAmountFunded[funder] = 0;
            funders = new address[](0);
            (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
            require(callSuccess, "Call failed");
        }
    }


    /** @notice Gets the amount that an address has funded
     *  @param fundingAddress the address of the funder
     *  @return the amount funded
     */
    function getAddressToAmountFunded(address fundingAddress)
        public
        view
        returns (uint256)
    {
        return addressToAmountFunded[fundingAddress];
    }
} 