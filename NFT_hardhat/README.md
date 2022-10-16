*** Contract ***

1. Basic NFT: il contratto basic NFT consente la registrazione all'interno della blockchain di un NFT precedentemente creato in IPFS, nei test effettuati si tratta di: "http://bafybeieoy22lqbdbrhcqziqqn5efsohte4u4g2lidz3cvecfl3yy2j3peu.ipfs.localhost:8080/?filename=SimpleNFT.json"
Per fare il deploy bisogna quindi lanciare il seguente comando: 
```
yarn hardhat deploy --tags basicnft --network hardhat
```
2. Random IPFS: il contratto permette di minare degli NFT assegnati randomicamente con rarità randomica. Per far questo si usa l'interfaccia: @chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol.
Per il deploy lanciare il comando: 
```
yarn hardhat deploy --tags deploy_mocks,IPFSRandom --network hardhat
```
3. Dynamic SVG NFT