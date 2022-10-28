## FRONT END FUNDME
Quando si fa una dapp di solito si creano 2 differenti repository: 
- la cartella che contiene lo smart contract
- la contella che contiene frontend

Questa cartella contiene il frontend. Ha l'obiettivo di rendere full stack il contratto FundMe.
(Coriosita VScode: se apri file xxx.html e fai "!" e schiacci sul primo pulsante esce uno scheletro base)

constans.js contiene l'ABI e il contract address del nostro contract FundMe
(il contract address è temporaneo e dato da "yarn hardhat node" in locale del contratto FundMe)

Inoltre creiamo in metamask una rete apposita per fare i test che si chiama hardhat_localhost e ci importiamo dentro un account di test che è uscito col deploy del contratto attraverso il comando yarn hardhat node