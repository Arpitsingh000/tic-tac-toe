class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.isAIMode = false;
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        // DOM elements
        this.cells = document.querySelectorAll('[data-cell]');
        this.status = document.getElementById('status');
        this.restartButton = document.getElementById('restartButton');
        this.twoPlayerMode = document.getElementById('twoPlayerMode');
        this.aiMode = document.getElementById('aiMode');

        this.initializeGame();
    }

    initializeGame() {
        // Add click handlers
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e), { once: true });
        });

        this.restartButton.addEventListener('click', () => this.restartGame());
        
        // Game mode handlers
        this.twoPlayerMode.addEventListener('click', () => this.setGameMode(false));
        this.aiMode.addEventListener('click', () => this.setGameMode(true));
    }

    setGameMode(aiMode) {
        this.isAIMode = aiMode;
        this.twoPlayerMode.classList.toggle('active', !aiMode);
        this.aiMode.classList.toggle('active', aiMode);
        this.restartGame();
    }

    handleCellClick(e) {
        const cell = e.target;
        const index = Array.from(this.cells).indexOf(cell);

        if (this.board[index] !== '' || !this.gameActive) return;

        this.makeMove(index);

        if (this.isAIMode && this.gameActive && this.currentPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.gameActive = false;
            this.status.textContent = `Player ${this.currentPlayer} wins!`;
            return;
        }

        if (this.checkDraw()) {
            this.gameActive = false;
            this.status.textContent = "Game ended in a draw!";
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.status.textContent = `Player ${this.currentPlayer}'s turn`;
    }

    makeAIMove() {
        const bestMove = this.findBestMove();
        if (bestMove !== -1) {
            this.cells[bestMove].click();
        }
    }

    findBestMove() {
        // First, try to win
        const winMove = this.findWinningMove('O');
        if (winMove !== -1) return winMove;

        // Second, block opponent from winning
        const blockMove = this.findWinningMove('X');
        if (blockMove !== -1) return blockMove;

        // Try to take center
        if (this.board[4] === '') return 4;

        // Try to take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Take any available space
        const availableMoves = this.board.map((cell, index) => cell === '' ? index : -1).filter(i => i !== -1);
        if (availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }

        return -1;
    }

    findWinningMove(player) {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === '') {
                this.board[i] = player;
                if (this.checkWin(false)) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        return -1;
    }

    checkWin(updateUI = true) {
        for (const combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                if (updateUI) {
                    this.cells[a].classList.add('win');
                    this.cells[b].classList.add('win');
                    this.cells[c].classList.add('win');
                }
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.status.textContent = "Player X's turn";
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
        });

        // Remove old event listeners and add new ones
        this.cells.forEach(cell => {
            const clone = cell.cloneNode(true);
            cell.parentNode.replaceChild(clone, cell);
        });

        this.cells = document.querySelectorAll('[data-cell]');
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e), { once: true });
        });
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
}); 