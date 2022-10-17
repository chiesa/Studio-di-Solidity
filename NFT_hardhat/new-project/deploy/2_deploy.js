const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig, DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const {storeImages} = require("../utils/uploadToPinata")

const imagesLocation = "./images/randomNFT"
const BASE_FEE = ethers.utils.parseEther("0.25"); 
const GAS_PRICE = 1e9  // 0.000000001 per gas

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (chainId == 31337) {
        /*log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE],
        })*/
    }

    let tokenUris
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock

    // get IPFS hashes of our images
    // is possible: 
    //      1. own IPFS node https://docs.ipfs.io
    //      2. Pinata https://www.pinata.cloud
    //      3. nft.storage https://nft.storage
    // in this example we use the second (Pinata):
    if(process.env.UPLOAD_TO_PINATA == "true"){
        tokenUris = await handleTokenUris()
    }

    if(developmentChains.includes(network.name)){
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()

        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
    } else {
        //vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId 
    }

    log("----------------------------------------------------")
    
    await storeImages[imagesLocation]
    /*const args = [
        vrfCoordinatorV2Address, 
        subscriptionId, 
        networkConfig[chainId].gasLane, 
        networkConfig[chainId].callbackGasLimit,
        networkConfig[chainId].mintFee
    ]*/
}

async function handleTokenUris(){
    tokenUris = []
    // 2 step
    // store image in IPFS
    // store metadata in IPFS


    return tokenUris
}

module.exports.tags = ["all", "IPFSRandom", "main"]