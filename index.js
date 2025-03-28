const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    };
    return { renderMessage };
})();

const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((cell, index) => {
            boardHTML += `<div class="cell" id="cell-${index}">${cell}</div>`;
        });

        document.querySelector("#gameboard").innerHTML = boardHTML;

        // Attach event listeners once
        document.querySelectorAll(".cell").forEach((cell) => {
            cell.addEventListener("click", Game.handleClick);
        });
    };

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    };

    const getGameboard = () => gameboard;

    return { render, update, getGameboard };
})();

const createPlayer = (name, mark) => {
    return { name, mark };
};

const Game = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const start = () => {
        const player1Name = document.querySelector("#player1").value.trim();
        const player2Name = document.querySelector("#player2").value.trim();

        if (!player1Name || !player2Name) {
            displayController.renderMessage("Please enter both player names.");
            return;
        }

        players = [createPlayer(player1Name, "X"), createPlayer(player2Name, "O")];
        currentPlayerIndex = 0;
        gameOver = false;
        
        Gameboard.render(); 
        
        document.querySelectorAll(".cell").forEach((cell, index) => {
            cell.addEventListener("click", () => handleClick(index));
        });

        displayController.renderMessage(`${players[currentPlayerIndex].name}'s turn`);
    };

    const handleClick = (event) => {
        if (gameOver) return;

        let index = parseInt(event.target.id.split("-")[1]);
        if (Gameboard.getGameboard()[index] !== "") return;

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} wins!`);
        } else if (checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage("It's a tie!");
        } else {
            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        }
    };

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        Gameboard.render();
        gameOver = false;
        displayController.renderMessage("");
    };

    return { start, restart, handleClick };
})();
function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Highlight winning cells
            document.getElementById(`cell-${a}`).classList.add("win");
            document.getElementById(`cell-${b}`).classList.add("win");
            document.getElementById(`cell-${c}`).classList.add("win");
            return true;
        }
    }
    return false;
}



function checkForTie(board) {
    return board.every(cell => cell !== "");
}

const restartButton = document.querySelector("#restart-button");
if (restartButton) restartButton.addEventListener("click", Game.restart);

const startButton = document.querySelector("#start-button");
if (startButton) startButton.addEventListener("click", Game.start);
 