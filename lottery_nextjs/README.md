## FRONT END LOTTERY
In questa cartella viene creato un frontend in NEXTJS per il contratto Lottery creato in precedenza. Quindi partiamo con ```yarn create next-app```

### URL di riferimento
https://shy-art-5568.on.fleek.co/ rete goerli

### connessione wallet
Vediamo 2 modi differenti per la connessione dei wallet: 
1. moralis (```yarn add react react-dom moralis react-moralis moralis-v1```)
2. web3uikit (```yarn add web3uikit```)
Questa operazione viene effettuata nei file Header e HeaderMoralis in components

### Corpo Del Sito: / Partecipazione Lotteria: 
Nel file LotteryEntrance nella cartella components:
1. avere una funzione che permette di entrare i valori della lotteria: uso runContracrFunction da Moralis
2. per chiamare enterRaffle() mi servono:
    - abi e contract address: creati 2 file appositi in constants e un file nella cartella deploy del back end in modo da garantire l'aggiornamento a ogni deploy
    - recupero chainId della connessione per verificare la correttezza
    - recupero msg.Value tramite entranceFee()
3. mostrare quanti partecipanti ci sono e l'ultimo vincitore
NOTA: per mostrare il vincitore nei test locali creiamo uno script mockOffchain nella cartella di backend. Quando chiamo lo script ritorna un vincitore ```yarn hardhat run scripts/mockOffchain.js --network hardhat```

### user friendly
Per migliorare l'esperienza use aggiungiamo le notification (https://web3ui.github.io/web3uikit/?path=/story/5-popup-notification--hook-demo)

### tailwindcss
(https://tailwindcss.com/docs/guides/nextjs)
Usiamo tailwindcss per creare il css del sito e avere una minima impostazione grafica.
Installazione: ```yarn add --dev tailwindcss postcss autoprefixer```
Inizializzazione: ```yarn tailwindcss init -p``` e cosi si creano: postcss.config.js e tailwind.config.js
cambiamo il contenuto di style/globals.css come consigliato
(installiamo anche PostCSS Language Support su VS)

## Hosting web site
Opzioni possibili Vercel, Google cloud, AWs facciamo un deploy decentralizzato.
Per far questo usiamo IPFS:
1. Dopo aver chiaramento scaricato IPFS e avere una connessione funzionante alla rete si fa:
    ``` yarn build ```
    ``` yarn next export ```
    Quindi viene creata la cartella "out" e contiene il pure static code che viene usato in IPFS
2. Importiamo su IPFS Desktop l'intera cartella "out"
3. su IPFS facciamo "set Pinning" dal pannello di controllo.
(usando firefox ho un gateway di mezzo e quindi per fare ka chiamata al sito mi serve:)
https://ipfs.io/ipfs/____[Incollare quello che esce da COPIA CID nel pannello IPFS]_____ 

Simplier way to add to IPFS is:
1. go to fleek.co and login (io con github)
2. carichiamo da github la repo contenente il sito
3. selezioniamo IPFS e quindi cartella out 
4. inseriamo come comandi da eseguire ``` yarn && yarn build && yarn next export ```


## Getting Started
First, run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
