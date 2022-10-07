# Deploy project with HARDHAT

We're creating a new simple hardhat project and we will deploy on Goerli Test Network and on the mainnet (using Metamask). We work on hardhat.config.js

Starting with create a simple hardhat project:
```shell
[npm install hardhat]
npx hardhat
```

## Goerli 
Step by step:
1. Metamask (login) > select network goery
    Goerli:
        Network Name: Rinkeby Test Network
        New RPC URL: https://goerli.infura.io/v3/
        ChainID: 5
        Symbol: GoerliETH
        Block Explorer URL: https://goerli.etherscan.io/

2. add GoerliETH => https://goerlifaucet.com/ > login > insert address > send

3. modify hardhat.config.js adding the network:
- generic:
``` js
networks: {
    network_name:{
      url: "net access URL",
      acconts: ['0x________private_key________"']
    }
  }
```
- specific:
https://dashboard.alchemy.com/ > Create App > Chain "Etherium", network "goerli" > Create App > View Key & copy (https://eth-goerli.g.alchemy.com/v2/jL4u5lUJLOm6jts_HHtsG5ELI_E3jFAz)
[ OTHER TESTNET or mainnet infura.io> Create new key>Select Network + inster name > create > copy Key 39267b431c964e8b94b24a1002643db5 ]
``` js
networks: {
    goerli:{
      url: "https://eth-goerli.g.alchemy.com/v2/jL4u5lUJLOm6jts_HHtsG5ELI_E3jFAz",
      acconts: ['0x________private_key________"']
    }
  }
```

4. compile:
```shell
npx hardhat run scripts/deploy.js --network goerli
```

## mainnet
As the test net we need to follow step 3 and 4:
3. modify hardhat.config.js adding the network: (we need to create a new access to the mainnet with dashboard.alchemy.com/ or infura.io or others)
``` js
networks: {
    mainnet:{
      url: "net access URL",
      acconts: ['0x________private_key________"']
    }
  }
```
4. compile:
```shell
npx hardhat run scripts/deploy.js --network mainnet
```

## Verify and Publish
[NON E' STATO FATTO NEI FILE RIPORTARI]
install:
https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html
```shell
npm install --save-dev @nomiclabs/hardhat-etherscan
```

Add this to hardhat.config.js
```js
require("@nomiclabs/hardhat-etherscan");
```

Add Etherscan API Key: https://etherscan.io/
```js
module.exports = {
  networks: {
    mainnet: { ... }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "YOUR_ETHERSCAN_API_KEY"
  }
};
```

Verify contract:
```shell
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```