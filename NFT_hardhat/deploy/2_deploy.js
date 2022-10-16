const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const {storeImages} = require("../utils/uploadToPinata")

const imagesLocation = "./images/randomNFT"

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
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

    log(network.name)
    log(await ethers.getContract("VRFCoordinatorV2Mock"))
    if(developmentChains.includes(network.name)){
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        console.log(vrfCoordinatorV2Mock)
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSunscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.event[0].args.subId
    } else {
        //vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId 
    }

    log("----------------------------------------------------")
    
    await storeImages[imagesLocation]
    const args = [
        vrfCoordinatorV2Address, 
        subscriptionId, 
        networkConfig[chainId].gasLane, 
        networkConfig[chainId].callbackGasLimit,
        networkConfig[chainId].mintFee
    ]
}

async function handleTokenUris(){
    tokenUris = []
    // 2 step
    // store image in IPFS
    // store metadata in IPFS


    return tokenUris
}

module.exports.tags = ["all", "IPFSRandom", "main"]