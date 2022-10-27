# FundMe Hardhat

Il contratto è creato in solidity e deployato su goerli utilizzando hardhat.
Qui il contratto deployato:
https://goerli.etherscan.io/address/0x318741D42b79D798C307194c6a66E28fAf5Dea87#code
Nonostante il contratto sia stato creato in modo da fare auto verifica del codice, per vericare il codice è stato utilizzato il comando: yarn hardhat verify --network goerli 0x318741D42b79D798C307194c6a66E28fAf5Dea87 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e

Per l'esecuzione del presente codice seguire i seguenti passaggi: 
 -  installazione yarn
 -  lanciare il comando "yarn"
 -  lanciare il comando "yarn hardhat deploy" (esecuzione su rete di test: "yarn hardhat deploy --network goerli")

Vediamo in test 2 tipologie di test: 
 - Unit: local test
 - Staging: test in testnet (LAST BEFORE DEPLOY IN MAINNET)
I test si lanciano: yarn hardhat test (aggiungendo grep si può lanciare solo un test)
e si può verificare che superficie coprono con: yarn hardhat coverage
Si può chiaramente utilizzare la funzione di debag su VS ma è anche possibile (in hardhat) importare nel contratto solidity "hardhat/console.sol" e poi usare console.log() come in JS

Nella cartella scripts è presente un semplice modo di interagire con il contratto fundMe e in particolare con le funzioni fund() e withdraw()