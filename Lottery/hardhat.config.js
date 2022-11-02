require("hardhat-deploy");
require('dotenv').config()
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle")
require("solidity-coverage")
require("@nomiclabs/hardhat-etherscan");

const { RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.8",
  networks:{
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
      blockConfermations: 1,
    },
    goerli:{
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      saveDeployments: true,
      blockConfermations: 6,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  etherscan: {
    // PARAMETRO NECESSARIO PER LA VERIFICA
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
        goerli: ETHERSCAN_API_KEY,
    },
  },
  // questa sezione è di supporto hai test unit (con mock). Evita che il new Promise si blocchi per sempre in caso di nessuna risposta dall'evento
  mocha:{
    timeout: 1000000 // 1000sec max
  }
};
