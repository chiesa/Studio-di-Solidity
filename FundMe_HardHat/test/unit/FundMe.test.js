const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChain } = require("../../helper-hardhat-config")

!developmentChain.includes(network.name) // if
    ? describe.skip                     // true
    : describe("FundMe", async function(){ // false
        let fundMe
        let deployer
        let MockV3Aggregator
        const sendValue = ethers.utils.parseEther("1") // 1ETH
        beforeEach(async function(){
            // deploy fundMe contract using hardhat deploy
            
            //const accounts = await ethers.getSigners() // return what there is in the "accounts" section nella sezione "network" (utilizzata) di "hardhat.config.js"
            //const accountZero = accounts[0]
            
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"]) // deploy all the contract
            fundMe = await ethers.getContract("FundMe", deployer ) // recupero il contratto fundMe e connettiamo il nostro deployer
            MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
        })

        describe("constructor", async function(){
            it("Sets aggregator address correctly", async function(){
                const response = await fundMe.priceFeed() 
                assert.equal(response, MockV3Aggregator.address)
            })
        })

        describe("fund", async function(){
            it("Fails if you don't send enough ETH", async function(){
                await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!") //vogliamo che ci torni true, se fallisce perchè non inviamo abbastanza ETH -> se ritorna il messaggio d'errore è corretto
            })
            it("update amount funded data structure", async function(){
                await fundMe.fund({value:sendValue})
                const response =  await fundMe.addressToAmountFunded(deployer)
                assert.equal(response.toString(), (sendValue).toString(),"errore")
            })
            it("Adds funder to array to funders", async () => {
                await fundMe.fund({value:sendValue})
                const response =  await fundMe.funders(0)
                assert.equal(response, deployer)
            })
        })

        describe("withdraw", async ()=>{
            beforeEach(async () =>{
                await fundMe.fund({value:sendValue})
            })

            it("withdraw ETH from a single funder", async ()=>{
                // set test
                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
                
                // action
                const transactionResponse = await fundMe.withdraw()
                const transactionRecipt = await transactionResponse.wait(1)
                const {gasUsed, effectiveGasPrice } = transactionRecipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

                // assert
                assert.equal(endingFundMeBalance,0)
                assert.equal(
                    (startingFundMeBalance.add(startingDeployerBalance)).toString(),
                    (endingDeployerBalance.add(gasCost)).toString()
                )
            })
            
            it("withdraw ETH from a multi funder", async() => {
                // set test
                const accounts = await ethers.getSigners();
                for( let i = 1; i < 6; i++ ){
                    const conncetContract = await fundMe.connect(accounts[i])
                    await conncetContract.fund({value:sendValue})
                }
                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

                //action
                const transactionResponse = await fundMe.withdraw()
                const transactionRecipt = await transactionResponse.wait(1)
                const {gasUsed, effectiveGasPrice } = transactionRecipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

                // assert
                assert.equal(endingFundMeBalance,0)
                assert.equal(
                    startingFundMeBalance.add(startingDeployerBalance).toString(),
                    endingDeployerBalance.add(gasCost).toString()
                )

                // test funders are reset
                await expect(fundMe.funders(0)).to.be.reverted
                for( i = 1; i < 6; i++ ){
                    assert.equal(
                        await fundMe.addressToAmountFunded(accounts[i].address),
                        0
                    )
                }
            })

            it("Only owner withdraw", async () => {
                const [attacker] = await ethers.getSigners()
                const connctAcc = await fundMe.connect(attacker)
                await expect(connctAcc.withdraw()).to.be.reverted //With("FundMe_NotOwner") TODO: approfondire perchè revertWith non funziona
            })        
        })

        describe("cheaper withdraw", async ()=>{
            beforeEach(async () =>{
                await fundMe.fund({value:sendValue})
            })

            it("cheaper withdraw ETH from a single funder", async ()=>{
                // set test
                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
                
                // action
                const transactionResponse = await fundMe.cheaperWithdraw()
                const transactionRecipt = await transactionResponse.wait(1)
                const {gasUsed, effectiveGasPrice } = transactionRecipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

                // assert
                assert.equal(endingFundMeBalance,0)
                assert.equal(
                    (startingFundMeBalance.add(startingDeployerBalance)).toString(),
                    (endingDeployerBalance.add(gasCost)).toString()
                )
            })
            
            it("cheaper withdraw ETH from a multi funder", async() => {
                // set test
                const accounts = await ethers.getSigners();
                for( let i = 1; i < 6; i++ ){
                    const conncetContract = await fundMe.connect(accounts[i])
                    await conncetContract.fund({value:sendValue})
                }
                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

                //action
                const transactionResponse = await fundMe.cheaperWithdraw()
                const transactionRecipt = await transactionResponse.wait(1)
                const {gasUsed, effectiveGasPrice } = transactionRecipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

                // assert
                assert.equal(endingFundMeBalance,0)
                assert.equal(
                    startingFundMeBalance.add(startingDeployerBalance).toString(),
                    endingDeployerBalance.add(gasCost).toString()
                )

                // test funders are reset
                await expect(fundMe.funders(0)).to.be.reverted
                for( i = 1; i < 6; i++ ){
                    assert.equal(
                        await fundMe.addressToAmountFunded(accounts[i].address),
                        0
                    )
                }
            })

            it("Only owner cheaper withdraw", async () => {
                const [attacker] = await ethers.getSigners()
                const connctAcc = await fundMe.connect(attacker)
                await expect(connctAcc.cheaperWithdraw()).to.be.reverted //With("FundMe_NotOwner") TODO: approfondire perchè revertWith non funziona
            })        
        })
    })