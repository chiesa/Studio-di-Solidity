require("hardhat-deploy");
require('dotenv').config()

const { RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.8",
  networks:{
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    goerli:{
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfermation: 6,
    },
  },
};
