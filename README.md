# STUDIO DI SOLIDITY

In una prima fase di studio, sono andato ad approfondire come riportato nella cartella "Introduzione a Solidity" (https://github.com/chiesa/Introduzione-a-Solidity).
Sono poi proseguito con i seguenti codici/progettini:

## SimpleStorage.sol
E' un contratto elementare che permette il salvataggio di alcuni dati: un numero favorito e array di persone composte dal nome e numero favorito

## ExtraStorage.sol
Il contratto è un esempio di SimpleStorage e con questo si pone override della funzione store alla quale si somma 5 al numero che si sta salvando.

## StorageFactory.sol
Un altro contratto molto semplice in cui, a seguito dell'importazione di SimpleStorage.sol (```import './SimpleStorage.sol'```) si crea e gestisce un array di SimpleStorage.

## PriceConvertor.sol
Il contratto permette di recuperare il prezzo di ETH (etherium) e conventire un amount di ETH in USD, grazie alle librerie di chainlink.

## FundMe.sol
Il contratto permette di inviare soldi all'owner del contratto per finanziarlo in qualche attività. I prezzi sono convertiti in dollari utilizzando il contratto PriceConvertor.sol .

## Fallback.sol
Esempio elementare di un contratto fallback con le funzioni fallback() e recieve().

## ether-simple-storage
Nella cartella ether-simple-storage, si riprende il contratto SimpleStorage.sol e si fa un deploy si una rete locale **Ganache**. Dove si inizia a studiare l'utilizzo della libreria **ethersJS**. 

## HardHat_Deploy
Nella cartella Hardhat_Deploy è presente un contratto e viene utilizzato il tool **Hardhat**. Il contratto è un contratto standard e si studia il **processo di deploy dei file in reti di test (nell'esempio la rete Goerli) e nella mainnet utilizzando JS e Jnode**.

## FundMe_HardHat (BACK_END)
Un'introduzione delle funzionalità di HardHat con l'utilizzo del contratto FundMe.sol

## FundMe_HTML (FRONT_END)
Il programma crea una piccola interfaccia HTML al contratto FundMe precedentemente creato (nel mio caso lanciata tramite il server di VS)

## Lottery

### Lottery (BACKEND)
Creiamo un contratto lotteria nel quale è possibile comprare ticket e partecipare a una lotteria. Il vincitore ottiene tutti i soldi nel contratto.
### Lottery (FRONTEND)
In nextJS viene creato un frontend minimale per il backend contenente il contratto backend. (caricata sia localmente su IPFS che su fleek)
In repo: https://github.com/chiesa/Lottery-FontEnd-NextJS-SmartContract

## Encoding
Il contratto è uno studio dei processi di encode e decode passando per la libreria abi, cifrando in base64 e linguaggio macchina di EVM (www.evm.codes)

## Call 
Il contratto ha l'obiettivo di studiare il funzionamento della funzione call.
In particolare vogliamo popolare i parametri e inviare una funzione. Per far questo usiamo le parole chiavi di basso livello: call, staticcall e send.
Il programma anzalizza call: come chiamare una funzione avendo un cambio nello stato della blockchain. 
Per chiamare una funzione usando solo i parametri di call, abbiamo bisogno di cifrare il nome della funzione e i paramtrei in linguaggio EVM. 
In particolare vogliamo: 
 - "function signature" si tratta della stringa che contine il nome della funzione e i parametri (es. "transfer(address,uint256"))
 - "function selector" cioè i primi 4 byte della function signature dopo l'encode in EVM (es. 0xa9059cbb)
In oltre, nel contratto "CallFunctionWithoutContract" si analizza un come questo contratto possa modificare i parametri di un altro contratto (nel caso specifico "call"). Per farlo funzionare: fare deploy del contratto "callAnything", passare come parametro nella fase di deploy di "CallFunctionWithoutContract" l'indirizzo di call. 

## NFT_hardhat
Nella cartella NFT_hardhat vi è uno studio di differenti forme di **NFT** con differenti possibilità di creazione in **IPFS** e di deploy. In particolare nel si stanno sviluppando e facendo i deploy per tre differenti casi: 
1. **NFT Base**: si studia un caso base di NFT, dopo la creazione del NFT su IPFS con l'immagine sul localhost, viene fatto il deploy del contratto sulla testnet goerli.
2. **IPFS Random**: si definisce come creare una collezione di NFT con un assegnazione randomica delle immagini e del livello di rarità a seguito di un mint. 
3. **SVG NFT**: questo sistema dovrebbe permettere di salvare tutto direttamente on-chain nello smart contract. All'interno del link del tokenURi, viene inserito un json codificato che permette di recuperare i dati svg necessari alla visualizzazione delle immagini. 
Non caricato in testnet


## NFT_marketplace [in progress]
Nella cartella NFT_marketplace è presente un **progetto fullstack** in via di sviluppo per il quale attualmente è stato creato il contratto NFT_marketplace.sol dedicato allo scambio di NFT. 
</br> **TODO: lato applicativo e deploy dei file. </br>
NOTA: Il progetto è stato bloccato per approfondire il tema NFT e per tanto si è iniziato a lavorare su NFT_hardhat.**

**TODO: (16:18:19)**

## Solidity Style Guide
(https://docs.soliditylang.org/en/v0.8.16/style-guide.html)
Viene definito il seguente ordine in uno script solidity:
 - Pragma statements
 - Import statements
 - Interfaces
 - Libraries
 - Contracts
All'interno del contratto l'ordine invece è il seguente: 
 - Type declarations
 - State variables
 - Events
 - Modifiers
 - Functions
 
## NOTA ERRORE FREQUENTE: 
Si è ripetuto diverse volte il seguente messaggio di errore: ```TypeError: Cannot read properties of undefined (reading 'getContract')``` o su altre funzione di ethers. La soluzione risulta essere l'aggiunta di ```require("@nomiclabs/hardhat-ethers");``` in hardhat.config.js
Un altro errore frequente è quello di non trovare il contratto deployato in mock. Per questo bisogna mettere in ordine alfabetico i file di deploy con prima quelli che contengono il deploy di contratti che vengono usati successivamente (come Mock)

```     Error: VM Exception while processing transaction: reverted with custom error 'InvalidConsumer()'
    at VRFCoordinatorV2Mock.onlyValidConsumer (@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol:72)
    at VRFCoordinatorV2Mock.requestRandomWords (@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol:147)
``` soluzione: yarn add --dev @chainlink/contracts@0.4.1