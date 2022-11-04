const { ethers } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES = "../lottery_nextjs/constants/contractAddresses.json"
const FRONT_END_ABI = "../lottery_nextjs/constants/ABI.json"

// questa funzione ci permette di aggiornare i dati del frontend
module.exports = async () => {
	if(process.env.UPDATE_FRONT_END){
		console.log("Updating front end.....")
		await updateContractAddresses()
		await updateABI()
	}
}

async function updateContractAddresses(){
	const lottery = await ethers.getContract("Lottery")
	const chainId = network.config.chainId.toString()
	const contractAddresses  = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES, "utf8"))
	if (chainId in contractAddresses){
		if(!contractAddresses[chainId].includes(lottery.address)){
			contractAddresses[chainId].push(lottery.address)
		}
	} else {
		contractAddresses[chainId] = [lottery.address]
	}
	fs.writeFileSync(FRONT_END_ADDRESSES, JSON.stringify(contractAddresses))
}

async function updateABI(){
	const lottery = await ethers.getContract("Lottery")
	fs.writeFileSync(FRONT_END_ABI, lottery.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "frontend"]