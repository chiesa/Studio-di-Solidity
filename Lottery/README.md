## Lottery
Vogliamo prima di tutto creare un contratto Lotteria con le seguenti funzionalità:
    - Entrare nella lotteria -> pagare la lotteria un tot
    - Estrarre un vincitore randomico (e verificabile)
    - ogni X tempo bisogna chiudere la lotteria e definire il vincitore
Per far questo usiamo Chainlink Oracle per definizione del valore Random e per l'esecuzione automatica (il trigger).
Per far ciò usiamo VRFConsumerBaseV2 e VRFCoordinatorV2Interface.