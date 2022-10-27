require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require('dotenv').config()

const { RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // multiple solidity version:
  solidity: {
    compilers: [ {version: "0.8.8"}, {version: "0.6.6"} ],
  },
  defaultNetwork: "hardhat",
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
  gasReporter: {
    // impostando a true enable e importando COINMARKETCAP_API_KEY è possibile avere in gas-report.txt 
    // un idea chiara di quale sarà il costo delle gas fee e confrontare differenti soluzioni
    // nel nostro caso withdraw e cheapestWithdraw()
    // per far questo vediamo l'esito di gas-report.txt dopo l'esecuzione dei test (yarn hardhat test )
    enabled: false, //impostando a true
    outputFile: "gas-report.txt",
    //coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH",
    currency:"USD"
  },
  etherscan:{
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts:{
    deployer: {
      default: 0,
      31337: 1,  
    },
    user:{
      default: 1,
    }
  },
};
