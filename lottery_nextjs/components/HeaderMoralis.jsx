import { useMoralis } from "react-moralis"
import { useEffect } from "react";

export default function HeaderMoralis(){

    // moralis ci permette di descriminare se siamo connessi a metamask or no
    // enableWeb3 permette di far la connessione
    // account permette di definire l'account di metamask
    // isWeb3Enable dice se l'account è connesso
    const { enableWeb3, account, isWeb3Enable, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();

    // useEffect ha 2 parametri: una funzione e un array indipendente
    // la funzione viene eseguita sui valori dell'arrey e in caso un valore cambi la funzione viene richiamata
    // 3 possibilità con l'arrey
    // 1. [] (array vuoto) => esegui una volta
    // 2. no array => viene rilanciata ogni reindirizzamento
    //      l'array è opzionale ma se non viene passato un array la funzione verrà rilanciata ogni volta che c'è un reindirizzamento
    //      ATTENZIONE a non creare loop se non si usa l'array (errore frequente)
    // 3. array => al cambio dell'array viene rilanciata

    // questo useEffect controlla se siamo connessi e non chiede di riconnetterci ogni volta che ricarichiamo la pagina
    useEffect(()=>{
        if (isWeb3Enable) return 
            if (typeof window !== "undefined"){
                if( window.localStorage.getItem("connected")){
                    enableWeb3()
                }
            }
    },[isWeb3Enable])

    // il seguente useEffect controlla se siamo disconnessi
    useEffect(() => {
        Moralis.onAccountChanged((account)=>{
            console.log(`Account change to ${account}`)
            // se l'account è null significa che ci siamo disconnessi
            if(account==null){
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    },[])


    // questo bottone permette di connettersi a Metamask
    // all'interno di {} si può scrivere JS codice, come viene fatto con onclick:
    return(<div>
        {account ? (
            <div> Connected to {account.slice(0,6)}...{account.slice(account.length - 4)}</div>
        ) : (
            <button 
                onClick={async () => {
                    await enableWeb3()
                    if(typeof window !== "undefined"){
                        // se ci connettiamo al portafoglio creiamo una variabile: conncected = injected
                        window.localStorage.setItem("connected","injected")
                    }
                }}
                // permette di fare una sola richiesta di connessione
                disabled={isWeb3EnableLoading}
            >
                CONNECT
            </button>
        )}
    </div>)
}