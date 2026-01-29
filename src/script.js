function createGameboard() {
  const gameboard = [];

  const winPattern = {
    0: [0, 1, 2],
    1: [3, 4, 5],
    2: [6, 7, 8],
    3: [0, 3, 6],
    4: [1, 4, 7],
    5: [2, 5, 8],
    6: [0, 4, 8],
    7: [2, 4, 6],
  };

  function showBoard() {
    console.log(gameboard);
  }

  function getBoard() {
    return gameboard;
  }

  function isSquareOpen(index) {
    return gameboard.at(index) === undefined;
  }

  function setMarker(index, marker) {
    gameboard[index] = marker;
  }

  function getWinCondition() {
    return winPattern;
  }

  return {
    showBoard,
    getBoard,
    setMarker,
    isSquareOpen,
    getWinCondition,
  };
}

function createPlayer(name, marker) {
  const moves = [];

  function getMoves() {
    return moves;
  }

  function setMove(index) {
    moves.push(index);
  }

  return {
    name,
    marker,
    getMoves,
    setMove,
  };
}

const player1 = createPlayer("John", "O");
const player2 = createPlayer("Jane", "X");
console.log(player1.marker);
console.log(player2.marker);

const game = (() => {
  let moveCount = 0;
  const board = createGameboard();

  function getMoveCount() {
    return moveCount;
  }

  function increaseMoveCount() {
    moveCount++;
  }

  function isWon(player) {
    console.log("Checking for winner");
    const wincon = board.getWinCondition();
    const currentBoard = board.getBoard();
    for (key in wincon) {
      if (
        wincon[key].every((square) => currentBoard[square] === player.marker)
      ) {
        return true;
      }
    }
    return false;
  }

  function isOver() {
    return getMoveCount() >= 9 ? true : false;
  }

  function playerMove(index, player) {
    if (isOver()) {
      return "The game has ended. You can no longer play any moves.";
    }

    if (index >= 9) {
      return "Index out of bounds";
    }

    if (!board.isSquareOpen(index)) {
      return "Square has been taken";
    }

    board.setMarker(index, player.marker);
    player.setMove(index);
    increaseMoveCount();
    console.log(
      `The players have moved: ${getMoveCount()} ${getMoveCount() < 2 ? "move" : "moves"}`,
    );

    if (getMoveCount() >= 5) {
      console.log(`Did this player win? ${isWon(player)}`);
    }

    return "Move accepted";
  }

  return { playerMove, isWon };
})();

// WIN CHECK
// console.log(game.playerMove(1, player1));
// console.log(game.playerMove(6, player2));
// console.log(game.playerMove(2, player1));
// console.log(game.playerMove(7, player2));
// console.log(game.playerMove(4, player1));
// console.log(game.playerMove(8, player2));

// GAME END CHECK
console.log(game.playerMove(0, player1));
console.log(game.playerMove(1, player2));
console.log(game.playerMove(2, player1));
console.log(game.playerMove(3, player2));
console.log(game.playerMove(5, player1));
console.log(game.playerMove(4, player2));
console.log(game.playerMove(6, player1));
console.log(game.playerMove(8, player2));
console.log(game.playerMove(7, player1));

// SQUARE UNAVAILABLE / OUT OF BOUNDS CHECK
console.log(game.playerMove(8, player2));
console.log(game.playerMove(9, player2));
