*** Contract ***

1. **Basic NFT**: il contratto basic NFT consente la registrazione all'interno della blockchain di un NFT precedentemente creato in IPFS, nei test effettuati si tratta di: "http://bafybeieoy22lqbdbrhcqziqqn5efsohte4u4g2lidz3cvecfl3yy2j3peu.ipfs.localhost:8080/?filename=SimpleNFT.json"
Per fare il deploy bisogna quindi lanciare il seguente comando: 
```
yarn hardhat deploy --tags basicnft --network hardhat
```

2. **Random IPFS**: il contratto permette di minare degli NFT assegnati randomicamente con rarità randomica. Per far questo si usa l'interfaccia: @chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol.
Per il deploy lanciare il comando: 
```
yarn hardhat deploy --tags mocks,IPFSRandom --network hardhat
```
Notare che questo programma è stato costruito in 2 differenti fasi: la prima permetteva dinamicamente l'upload delle immagini su Pinata. In una seconda fase, vengono presi gli URL delle immagini, inseriti direttamente nel file di deploy e viene cambiata la variabile UPLOAD_TO_PINATA in .env da true a false e non viene piu chiamato Pinata.

3. **Dynamic SVG (Scalable Vector Graphics) NFT**: il contratto permette di caricare gli **NFT on-chain** but that means the operation will be very expensive. Il programma sarà **dinamica**:
Se il prezzo di ETH è sopra a X -> SMILE
se è sotto a X -> SAD

TODO: ./deploy/4_mint.js per Random IPFS.