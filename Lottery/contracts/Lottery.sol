// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Lottery__notEnoughtETHEntrance();
error Lottery__TransfertFailed();
error Lottery_StateNOTOpen();
error Lottery__upKeeperNotNeeded(uint256 currentBalance, uint256 numPlayer, uint256 LotteryState);

/**
 * @title LOTTERY
 * @author Samuele Chiesa 
 * @notice Contract for create an untaperable decentralized smart contract
 * @dev The implementation use Chainlink VRF 2 and Chainlink Keepers
 */
contract Lottery is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /* TYPE DECLARETION */
    // creiamo un nuovo tipo LotteryState con 2 valori possibili
    enum LotteryState{OPEN, CALCULATING}

    /* STATE VARIABLE */
    uint256 private immutable i_entraceAmount;
    address payable [] private s_players;
    VRFCoordinatorV2Interface private immutable i_VRFCoordinator;
    bytes32 private immutable i_gasLine;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUESTCONFERMATION = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUMWORDS = 1;

    address private s_recentWinner;
    // variabili per il trigger
    LotteryState private s_lotteryState; // definiamo variabile del nostro tipo LotteryState
    uint256 private s_lastTimeStampo;
    uint256 private immutable i_interval; // numero in secondi

    /* EVENTS */
    event Partecipant(address indexed sender, uint256 indexed value);
    event RequestLotteryWinner(uint256 indexed requestId);
    event winnerPick(address indexed winner);

    /* FUNCTIONS */
    constructor(
        address VRFCoordinatorV2, 
        uint256 _entraceAmount, 
        bytes32 gasLine, 
        uint64 subscriptionId, 
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(VRFCoordinatorV2) {
        i_entraceAmount = _entraceAmount;
        i_VRFCoordinator = VRFCoordinatorV2Interface(VRFCoordinatorV2);
        i_gasLine = gasLine;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_lotteryState = LotteryState.OPEN; // or LotteryState(0)
        s_lastTimeStampo = block.timestamp; // block.timestamp = ora corrente
        i_interval = interval;
    }

    function enterRaffle() public payable{
        if(msg.value != i_entraceAmount){
            revert Lottery__notEnoughtETHEntrance();
        }
        if( s_lotteryState != LotteryState.OPEN){
            revert Lottery_StateNOTOpen();
        }
        s_players.push(payable(msg.sender));
        // eventi permettono di salvare nei log i dati 
        emit Partecipant(msg.sender,msg.value);
    }

    // Si definisce qui le funzioni fondamentali per chiamare un vincitore dopo un tempo X con ChainLink Oracle
    /**
     * @dev this is the function chainLink Keepers nodes call
     * they look for the parameter 'upKeeperNeeded' to return true
     * perche la funzione ritorni upKeeperNeeded uguale a true:
     * 1. l'intervallo di tempo deve essere passato 
     * 2. la lotteria deve avere almeno 1 player e un tot di ETH
     * 3. subScription è collegato con (/riporta il valore di) LINK
     * 4. la lotteria deve essere in stato "aperto"
     */
    function checkUpkeep(bytes memory /* checkData */) public view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        bool isOpen = (LotteryState.OPEN == s_lotteryState);
        bool timePassed = ( ( block.timestamp - s_lastTimeStampo ) > i_interval);
        bool hasPlayers = ( s_players.length > 0 );
        bool hasBalance = ( address(this).balance > 0 );
        upkeepNeeded = ( isOpen && timePassed && hasBalance && hasPlayers );
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if( ! upkeepNeeded ){
            revert Lottery__upKeeperNotNeeded(address(this).balance, s_players.length, uint256(s_lotteryState));
        }
        s_lotteryState = LotteryState.CALCULATING;
        // Request random number
        // use random number => winner 
        // 2 transaction but I wanna know it's correct the result
        uint256 requestId = i_VRFCoordinator.requestRandomWords(
            i_gasLine, //s_keyHash,
            i_subscriptionId, //s_subscriptionId
            REQUESTCONFERMATION, //requestConfirmations,
            i_callbackGasLimit, //callbackGasLimit,
            NUMWORDS //numWords
        );
        emit RequestLotteryWinner(requestId);
    }

    // non abbiamo bisogno del primo parametro nel codice ma ci serve per fare l'override quindi possiamo toglire il nome del parametro "requestId"
    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override{
        // avremo un numero molto grande quindi usiamo un modulo per ottenere il nostro numero random in base al numero di partecipanti
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_lotteryState = LotteryState.OPEN;
        // reset variables
        s_players = new address payable[](0);
        s_lastTimeStampo = block.timestamp;
        // address(this).balance :ritorna tutti i soldi nel contratto 
        (bool success,) = recentWinner.call{value:address(this).balance}("");
        if(!success){
            revert Lottery__TransfertFailed();
        }
        emit winnerPick(recentWinner);
    }

    /* GETTING FUNCTION */
    function getEntranceAmount() public view returns(uint256){
        return i_entraceAmount;
    }

    function getPlayer(uint256 index) public view returns(address){
        return s_players[index];
    }

    function getRecentWinner() public view returns(address){
        return s_recentWinner;
    }

    function getLotteryState() public view returns(LotteryState){
        return s_lotteryState;
    }

    // questa funzione può essere pure perchè leggere una costante che non è in storage 
    function getNumWords() public view returns(uint256){
        return NUMWORDS; // è identico che fare: "return 1;"
    }

    function getNumberPlayers() public view returns(uint256){
        return s_players.length;
    }

    function getLatestTimeStamp() public view returns(uint256){
        return s_lastTimeStampo;
    }

    function getRequestInformations() public pure returns(uint256){
        return REQUESTCONFERMATION;
    }
}