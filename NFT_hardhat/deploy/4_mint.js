const {ethers, network} = require("hardhat");
const { resolve } = require("path");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function({ getNamedAccounts }) {
    const { deployer } = await getNamedAccounts()

    // Basic NFT
    const BasicNFT = await ethers.getContract("BasicNFT", deployer)
    const BasicNFTTx = await BasicNFT.mintNft();
    await BasicNFTTx.wait(1)
    console.log(`Basic NFT index0 has tokenURI: ${await BasicNFT.tokenURI(0)}`)

    // Random NFT
    /*
    const randomIpfsNft = await ethers.getContract("RandomIPFS", deployer)
    const mintFee = await randomIpfsNft.getMintFee();

    await new Promise(async (resolve, reject) => {
        setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000) // 5 minute timeout time
        // setup listener for our event
        randomIpfsNft.once("NftMinted", async () => {
            resolve()
        })
    })
    const RandomFeeTx = await randomIpfsNft.mintNFT({value: mintFee.toString()})
    const RandomFeeTxRec = await RandomFeeTx.wait(1)
    if(developmentChains.includes(network.name)){
        const requestID = RandomFeeTxRec.events[1].args.requestId.toString
        const vrfCoordinatorV2 = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        await vrfCoordinatorV2.fulfillRandomWords(requestID, randomIpfsNft.address)

    }
    console.log(`Random NFT index0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)
    */

    // Dynamic NFT
    const highValue = ethers.utils.parseEther("0")
    const dynamicNFT = await ethers.getContract("DynamicSVGNFT", deployer)
    const dynamicNFTTx = await dynamicNFT.mintNFT(highValue)
    await dynamicNFTTx.wait(1)
    console.log(`Dynamic NFT index0 tokenURI: ${await dynamicNFT.tokenURI(0)}`)
}

module.exports.tags = ["all","mint","main"]