# STUDIO DI SOLIDITY

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

## NFT_hardhat [in progress]
Nella cartella NFT_hardhat vi è uno studio di differenti forme di **NFT** con differenti possibilità di creazione in **IPFS** e di deploy. In particolare nel si stanno sviluppando e facendo i deploy per tre differenti casi: 
1. **NFT Base**: si studia un caso base di NFT, dopo la creazione del NFT su IPFS con l'immagine sul localhost, viene fatto il deploy del contratto sulla testnet goerli.
2. **IPFS Random**: si definisce come creare una collezione di NFT con un assegnazione randomica delle immagini e del livello di rarità a seguito di un mint. [**Deploy contratti in progress**]
3. **SVG NFT**: questo sistema dovrebbe permettere di salvare tutto direttamente on-chain nello smart contract. All'interno del link del tokenURi, viene inserito un json codificato che permette di recuperare i dati svg necessari alla visualizzazione delle immagini. [**TODO**]

## NFT_marketplace [in progress]
Nella cartella NFT_marketplace è presente un **progetto fullstack** in via di sviluppo per il quale attualmente è stato creato il contratto NFT_marketplace.sol dedicato allo scambio di NFT. 
</br> **TODO: lato applicativo e deploy dei file. </br>
NOTA: Il progetto è stato bloccato per approfondire il tema NFT e per tanto si è iniziato a lavorare su NFT_hardhat.**