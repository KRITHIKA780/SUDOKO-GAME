/**
 * SudokuLogic - Core engine for generating and solving 9x9 Sudoku puzzles.
 */
class SudokuLogic {
    constructor(size = 9) {
        this.setSize(size);
    }

    setSize(size) {
        this.size = size;
        this.boxSize = Math.sqrt(size);
        // If not a perfect square (like 3), we treat box size as 0 (no subgrid rule) or as a single box
        if (!Number.isInteger(this.boxSize)) {
            this.boxSize = 0;
        }
        this.resetBoard();
    }

    /**
     * Resets the internal board state.
     */
    resetBoard() {
        this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
    }

    /**
     * Checks if placing a number at (row, col) is valid.
     */
    isValid(board, row, col, num) {
        // Check row
        for (let x = 0; x < this.size; x++) {
            if (board[row][x] === num) return false;
        }

        // Check column
        for (let x = 0; x < this.size; x++) {
            if (board[x][col] === num) return false;
        }

        // Check 3x3 box (only if boxSize is defined, e.g., for 4x4, 9x9)
        if (this.boxSize > 0) {
            let startRow = row - (row % this.boxSize);
            let startCol = col - (col % this.boxSize);
            for (let i = 0; i < this.boxSize; i++) {
                for (let j = 0; j < this.boxSize; j++) {
                    if (board[i + startRow][j + startCol] === num) return false;
                }
            }
        }

        return true;
    }

    /**
     * Solves the Sudoku board using backtracking.
     */
    solve(board = this.board) {
        let emptySpot = this.findEmpty(board);
        if (!emptySpot) return true;

        let [row, col] = emptySpot;

        // Shuffle numbers for random board generation
        let nums = [];
        for (let i = 1; i <= this.size; i++) nums.push(i);
        nums.sort(() => Math.random() - 0.5);

        for (let num of nums) {
            if (this.isValid(board, row, col, num)) {
                board[row][col] = num;

                if (this.solve(board)) return true;

                board[row][col] = 0;
            }
        }

        return false;
    }

    /**
     * Finds an empty spot on the board.
     */
    findEmpty(board) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (board[i][j] === 0) return [i, j];
            }
        }
        return null;
    }

    /**
     * Generates a new Sudoku puzzle based on difficulty.
     * @param {string} difficulty - 'easy', 'medium', 'hard'
     */
    generateBoard(difficulty) {
        this.resetBoard();
        this.solve(); // Fill the board completely

        const fullBoard = JSON.parse(JSON.stringify(this.board));
        let holes = 0;
        const totalCells = this.size * this.size;

        if (this.size === 3) {
            holes = difficulty === 'hard' ? 5 : (difficulty === 'medium' ? 3 : 2);
        } else {
            switch (difficulty) {
                case 'easy': holes = Math.floor(totalCells * 0.43); break;
                case 'medium': holes = Math.floor(totalCells * 0.55); break;
                case 'hard': holes = Math.floor(totalCells * 0.66); break;
                default: holes = Math.floor(totalCells * 0.5);
            }
        }

        let attempts = holes;
        while (attempts > 0) {
            let row = Math.floor(Math.random() * this.size);
            let col = Math.floor(Math.random() * this.size);

            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                attempts--;
            }
        }

        return {
            puzzle: this.board,
            solution: fullBoard
        };
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SudokuLogic;
} else {
    window.SudokuLogic = SudokuLogic;
}
