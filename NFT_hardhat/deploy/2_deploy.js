const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const imagesLocation = "./images/randomNFT"

const metadataTemplate = {
    name: "",
    description:"",
    image:"",
    /*
    attributes section is used to define stats, character or other information about our NFT
    Usally it stores on the blockchain whatever 
    */
    attributes:[
        {
            trait_type: "Something",
            value: 100
        }
    ]
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    /* SI RISCONTRA UN PROBLEMA NEL RITROVARE VRDCoordinatorV2Mock deployato in deploy_mocks.js
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE],
        })
    }
    */

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

    if (!developmentChains.includes(network.name)) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("----------------------------------------------------")
    
    await storeImages(imagesLocation)
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
    // Store Image in IPFS
    const {responses: imageUploadResponses, files} = await storeImages(imagesLocation)
    // Store the metadata in IPFS
    for(image in imageUploadResponses){
        //create metadata
        let tokenUri = {...metadataTemplate}
        //upload metadata
        tokenUri.name = files[image].replace(".png","")
        tokenUri.description = `an ${tokenUri.name} amazing!`
        tokenUri.image = `ipfs://${imageUploadResponses[image]}`
        console.log(`Uploading ${tokenUri.name}...`)
        //store JSON to Pinapa (fun in uploadToPinata.js)
        const metadetaUploadRes = await storeTokenUriMetadata(tokenUri)
        tokenUris.push(`ipfs://${metadetaUploadRes.IpfsHash}`)
    }
    console.log("Here the token URIs Uploaded:")
    console.log(tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "IPFSRandom", "main"]