function removeAllElementsChild(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

const Player = (id, mark, name, scoreElement, nameElement) => {
  let score = 0;

  const increaseScore = () => {
    score++;
  };

  const getScore = () => score;

  const render = () => {
    scoreElement.textContent = score;
    nameElement.textContent = name;
  }
  
  return { id, mark, getScore, increaseScore, render };
}


const Gameboard = () => {
  const CLEAN_BOARD = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  
  let board = JSON.parse(JSON.stringify(CLEAN_BOARD));

  const didWin = (player) => {
    const diagOne = [board[0][0], board[1][1], board[2][2]];
    const diagOneStartsWithPlayerMark = diagOne[0] === player.mark;
    const diagOneMarksAreEqual = diagOne[0] === diagOne[1] && diagOne[1] === diagOne[2];
    if (diagOneStartsWithPlayerMark && diagOneMarksAreEqual) {
      return true;
    }

    const diagTwo = [board[0][2], board[1][1], board[2][0]];
    const diagTwoStartsWithPlayerMark = diagTwo[0] === player.mark;
    const diagTwoMarksAreEqual = diagTwo[0] === diagTwo[1] && diagTwo[1] === diagTwo[2];
    if (diagTwoStartsWithPlayerMark && diagTwoMarksAreEqual) {
      return true;
    }
  
    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      const rowStartsWithPlayerMark = row[0] === player.mark;
      const rowMarksAreEqual = row[0] === row[1] && row[1] === row[2];
      if (rowStartsWithPlayerMark && rowMarksAreEqual) {
        return true;
      }
      const col = [board[i][0], board[i][1], board[i][2]];
      const colStartsWithPlayerMark = col[0] === player.mark;
      const colMarksAreEqual = col[0] === col[1] && col[1] === col[2];
      if (rowStartsWithPlayerMark && rowMarksAreEqual) {
        return true;
      }
    }
    return false;
  };

  const isComplete = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === "") return false;
      }
    }
    return true;
  }

  const resetBoard = () => {
    board = JSON.parse(JSON.stringify(CLEAN_BOARD));
  }

  const render = (gameArea) => {
    removeAllElementsChild(gameArea);

    let boardElement = document.createElement("div");
    boardElement.classList.add("board");

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.classList.add(`cell--${i}${j}`);
        if (j === 1) cell.classList.add("board--cc");
        if (i === 1) cell.classList.add("board--cr");
        cell.textContent = board[i][j];
        boardElement.appendChild(cell);
      }
    }
    gameArea.appendChild(boardElement);
  }

  const isEmpty = (row, col) => !board[row][col];

  const makeMove = (player, row, col) => {
    if (isEmpty(row, col)) {
      board[row][col] = player.mark;
    }
  }

  return { didWin, isComplete, resetBoard, render, makeMove }
};


const displaycontroller = (() => {
  const PLAYERS_ID = [0, 1]
  const PLAYERS_MARKS = ["O", "X"]
  const GAME_AREA = document.querySelector(".game-area");
  const NEW_GAME = document.querySelector(".btn-new-game");
  const BOARD_SIZE = 3;
  const DEFAULT_NAME_ONE = "Player 1";
  const DEFAULT_NAME_TWO = "Player 2";
  const SCORE_PLAYER_ONE_EL = document.querySelector(".p1-score");
  const SCORE_PLAYER_TWO_EL = document.querySelector(".p2-score");
  const NAME_PLAYER_ONE_EL = document.querySelector(".p1-name");
  const NAME_PLAYER_TWO_EL = document.querySelector(".p2-name");

  let playerOne = Player(
    PLAYERS_ID[0], 
    PLAYERS_MARKS[0],
    DEFAULT_NAME_ONE,
    SCORE_PLAYER_ONE_EL,
    NAME_PLAYER_ONE_EL,  
  );
  let playerTwo = Player(
    PLAYERS_ID[1], 
    PLAYERS_MARKS[1],
    DEFAULT_NAME_TWO,
    SCORE_PLAYER_TWO_EL,
    NAME_PLAYER_TWO_EL,
  );
  let players = [playerOne, playerTwo];
  let currentPlayerId = playerOne.id;
  const gameboard = Gameboard();

  const isGameOver = () => {
    return gameboard.isComplete() || 
      gameboard.didWin(playerOne) || 
      gameboard.didWin(playerTwo);
  }

  const updateScores = () => {
    for (let i = 0; i < players.length; i++) {
      if (gameboard.didWin(players[i])) {
        players[i].increaseScore();
      }
    }
  }

  const renderScores = () => {
    for (let i = 0; i < players.length; i++) {
      players[i].render();
    }
  }

  const newGame = () => {
    renderScores();
    gameboard.resetBoard();
    gameboard.render(GAME_AREA);
    updateSelectFunctions();
  }

  const start = () => {
    NEW_GAME.addEventListener("click", newGame);
    newGame();
  }

  const select = (row, col) => {
    return () => {
      gameboard.makeMove(players[currentPlayerId], row, col);
      switchPlayers();
      gameboard.render(GAME_AREA);
      if (!isGameOver()) {
        updateSelectFunctions();
      } else {
        updateScores();
        renderScores();
      }
    }
  }

  const updateSelectFunctions = () => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = document.querySelector(`.cell--${i}${j}`);
        if (!cell.textContent) {
          cell.classList.add("selectable");
          cell.addEventListener("click", select(i, j));
        }
      }
    }
  }

  const switchPlayers = () => {
    currentPlayerId = (currentPlayerId + 1) % 2;
  }

  const test = () => {
    gameboard.makeMove(playerOne, 2, 0);
    gameboard.makeMove(playerTwo, 1, 1);
    gameboard.render(GAME_AREA);
  }
  return { test, start };
})();

displaycontroller.start();