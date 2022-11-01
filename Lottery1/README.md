## Lottery
Vogliamo prima di tutto creare un contratto Lotteria con le seguenti funzionalità:
    - Entrare nella lotteria -> pagare la lotteria un tot
    - Estrarre un vincitore randomico (e verificabile)
    - ogni X tempo bisogna chiudere la lotteria e definire il vincitore
Per far questo usiamo Chainlink Oracle per definizione del valore Random e per l'esecuzione automatica (il trigger).
Per far ciò usiamo VRFConsumerBaseV2 e VRFCoordinatorV2Interface.

Inoltre il contratto viene deployato (file in folder deploy) e vengono effettuati i test di sorta sul contratto (folder test). 
Importante per la creazione dei test in hardhat: https://hardhat.org/hardhat-network/docs/reference

Nella fase di test in testnet:
 - andiamo su https://vrf.chain.link/ e creiamo un subScriptionId che inseriamo in helper-hardhat-config
 - aggiungiamo al vrf creato 2 LINK
 - facciamo il deploy & verify del contratto sulla testnet goerli usando il subScriptionId
 - andiamo su https://vrf.chain.link/goerli/5898 e aggiungiamo cone consumer il nostro contratto (0xB1e6C48a0FAeEBfe79c3C783AE5E32950C5fbbb2)
 - andiamo a registrare il keeper https://automation.chain.link/ impostazione: Time-based, 0xB1e6C48a0FAeEBfe79c3C783AE5E32950C5fbbb2, performUpkeep, 0x, lo nomino "Upkeep Lottery" 
 - lanciamo lo staging test
Se nevcessario si possono anche effettuare test andando su https://goerli.etherscan.io/address/0xB1e6C48a0FAeEBfe79c3C783AE5E32950C5fbbb2#writeContract e nella sezione writeContract connettendo il wallet si possono chiamare le funzioni
