const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig, DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")



module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUsdPriceAdd

    if(developmentChains.includes(network.name)){
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
        log(EthUsdAggregator.address)
        ethUsdPriceAdd = EthUsdAggregator.address
    } else {
        ethUsdPriceAdd = networkConfig[chainId].ethUsdPriceFeed
    }

    const _lowSvg = await fs.readFileSync("./images/dynamicNFT/sad.svg",{ encoding: "utf8"})
    const _highSvg = await fs.readFileSync("./images/dynamicNFT/happy.svg",{ encoding: "utf8"})

    args = [ethUsdPriceAdd, _lowSvg, _highSvg]
    const dynamicSvgNft = await deploy("DynamicSVGNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfermations || 1,
    })

    log("----------------------------------------------------")
    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(dynamicSvgNft.address, args)
    }
}

module.exports.tags = ["all","dynamicsvg","main"]