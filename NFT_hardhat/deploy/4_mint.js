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
    
    const randomIpfsNft = await ethers.getContract("RandomIPFS", deployer)
    const mintFee = await randomIpfsNft.getMintFee();
    /* VARI PROBLEMI SALTIAMO MOMENTANEAMENTE */

    //console.log(`Random NFT index0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)
    

    // Dynamic NFT
    const highValue = ethers.utils.parseEther("0")
    const dynamicNFT = await ethers.getContract("DynamicSVGNFT", deployer)
    const dynamicNFTTx = await dynamicNFT.mintNFT(highValue)
    await dynamicNFTTx.wait(1)
    console.log(`Dynamic NFT index0 tokenURI: ${await dynamicNFT.tokenURI(0)}`)
}

module.exports.tags = ["all","mint"]