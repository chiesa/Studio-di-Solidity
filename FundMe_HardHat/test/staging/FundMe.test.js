const { assert } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat") 
const { developmentChain } = require("../../helper-hardhat-config")

developmentChain.includes(network.name) // if
    ? describe.skip                     // true
    : describe("FundMe", async ()=>{    // false
        let fundMe
        let deployer
        const sendValue = ethers.utils.parseEther("1")
        beforeEach(async()=>{
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer)
        })
        it("allows people to fund and withdraw",async () => {
            await fundMe.fund({value: sendValue})
            await fundMe.withdraw()
            const endBalance = await fundMe.provider.getBalance(fundMe.address)
            assert.equal(endBalance.toString(),"0")
        })
      })