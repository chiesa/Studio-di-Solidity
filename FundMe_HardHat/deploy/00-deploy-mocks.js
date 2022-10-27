const { network } = require("hardhat")
const { developmentChain } = require("../helper-hardhat-config")

const DECIMALS=8
const INITIAL_ANSWER = 200000000000

module.exports = async ({getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    // si controlla se in developmentChain contenuti in helper-hardhat-config è presente la rete
    // se si deploy mock
    log(developmentChain)
    if( developmentChain.includes(network.name) ){     // developmentChain contiene in questo caso contiente network.name e non chainId o altri parametri
        log("Local network detected: deploy MOCKS")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args:[ DECIMALS, INITIAL_ANSWER ],
            log:true,
        })
        log("Mocks deployed")
        log("-------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]