const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random IPFS NFT Unit Tests", function () {
          let randomIpfsNft, deployer, vrfCoordinatorV2Mock

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "IPFSRandom"])
              randomIpfsNft = await ethers.getContract("RandomIPFS")
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
          })

          describe("constructor", () => {
              it("sets starting values correctly", async function () {
                  const NFTUri = await randomIpfsNft.getNFTTokenUri(0)
                  assert(NFTUri.includes("ipfs://"))
              })
          })

          describe("requestNft", () => {
              it("fails if payment isn't sent with the request", async function () {
                  await expect(randomIpfsNft.mintNFT()).to.be.reverted
              })
              it("reverts if payment amount is less than the mint fee", async function () {
                  const fee = await randomIpfsNft.getMintFee()
                  await expect(
                      randomIpfsNft.mintNFT({
                          value: fee.sub(ethers.utils.parseEther("0.001")),
                      })
                  ).to.be.reverted
              })
              it("emits an event and kicks off a random word request", async function () {
                  const fee = await randomIpfsNft.getMintFee()
                  console.log(fee.add(ethers.utils.parseEther("0.001")).toString())
                  await expect(randomIpfsNft.mintNFT({ value: fee.add(ethers.utils.parseEther("0.001")) })).to.emit(
                      randomIpfsNft,
                      "NFTRequest"
                  )
              })
          })

          describe("fulfillRandomWords", () => {
            it("mints NFT after random number is returned", async function () {
                console.log("1")
                await new Promise(async (resolve, reject) => {

                    console.log("1")
                    try {
                        const fee = await randomIpfsNft.getMintFee()
                        console.log("1")

                        const requestNftResponse = await randomIpfsNft.mintNFT({ value: fee.add(ethers.utils.parseEther("0.001")) })
                        console.log("1")

                        const requestNftReceipt = await requestNftResponse.wait(1)
                        console.log("1")
                        console.log(requestNftReceipt.events[1].args.requestId)
                        await vrfCoordinatorV2Mock.fulfillRandomWords(
                            requestNftReceipt.events[1].args.requestId,
                            randomIpfsNft.address
                        )
                        console.log("1")

                    } catch (e) {
                        console.log(e)
                        reject(e)
                    }

                    randomIpfsNft.once("NftMinted", async () => {
                        try {
                            //const tokenUri = await randomIpfsNft.tokenURI("0")
                            //const tokenCounter = await randomIpfsNft.getTokenCounter()
                            //assert.equal(tokenUri.toString().includes("ipfs://"), true)
                            //assert.equal(tokenCounter.toString(), "1")
                            //resolve()
                        } catch (e) {
                            //console.log(e)
                            //reject(e)
                        }
                    })
                 
                
                    
                })
            })
        })
          describe("getType", () => {
              it("should return pug if moddedRng < 10", async function () {
                  const expectedValue = await randomIpfsNft.getType(7)
                  assert.equal(0, expectedValue)
              })
              it("should return shiba-inu if moddedRng is between 10 - 39", async function () {
                  const expectedValue = await randomIpfsNft.getType(21)
                  assert.equal(1, expectedValue)
              })
              it("should return st. bernard if moddedRng is between 40 - 99", async function () {
                  const expectedValue = await randomIpfsNft.getType(77)
                  assert.equal(2, expectedValue)
              })
              it("should revert if moddedRng > 99", async function () {
                  await expect(randomIpfsNft.getType(100)).to.be.revertedWith(
                      "RangeOutOfRanges"
                  )
              })
          })
      })