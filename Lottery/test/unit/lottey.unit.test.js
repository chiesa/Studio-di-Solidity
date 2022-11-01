const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChain, networkConfig } = require("../../helper-hardhat-config")



!developmentChain.includes(network.name)
    ? describe.skip
    : describe("Lottery Unit Tests", () => {
        let lottery, vrfCoordinatorV2, lotteryEntranceFee, deployer, interval, lotteryState
        const chainId = network.config.chainId

        beforeEach( async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"]) // deploy all the contract
            lottery = await ethers.getContract("Lottery", deployer)
            vrfCoordinatorV2 = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            lotteryEntranceFee = await lottery.getEntranceAmount()
            lotteryState = await lottery.getLotteryState()
            interval = await lottery.getInterval()
        })

        describe("constructor", () => {
            it("initalizes the lottery correctly", async () => {
                assert.equal(lotteryState.toString(), "0")
                assert.equal(interval.toString(), networkConfig[chainId]["interval"])
            })
        })

        describe("enterLottery", () => {
            it("reverts when not enough ETH", async () => {
                // chiamiamo la funzione enterRaffle senza ETH
                await expect(lottery.enterRaffle()).to.be.revertedWith("Lottery__notEnoughtETHEntrance")
            })
            it("records players when they enter", async () => {
                // facciamo un offerta con l'utente deployer e poi vediamo se nell'array s_player del nostro smart contract (in posizione 0) che il deployer
                await lottery.enterRaffle({value: lotteryEntranceFee})
                const playerFromContract = await lottery.getPlayer(0)
                assert.equal(playerFromContract, deployer)
            })
            it("emits event", async () => {
                await expect(lottery.enterRaffle({value: lotteryEntranceFee})).to.emit(lottery,'Partecipant').withArgs(deployer, lotteryEntranceFee);
            })
            it("function call with state not OPEN", async () =>{
                await lottery.enterRaffle({value:lotteryEntranceFee})
                // cambio lo stato di lottery: (https://hardhat.org/hardhat-network/docs/reference)
                await network.provider.send("evm_increaseTime",[interval.toNumber() + 1])
                await network.provider.send("evm_mine",[]) // per minare un extra block
                // prentendiamo di essere il chainlink keeper
                await lottery.performUpkeep([])
                await expect(lottery.enterRaffle({value: lotteryEntranceFee})).to.be.revertedWith("Lottery_StateNOTOpen")
            })
        })

        describe("checkUpkeep", () => {
            it("returns false if people haven't sent any ETH", async () => {
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1 ])
                await network.provider.send("evm_mine", [])
                const{ upkeepNeeded } = await lottery.callStatic.checkUpkeep([]) // the function isn't "view", so I can do callStatic
                assert(!upkeepNeeded)
            })
            it("returns false if isn't OPEN", async () => {
                await lottery.enterRaffle({value:lotteryEntranceFee})
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1 ])
                await network.provider.send("evm_mine", [])
                await lottery.performUpkeep("0x") //"0x"=[]=null bytes
                const lotteryState = await lottery.getLotteryState()
                const{ upkeepNeeded } = await lottery.callStatic.checkUpkeep([])
                assert.equal(lotteryState.toString(),"1")
                assert(!upkeepNeeded)  // assert.equal(upkeepNeeded,false)
            })
            it("returns false if not enough time has passed", async () => {
                await lottery.enterRaffle({value:lotteryEntranceFee})
                await network.provider.send("evm_increaseTime", [interval.toNumber() - 1 ])
                await network.provider.send("evm_mine", [])
                const{ upkeepNeeded } = await lottery.callStatic.checkUpkeep([])
                assert(!upkeepNeeded)  // assert.equal(upkeepNeeded,false)
            })
            it("returns true if the 4 conditional are true", async () => {
                await lottery.enterRaffle({value:lotteryEntranceFee})
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1 ])
                await network.provider.send("evm_mine", [])
                const{ upkeepNeeded } = await lottery.callStatic.checkUpkeep([])
                assert(upkeepNeeded)  // assert.equal(upkeepNeeded,false)
            })
        })

        describe("performUpkeep", () => {
            it("only run if checkUpkeep is true", async () => {
                await lottery.enterRaffle({value:lotteryEntranceFee})
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1 ])
                await network.provider.send("evm_mine", [])
                const tx = await lottery.performUpkeep([])
                assert(tx)
            })
            it("reverts with Lottery__upKeeperNotNeeded if checkUpkeep is false", async () =>{
                await expect(lottery.performUpkeep([])).to.be.revertedWith("Lottery__upKeeperNotNeeded") // NOTARE CHE SI POTREBBERO AGGIUNGERE I PARAMETRI
            })
            it("updates lotteryState, emits an events and calls the VRFCoordinator", async () =>{
                await lottery.enterRaffle({value:lotteryEntranceFee})
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1 ])
                await network.provider.send("evm_mine", [])
                const txRes = await lottery.performUpkeep([])
                const txRec = await txRes.wait(1)
                const requestId = txRec.events[1].args.requestId
                const lotteryState = await lottery.getLotteryState()
                expect(requestId.toNumber() > 0)
                assert(lotteryState == 1)
            })
        })

        describe("fulfillRandomWords", () => {
            beforeEach(async () => {
                await lottery.enterRaffle({value: lotteryEntranceFee})
                await network.provider.send("evm_increaseTime", [ interval.toNumber() + 1 ])
                await network.provider.send("evm_mine", [])
            })
            it("can only be called after performUpkeep", async () => {
                await expect(vrfCoordinatorV2.fulfillRandomWords(0, lottery.address)).to.be.revertedWith("nonexistent request")
                await expect(vrfCoordinatorV2.fulfillRandomWords(1, lottery.address)).to.be.revertedWith("nonexistent request")
            })

            // BIG TEST
            it("picks a winner, resets the lottery and sends money", async () => {
                // andiamo a connettere 3 entrans aggiuntive a lottery
                const additionaEntrants = 3
                const startAccontIndex = 1 // deployer is 0
                const accounts = await ethers.getSigners()
                for(let i = startAccontIndex; i < startAccontIndex + additionaEntrants; i++){
                    const accontConnectedLottery = lottery.connect(accounts[i])
                    await accontConnectedLottery.enterRaffle({value:lotteryEntranceFee})
                }
                // ora abbiamo 4 raffle nel nostro contratto lottery
                const stratingTimeStamp = await lottery.getLatestTimeStamp()

                // performUpkeep (mock being chainlink keepers)
                // fulfillRandomWorld (mock being the chainlink VRF)
                // vorremo aspettare finche fulfillRandomWorld non sarà chiamato e emetterà l'evento "winnerPick"
                // per aspettare dobbiamo creare una nuova promessa:
                await new Promise( async (res,rej) => {
                    lottery.once("winnerPick", async () => {
                        console.log("Found the event: winnerPick!")
                        // if it take too time we wanna the error (timeout settato in hardhat.condig.js nella sezione mocha)
                        try{
                            // definisco utilizzo i log per vedere chi è il vincitore e controllo che 
                            // sia corretto il vincitore e gli ETH siano inviati correttamente
                            //console.log(accounts[0].address)
                            //console.log(accounts[1].address) //VINCITORRE
                            //console.log(accounts[2].address)
                            //console.log(accounts[3].address)
                            const recentWinner = await lottery.getRecentWinner()
                            //console.log(recentWinner)
                            const lotteryState = await lottery.getLotteryState()
                            const endingTimeStamp = await lottery.getLatestTimeStamp()
                            const numPlayers = await lottery.getNumberPlayers()
                            const winEndingBalance = await accounts[1].getBalance()
                            assert.equal(lotteryState.toString(), "0")
                            assert(endingTimeStamp > stratingTimeStamp)
                            assert.equal(numPlayers.toString(), "0")
                            // bilancio finale user 1 (vincitore) = bilancio finale user 1 (vincitore) + lotteryEntranceFee * utenti + lotteryEntranceFee
                            assert.equal(winEndingBalance.toString(), winStartingBalance.add(lotteryEntranceFee.mul(additionaEntrants).add(lotteryEntranceFee)).toString())
                            res()
                        } catch (err){
                            rej(err)
                        }
                    })
                    const tx = await lottery.performUpkeep([])
                    const txReceipt = await tx.wait(1)
                    // prendo il credito dell'accunt del vincitore prima di vincere e verifico che avvenga l'incremento
                    const winStartingBalance = await accounts[1].getBalance()

                    // chiamiamo fulfillRandomWords con requestID e indirizzo andando quindi a scatenare l'evento "winnerPick" atteso dal Promise
                    await vrfCoordinatorV2.fulfillRandomWords(txReceipt.events[1].args.requestId, lottery.address)
                })
            })
        })
    })