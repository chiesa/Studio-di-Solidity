const networkConfig = {
    5: {
        name: "Goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337:{
        name: "localhost",
        ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    },
}

const developmentChain = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChain
}