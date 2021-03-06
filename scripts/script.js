const PLAYERS_ID = [0, 1]
const PLAYERS_MARKS = ["O", "X"]

const GAME_AREA = document.querySelector(".game-area");

function removeAllElementsChild(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

const Player = (id, mark) => {
  let score = 0;

  const increaseScore = () => {};
  return { id, mark, score }
}


const Gameboard = (() => {
  // const CLEAN_BOARD = [
  //   ["", "", ""],
  //   ["", "", ""],
  //   ["", "", ""],
  // ];

  const CLEAN_BOARD = [
  ["O", "", "X"],
  ["X", "O", ""],
  ["", "", "O"],
  ];

  
  let board = CLEAN_BOARD;

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
    board = CLEAN_BOARD;
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
        if (!board[i][j]) cell.classList.add("selectable");
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
})();

// const gameboard = Gameboard(testBoard);

const player = Player(0, "O");
const win = Gameboard.didWin(player);
const complete = Gameboard.isComplete();
console.log({win});
console.log({complete});
Gameboard.makeMove(player, 2, 0);
Gameboard.render(GAME_AREA);