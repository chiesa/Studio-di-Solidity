const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChain, networkConfig } = require("../../helper-hardhat-config")

developmentChain.includes(network.name)
    ? describe.skip
    : describe("Lottery Staging Tests", () => {
        let lottery, lotteryEntranceFee, deployer
        const chainId = network.config.chainId

        beforeEach( async () => {
            deployer = (await getNamedAccounts()).deployer
            lottery = await ethers.getContract("Lottery", deployer)
            lotteryEntranceFee = await lottery.getEntranceAmount()
        })

        describe("fulfillRandomWords", () => {
            it("work with live ChainLink keeper and Chainlink VRF, we get a random winner", async () => {
                // definizione del momento di partenza della lotteria
                console.log("Setting up test...")
                const stratingTimeStamp = await lottery.getLatestTimeStamp()
                const accounts = await ethers.getSigners()

                console.log("Setting up Listener...")
                // setup listener before set the lottery
                await new Promise( async (res,rej) => {
                    lottery.once("winnerPick", async () => {
                        console.log("Found the event: winnerPick!")
                        // if it take too time we wanna the error (timeout settato in hardhat.condig.js nella sezione mocha)
                        try{
                            const recentWinner = await lottery.getRecentWinner()
                            const lotteryState = await lottery.getLotteryState()
                            const winBalance = await accounts[0].getBalance()
                            const endingTimeStamp = await lottery.getLatestTimeStamp()
                            console.log("ARRIVO")

                            // mi aspetto non ci sia nessuno nella lotteria in quanto è appena consclusa e il valore deve essere settato a 0
                            await expect(lottery.getPlayer(0)).to.be.reverted
                            console.log("ARRIVO")

                            assert.equal(recentWinner, accounts[0].address)

                            console.log("ARRIVO")
                            assert.equal(lotteryState.toString(), "0")

                            console.log("ARRIVO8")
                            assert.equal(winEndingBalance.toString(), winStartingBalance.add(lotteryEntranceFee).toString())

                            console.log("ARRIVO")
                            assert(endingTimeStamp > stratingTimeStamp)
                            console.log("ARRIVO10")
                            res()
                        } catch (err){
                            rej(err)
                        }
                    })

                    // entering the lottery
                    //const tx = await lottery.enterRaffle( {value: lotteryEntranceFee} )
                    //console.log(tx)
                    //await tx.wait(1)
                    console.log("Time to wait..........")

                    const winStartingBalance = await accounts[0].getBalance
                    console.log(await winStartingBalance)
                })
            })
        })
    })