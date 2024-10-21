const cells = document.querySelectorAll('.cell');
const xScoreElement = document.getElementById('x-score');
const oScoreElement = document.getElementById('o-score');
const resetButton = document.getElementById('reset-button');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let xScore = 0;
let oScore = 0;
let isGameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') continue;
        if (board[a] === board[b] && board[b] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        isGameActive = false;
        currentPlayer === 'X' ? xScore++ : oScore++;
        updateScore();
        return true;
    }

    if (!board.includes('')) {
        isGameActive = false;
        return false;
    }

    return false;
}

function updateScore() {
    xScoreElement.textContent = xScore;
    oScoreElement.textContent = oScore;
}

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    
    if (board[index] !== '' || !isGameActive) return;
    
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWinner()) {
        // Winner is declared, no further action needed.
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    isGameActive = true;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
