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
 - aggiungiamo al vrf creato 20 LINK (se non ha abbastanza link non funziona)
 - facciamo il deploy & verify del contratto sulla testnet goerli usando il subScriptionId
 - andiamo su https://vrf.chain.link/goerli/5898 e aggiungiamo cone consumer il nostro contratto (0x9401C6695D947b85b0711eC9b5522b488a04dD52)
 - andiamo a registrare il keeper https://automation.chain.link/ impostazione: Costumer-based, 0x9401C6695D947b85b0711eC9b5522b488a04dD52, 0x, lo nomino "Upkeep Lottery". Aggingiamo 10LINK 
 - lanciamo lo staging test
Se nevcessario si possono anche effettuare test andando su https://goerli.etherscan.io/address/0x9401C6695D947b85b0711eC9b5522b488a04dD52#writeContract e nella sezione writeContract connettendo il wallet si possono chiamare le funzioni
