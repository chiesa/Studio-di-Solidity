//import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"
//import { resolveConfig } from "prettier"

// leviamo dai bottoni la revazione onclick="function()" e usiamo:
const connectButton = document.getElementById("connectButton") // nota che tra parentesi c'è il nome del bottone nel html
const fundButton = document.getElementById("fund")
document.getElementById("balanceBotton").onclick = getBalance
document.getElementById("balanceWithdraw").onclick = withdraw
connectButton.onclick = connect
fundButton.onclick = fund

// funzione asincrona se no si apre ogni volta che riavvi la pagina 
async function connect(){
    //verifichiamo la presenza di metamask
    if(typeof window.ethereum !== "undefined"){
        // funzione che fa uscire il popup per la connessione
        try{
            await window.ethereum.request({method: "eth_requestAccounts"})
        } catch (err){
            console.log(err)
        }
        //document.getElementById("connectButton").innerHTML = "Connected!!"
        connectButton.innerHTML = "Connected!!"
    } else {
        //document.getElementById("connectButton").innerHTML = "Please install metamask"
        connectButton.innerHTML = "Please install metamask"
    }
}

async function getBalance(){
    if(typeof window.ethereum != "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

// fund function
async function fund(){
    let ethAmount = document.getElementById("ethAmount").value
    console.log(`il quantitativo ${ethAmount}...`)
    
    if(typeof window.ethereum !== "undefined"){
        // voglio che il provider sia connesso alla blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // vogliamo il contratto, per questo ci servono: contractAddress, abi e signer
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })

            //listen for TX to be mined (or and event)
            await listenForTransactionMine(transactionResponse,provider) 
            // here not events but if you have event:
            // provider.once(Events,listener)
            console.log("Done!")
        } catch (err) {
            console.log(err)
        }
    }
} 

function listenForTransactionMine(transactionResponse,provider){
    console.log(`Mining ${transactionResponse.hash}...`)
    // return new Promise()
    // listen for transaction to finish but provider.once is a promise
    // chiamando il new Promise, nella funzione che chiamante se presente await, si aspetterà che termini prima di proseguire
    return new Promise((resolve,rej) => {
            // quando la transactionResponse.hash viene trovata, viene chiamato resolve
            provider.once(transactionResponse.hash, (transactionRecipt)=>{
                console.log(`Completed with ${transactionRecipt.confirmations} confirmations`)
            resolve()
        })
    })
}

// withdraw function
async function withdraw(){
    if(typeof window.ethereum != "undefined"){
        console.log("Withdrawing..")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            console.log(provider)
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        }catch(err){
            console.log(err)
        }
    }
}