
const { networkConfig, developmentChain } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

/*
function deployFunc(hre){
    hre.getNamedAccounts()
    hre.deployments()
}

module.export.default = deployFunc

SAME TO:

module.exports = async ({getNamedAccounts, deployments}) => {
}
*/

module.exports = async ({getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // for localhost or hardhat deploy USING A MOCK

    // selection address price ETH in base the network
    // for do that I use "helper-hardhat-config.js"
    // const ethUsdAddress = networkConfig[chainId]["ethUsdPriceFeed"] // it's work correct if I wanna add mocks 
    // if the contract doesn't exist (cioè non esiste ethUsdAddress),  use local testing
    let ethUsdAddress
    if( developmentChain.includes(network.name) ){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator") // si può togliere deployments e aggiungere get dopo log in: const { deploy, log } = deployments
        ethUsdAddress = ethUsdAggregator.address
    } else {
        ethUsdAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    log(`-------------------DEPLOYER: ${deployer}--------------------`)
    const args = ethUsdAddress
    // deploy(contractName, {..})
    const fundMe = await deploy("FundMe", {
        from: deployer, 
        args: [args],
        log: true,
        waitConfermations: network.config.blockConfermation || 1,
    })
    log(`FundMe deployed at ${fundMe.address}, and args ${args}`)

    if( !developmentChain.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        // verify from ../utils/verify.js
        verify(fundMe.address, [args])
    }
    log("---------------------------------------------------------------------")
}

module.exports.tags = ["all", "fundMe"]