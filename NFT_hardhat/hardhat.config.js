require('dotenv').config();
//require("@nomicfoundation/hardhat-toolbox"); 
require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');
require("hardhat-deploy");
require("@nomiclabs/hardhat-waffle");


const { RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
     defaultNetwork: "hardhat",
     networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        goerli:{
          url: RPC_URL,
          accounts: [PRIVATE_KEY],
          chainId: 5,
          blockConfirmations: 6,
        },
     },
     solidity: {
      compilers: [
          {
              version: "0.8.7",
          },
          {
              version: "0.6.6",
          },
      ],
     },
     namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
     },
     etherscan: {
        apiKey: {
          goerli: ETHERSCAN_API_KEY
        }
     },
     mocha: {
        timeout: 100000000
      },
 }