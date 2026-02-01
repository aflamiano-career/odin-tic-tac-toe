function createPlayer(name, marker) {
  let score = 0;

  function getScore() {
    return score;
  }

  function increaseScore() {
    score++;
  }

  return { name, marker, getScore, increaseScore };
}

const gameboard = (() => {
  const board = [];

  const winPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function getBoard() {
    return board;
  }

  function resetBoard() {
    board.splice(0, board.length);
  }

  function isSquareOpen(index) {
    return board.at(index) === undefined;
  }

  function setMarker(index, marker) {
    board[index] = marker;
  }

  return {
    winPattern,
    getBoard,
    resetBoard,
    isSquareOpen,
    setMarker,
  };
})();

const gameController = (() => {
  let moves = 0;
  let isOver = false;
  let winner = null;

  let players = {};

  function setPlayers(p1name, p2name) {
    players.p1 = createPlayer(p1name, "O");
    players.p2 = createPlayer(p2name, "X");
  }

  const increaseMoveCount = () => moves++;

  function getMoveCount() {
    return moves;
  }

  function resetMoves() {
    moves = 0;
  }

  function getCurrentPlayer() {
    return getMoveCount() % 2 === 0 ? players.p1 : players.p2;
  }

  function hasEnded() {
    return getMoveCount() >= 9 || isOver ? true : false;
  }

  function setHasEnded(state) {
    isOver = state;
  }

  function setWinner(player) {
    winner = player;
  }

  function getWinner() {
    return winner;
  }

  function hasWinner() {
    const winConditions = gameboard.winPattern;
    const currentBoard = gameboard.getBoard();
    return winConditions.some((pattern) => {
      return pattern.every((square) => {
        return currentBoard.at(square) === getCurrentPlayer().marker;
      });
    });

    // Leaving explicitly stated return keywords for familiarization.
    // The return block above can be shortened to the following in the future:
    //
    // return winConditions.some((pattern) =>
    //   pattern.every((square) => currentBoard[square] === player.marker),
    // );
  }

  function playMove(square) {
    let player = getCurrentPlayer();
    if (gameboard.isSquareOpen(square) && !hasEnded()) {
      gameboard.setMarker(square, player.marker);
      if (hasWinner()) {
        setHasEnded(true);
        setWinner(player);
      }
      increaseMoveCount();
    }
  }

  return {
    hasEnded,
    hasWinner,
    playMove,
    setHasEnded,
    getWinner,
    setWinner,
    setPlayers,
    resetMoves,
  };
})();

const displayController = (() => {
  const BOARD_SIZE = 9;
  const boardUI = document.querySelector(".board");

  const playersFormDialog = document.querySelector(".ui-form-dialog");
  const btnPlayersFormSubmit = document.querySelector(".players-form__submit");
  const player1StatsName = document.querySelector(".player1-stats__name");
  const player2StatsName = document.querySelector(".player2-stats__name");

  const btnNewGame = document.querySelector(".btn-new-game");

  (() => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      const square = document.createElement("div");
      square.classList.add("board__square");
      square.setAttribute("data-square", i);
      boardUI.appendChild(square);
    }
  })();

  function showPlayersForm() {
    playersFormDialog.showModal();
  }
  showPlayersForm();

  function showBoard() {
    const squares = Array.from(document.querySelectorAll(".board__square"));
    const currentBoard = gameboard.getBoard();
    squares.forEach((square, index) => {
      square.textContent = currentBoard[index];
    });
  }

  function resetBoard() {
    const squares = Array.from(document.querySelectorAll(".board__square"));
    squares.forEach((square, index) => {
      square.textContent = "";
    });
  }

  function handleMove(e) {
    if (e.target.hasAttribute("data-square")) {
      let square = e.target.getAttribute("data-square");
      if (gameController.hasEnded()) {
        alert(`Game has ended`);
        return;
      }
      gameController.playMove(square);
      showBoard();
      if (gameController.getWinner()) {
        alert(`${gameController.getWinner().name} WINS!`);
        console.log(gameController.getWinner().name);
      }
    }
  }

  function handleReset() {
    gameboard.resetBoard();
    gameController.setWinner(null);
    gameController.setHasEnded(false);
    gameController.resetMoves();

    player1StatsName.textContent = "Player 1";
    player2StatsName.textContent = "Player 2";
    resetBoard();
    showPlayersForm();
  }

  btnPlayersFormSubmit.addEventListener("click", (e) => {
    let p1 = document.querySelector("#player1").value;
    let p2 = document.querySelector("#player2").value;
    player1StatsName.textContent = p1;
    player2StatsName.textContent = p2;

    gameController.setPlayers(p1, p2);

    playersFormDialog.close();
    e.preventDefault();
  });

  boardUI.addEventListener("click", handleMove);
  btnNewGame.addEventListener("click", handleReset);
})();
