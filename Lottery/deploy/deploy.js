const { networkConfig, developmentChain } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")
//const { ethers } = require("ethers");
const { verify } = require("../utils/verify")

const FUND_AMOUNT = ethers.utils.parseEther("1")

module.exports = async ({getNamedAccounts, deployments}) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const  _entraceAmount = ethers.utils.parseEther("0.1")
    const gasLine = networkConfig[chainId]["gasLine"]
    let subscriptionId
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]
    let VRFCoordinatorV2Address, VRFCoordinatorV2

    if( developmentChain.includes(network.name) ){
        VRFCoordinatorV2 = await ethers.getContract("VRFCoordinatorV2Mock")
        VRFCoordinatorV2Address = VRFCoordinatorV2.address
        const transactionResponde = await VRFCoordinatorV2.createSubscription()
        const Receipt = await transactionResponde.wait()
        subscriptionId = Receipt.events[0].args.subId
        await VRFCoordinatorV2.fundSubscription(subscriptionId, FUND_AMOUNT)

    } else {
        VRFCoordinatorV2Address = networkConfig[chainId]["VRFCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    args = [VRFCoordinatorV2Address, _entraceAmount, gasLine, subscriptionId, callbackGasLimit, interval]
    
    const Lottery = await deploy("Lottery", {
        from: deployer, 
        args: args,
        log: true,
        waitConfermations: network.config.blockConfermations || 1
    })
    log(`Lottery deployed at ${Lottery.address}, and args ${args}`)
    

    if( !developmentChain.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        // verify from ../utils/verify.js
        log("Verifying")
        await verify(Lottery.address, args)
    }
    log("---------------------------------------------------------------------")
}

module.exports.tags = ["all", "lottery", "main"]

