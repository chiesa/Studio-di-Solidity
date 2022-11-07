import { useWeb3Contract } from "react-moralis"
// in questo caso ho solo 2 constanti e le importo direttamente qui.
// in caso siano un numero superiore è consigliabile creare un file JS nella cartella constants
// dove si effettua l'export di tutte le variabili assieme in modo di chiamarle direttamente da un unico file
import contractAdressess from "../constants/contractAddresses.json"
import abi from "../constants/ABI.json"
// uso useMoralis per recuperare il chainID
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance(){

    // 1. avere una funzione che permette di entrare i valori della lotteria: uso runContracrFunction da Moralis
    // 2. per chiamare enterRaffle() mi servono:
    //      - abi e contract address: creati 2 file appositi in constants e un file nella cartella deploy del back end in modo da garantire l'aggiornamento a ogni deploy
    //      - recupero chainId della connessione per verificare la correttezza
    //      - recupero msg.Value tramite entranceFee()


    // recupero chainId (moralis lo ottiene dal portafoglio)
    const {chainId : chainIdHex, isWeb3Enabled} = useMoralis()
    // ma il risultato è chainId in esadecimali
    const chainIdInt = parseInt(chainIdHex)
    console.log(`Chain ID is ${chainIdInt}`)

    // se chainID è in contractAddress allora procedo altrimenti il contratto non è deployato nella rete
    // contractAdressess[chainIdInt][0] = cotract[chainId][arrayPos=0]
    const lotteryAddress = chainIdInt in contractAdressess ? (contractAdressess[chainIdInt][0]) : null
    console.log(`lotteryAddress is `)



    // definiamo entranceFee come un HOOK in quanto il valore viene settato con useEffect() alla seconda esecuzione. In caso non facciamo un hook a display il valore sarà null
    const [entranceFee, setEntranceFee] = useState("0")
    // ora entranceFee è la variabile e setEntranceFee è la funzione che ci permette di aggiornare o impostare entranceFee

    const [numPlayers, setNumPlayers] = useState("0")
    const [lastWinner, setLastWinner] = useState("0")


    // dispatch è un popUp creato da useNotification()
    const dispatch = useNotification()

    // con Moralis chiamo la funzione enterRaffle
    // runContracrFunction puo sia leccere gli stati che inviare le transazioni: leggiamo msg.value e inviamo l'enterRaffle function
    const {runContractFunction: enterRaffle, isLoading, isFetching} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, 
        functionName: "enterRaffle",
        parames: {},
        msgValue: entranceFee,
    })
    

    // creiamo una constante con cui chiamare la funzione getEntranceAmount() del nostro contratto. 
    // Poi richiameremo la constate e la funzione con getEntranceFee()
    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, 
        functionName: "getEntranceAmount",
        parames: {}
    })

    // recuperiamo l'ultimo vincitore
    const {runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, 
        functionName: "getRecentWinner",
        parames: {}
    })
    // recuperiamo il numero di giocatori
    const {runContractFunction: getNumberPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, 
        functionName: "getNumberPlayers",
        parames: {}
    })

    // in quanto vogliamo await getEntranceFee(), getNumberPlayers() e getRecentWinner() ci serve di creare una async function
    // la richiamiamo ogni volta che la pagina viene ricaricata con useEffect e ogni volta che una transazione va a buon fine con handleSuccess
    async function updateUI () {
        // recuperiamo entrance fee, il numero di partecipanti e l'ultimo vincitore
        const entranceFeeNew = (await getEntranceFee()).toString()
        setEntranceFee(entranceFeeNew) 
        setNumPlayers( (await getNumberPlayers()).toString())
        setLastWinner( (await getRecentWinner()) )
    }

    useEffect( () => {
        if (isWeb3Enabled) {
            
            updateUI()
        }
    },[isWeb3Enabled])

    // creo la condizione di successo in caso un utente clicchi sul bottone 
    const handleSuccess = async (tx) =>{
        // await transaction go true
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = (tx) =>{
        // chiamo ora il dispatch per i parametri di può vedere: https://web3ui.github.io/web3uikit/?path=/story/5-popup-notification--hook-demo
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "bottomR",
            icon: "bell"
        })
    }

    return (
        <div className="p-5">
            Hi from lottery entrance
            {/* Vogliamo chiamare la funzione solo se siamo nella rete in cui è presente il contratto -> altrimenti errore 
                Quindi se non lotteryAddress esiste => NOT NULL allora do la possibilità di fare l'importazione
            */}
            { lotteryAddress ? (
                    <div> 
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                            onClick={ async () => { 
                                            await enterRaffle({
                                                // definiamo alcuni popUp in caso di successo o di errore per una miglior userExpirence
                                                onSuccess: handleSuccess,
                                                onError: (err) => {console.log(err)},
                                            }) 
                            }}
                            disabled= {isLoading || isFetching}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                <div> ENTER RAFFLE </div>
                            )}
                        </button>
                         <div> Entrance Fee: {ethers.utils.formatUnits(entranceFee,"ether")} ETH </div> 
                         <div> Players: {numPlayers} </div> 
                         <div> Last Winner: {lastWinner} </div> 
                    </div> 
                ) : (
                    <div> No lottery contract address detective in the network, please change network </div>
                )
            }
        </div>)
    
}