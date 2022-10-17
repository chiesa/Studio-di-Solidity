require('dotenv').config();
require('@nomiclabs/hardhat-ethers'); 
require('@openzeppelin/hardhat-upgrades');
require("hardhat-deploy");

const { RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
     defaultNetwork: "goerli",
     networks: {
        goerli:{
          url: RPC_URL,
          accounts: [PRIVATE_KEY],
        },
     },
     solidity: {
         version: "0.8.7",
     },
     namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
      },
 }