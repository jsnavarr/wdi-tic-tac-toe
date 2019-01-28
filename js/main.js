/*--------- constants ------------*/

const MAX_NUMBER_TRIES = 9;
const CELL_IDS = [
    ['r1c1', 'r1c2', 'r1c3'],
    ['r2c1', 'r2c2', 'r2c3'],
    ['r3c1', 'r3c2', 'r3c3'],
];

/*--------- app's state variables ------------*/
var gameBoard = [[]];

var player1Name = "";
var player2Name = "";

var player1Simbol = null; //'X'
var player2Simbol = null; //'0'

var playing = null; // 0 -> Player1  1 -> Player2
var tokens = []; //'X' and '0'
var tries = null; //from 0 to MAX_NUMBER_TRIES

var winningRow = null;
var winningCol = null;
//0 -> diagonal from 0,0 to 2,2
//1 -> diagonal from 2,0 to 0,2
var winningDiag = null; 

var gameIsOnver = null;

/*--------- cached element references ------------*/
const catGameCell = document.querySelector('#cat-area');
const player1Input = document.getElementById('player1Input');
const player2Input = document.getElementById('player2Input');
const resetBtn = document.getElementById('resetButton');


/*--------- event listeners ------------*/
//document.querySelector('#letters').addEventListener('click', function(){console.log('clicked..');});
document.querySelector('#cat-area').addEventListener('click', handleCellClick);
resetBtn.addEventListener('click', resetGame);

/*--------- functions ------------*/

var initGame = function(){
    gameBoard = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];
    
    player1Name = "Player1";
    player2Name = "Player2";

    player1Simbol = 'X';
    player2Simbol = '0';

    playing = 0; //Player1
    
    player2Input.classList.remove('active', 'winner');
    player1Input.classList.remove('winner');
    player1Input.classList.add('active');
    player1Input.value = player1Name;
    player2Input.value = player2Name;

    tokens = [player1Simbol, player2Simbol];
    gamesPlayed = 0;

    tries = 0;

    gameIsOver = false;

    winningRow = null;
    winningCol = null;
    winningDiag = null;
    
    for (var i = 0; i < CELL_IDS.length; i++) {
        for (var j = 0; j < CELL_IDS.length; j++) {
            let cell = document.getElementById(CELL_IDS[i][j]);
            cell.setAttribute('src', "images/arrow.png");
            cell.classList.remove('winningCell');
        }
    }
}

function resetGame(){
    initGame();
}

function isPlayerAWinner(player, row, col) {
    console.log(player, col, row);
    token = tokens[player];
    var winner = false;
    //check for same row
    if(gameBoard[row][0]==token && gameBoard[row][1]==token && gameBoard[row][2]==token) {
        winningRow = row;
        winner = true;
    }
    //check for column
    if(gameBoard[0][col]==token && gameBoard[1][col]==token && gameBoard[2][col]==token) {
        winningCol = col;
        winner = true;
    }
    //check for diagonals
    //check for diagonal from [0][0] to [2][2]
    if ((row == 0 && col == 0) || (row == 2 && col == 2) || (row == 1 && col == 1)) {
        if (gameBoard[0][0]==token && gameBoard[1][1]==token && gameBoard[2][2]==token){
            winningDiag = 0;
            winner = true;
        }
    }
    //check for diagonal from [2][0] to [0][2]
    if ((row == 2 && col == 0) || (row == 1 && col == 1) || (row == 0 && col == 2)) {
        if (gameBoard[2][0]==token && gameBoard[1][1]==token && gameBoard[0][2]==token){
            winningDiag = 1;
            winner = true;
        }
    } 
    return winner;
}

function highlightWinningCells(){
    if(winningRow != null){
        console.log('Winner row: '+ winningRow);
        cell1 = document.getElementById('r'+(winningRow+1)+'c1');
        cell2 = document.getElementById('r'+(winningRow+1)+'c2');
        cell3 = document.getElementById('r'+(winningRow+1)+'c3');
        cell1.classList.add('winningCell');
        cell2.classList.add('winningCell');
        cell3.classList.add('winningCell');
    } 
    if(winningCol != null){
        console.log('Winner Col: '+ winningCol);
        cell1 = document.getElementById('r1'+'c'+(winningCol+1));
        cell2 = document.getElementById('r2'+'c'+(winningCol+1));
        cell3 = document.getElementById('r3'+'c'+(winningCol+1));
        cell1.classList.add('winningCell');
        cell2.classList.add('winningCell');
        cell3.classList.add('winningCell');
    } 
    if (winningDiag == 0) {
        cell1 = document.getElementById('r1c1');
        cell2 = document.getElementById('r2c2');
        cell3 = document.getElementById('r3c3');
        cell1.classList.add('winningCell');
        cell2.classList.add('winningCell');
        cell3.classList.add('winningCell');
    } 
    if (winningDiag == 1){
        cell1 = document.getElementById('r1c3');
        cell2 = document.getElementById('r2c2');
        cell3 = document.getElementById('r3c1');
        cell1.classList.add('winningCell');
        cell2.classList.add('winningCell');
        cell3.classList.add('winningCell');
    }
}

function handleCellClick (evt) {
    if(!gameIsOver){
        var row = parseInt(evt.target.id[1]);
        var col = parseInt(evt.target.id[3]);
        var cell = document.getElementById(evt.target.id);
        if (gameBoard[row-1][col-1] === null){
            //cell has not been clicked
            //get the object to update with 'X' or '0'
            if(playing === 0){
                gameBoard[row-1][col-1] = 'X';
                cell.setAttribute('src', "images/Ximage.png");
            } else {
                gameBoard[row-1][col-1] = '0';
                cell.setAttribute('src', "images/Zeroimage.png");
            }
            tries++;
            if (isPlayerAWinner(playing, row-1, col-1)){
                if(playing == 0){
                    player1Input.classList.remove('active')
                    player1Input.classList.add('winner');
                    player1Input.value+= '- Winner'
                } else {
                    player2Input.classList.remove('active')
                    player2Input.classList.add('winner');
                    player2Input.value+= '- Winner'
                }
                console.log(`Player ${playing+1} has Won`);
                highlightWinningCells();
                gameIsOver = true;
                return;
            } else if(tries === MAX_NUMBER_TRIES){
                console.log("Nobody won");
                gameIsOver = true;
                return;
            }
            player1Input.classList.toggle('active');
            player2Input.classList.toggle('active');
            playing = playing ? 0 : 1;
        }
    }
    console.log(gameBoard);
};  

initGame();

