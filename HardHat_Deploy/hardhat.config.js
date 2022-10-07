require("@nomicfoundation/hardhat-toolbox");

// NOTA BENE: This private key is in an account test. NEVER USE THIS WALLET!!!
const metamask_private_key = `0x3cde4e40e57819692869f465371142131f56273f3d1ba8bb603f3f112bff7692`
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  networks: {
    goerli:{
      url: "https://eth-goerli.g.alchemy.com/v2/jL4u5lUJLOm6jts_HHtsG5ELI_E3jFAz",
      accounts: [metamask_private_key],
    },
    mainnet:{
      url:"https://mainnet.infura.io/v3/",
      accounts: [metamask_private_key]
    }
  }
};
