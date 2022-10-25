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

const FUND_AMOUT = "100000000000000000"

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

    // after we define the array link in Pinata we can copy here. This the last step in the program
    let tokenUris = [
        'ipfs://QmdVo4VJLAcbVAvJyauCMRiT9eC94HdUwXwswWdpG1gz5i',
        'ipfs://QmVdJSrJDgRYPL7vB13y5xpA2UsRhMPFMUppJ1AXbJQVju',
        'ipfs://QmNVnozFTT58R8PkCiDNX8D1AFvbeBeMoKb2XiW3YDht66'
      ]
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock

    // get IPFS hashes of our images
    // is possible: 
    //      1. own IPFS node https://docs.ipfs.io
    //      2. Pinata https://www.pinata.cloud
    //      3. nft.storage https://nft.storage
    // in this example we use the second (Pinata):
    if(process.env.UPLOAD_TO_PINATA == "true"){ //after we set the tokenUris, we can change UPLOAD_TO_PINATA in false
        tokenUris = await handleTokenUris()
        console.log(tokenUris)
    }

    if (!developmentChains.includes(network.name)) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        console.log(vrfCoordinatorV2Address)
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId,FUND_AMOUT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("----------------------------------------------------")
    
    // after I store the Images I don't need anymore the next line because: I already upload in IPFS
    // await storeImages(imagesLocation)
    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId].callbackGasLimit,
        networkConfig[chainId].gasLane,
        tokenUris,
        networkConfig[chainId].mintFee,
    ]

    const randomIpfsNFT = await deploy("RandomIPFS",{
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfermations || 1,
    })
    log("----------------------------------------------------")

    // Verify the deployment
    
    if (developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(randomIpfsNFT.address, arguments)
    }
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