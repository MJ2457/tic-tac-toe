import React, { useEffect, useState } from "react";
import Square from "./Square";

const Board = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);

  const winner = calculateWinner(squares);
  const draw = calculateDraw(squares);

  useEffect(() => {
    if (winner && !isGameOver) {
      setIsGameOver(true);
      if (winner === "X") setPlayerWins((prev) => prev + 1);
      else setComputerWins((prev) => prev + 1);
    } else if (draw && !isGameOver) {
      setIsGameOver(true);
    }
  }, [winner, draw, isGameOver]);

  useEffect(() => {
    if (!isXNext && !isGameOver) {
      const timeoutId = setTimeout(() => makeComputerMove(), 500);
      return () => clearTimeout(timeoutId);
    }
  }, [isXNext, isGameOver]);

  const handleClick = (i) => {
    if (isGameOver || squares[i] || (!isXNext && !isGameOver)) return;
    const newSquares = squares.slice();
    newSquares[i] = "X";
    setSquares(newSquares);
    setIsXNext(false);
  };

  const makeComputerMove = () => {
    const emptySquares = squares
      .map((value, index) => (value === null ? index : null))
      .filter((value) => value !== null);
    const randomMove =
      emptySquares[Math.floor(Math.random() * emptySquares.length)];
    if (randomMove !== undefined) {
      const newSquares = squares.slice();
      newSquares[randomMove] = "O";
      setSquares(newSquares);
      setIsXNext(true);
    }
  };

  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setIsGameOver(false);
  };

  const renderSquare = (i) => (
    <Square key={i} value={squares[i]} onClick={() => handleClick(i)} />
  );

  const status = winner
    ? `Winner: ${winner}`
    : draw
    ? "Draw!"
    : `Next player: ${isXNext ? "X" : "O"}`;

  return (
    <div className="w-full flex flex-col items-center">
      <p className="flex justify-between w-full">
        <span className="text-xl font-semibold text-violet-500">X Player:</span>{" "}
        <span className="px-5 py-2 rounded-md border">{playerWins}</span>
      </p>
      <div className="text-xl font-bold mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-1">
        {Array(9)
          .fill(null)
          .map((_, i) => renderSquare(i))}
      </div>

      <div className="py-5">
        <button
          onClick={handleRestart}
          className="px-5 py-2 rounded-md bg-violet-500 text-white"
        >
          Restart Game
        </button>
      </div>
      <p className="flex justify-between w-full">
        <span className="text-xl font-semibold text-red-500">O Player:</span>{" "}
        <span className="px-5 py-2 rounded-md border">{computerWins}</span>
      </p>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const calculateDraw = (squares) => {
  return (
    squares.every((square) => square !== null) && !calculateWinner(squares)
  );
};

/*
  This code checks if there is a winner or if the game ends in a draw in a Tic-Tac-Toe game. Here's a breakdown:

### Code Functionality:
1. **Iterating Through Winning Lines**:
   ```javascript
   for (let i = 0; i < lines.length; i++) {
     const [a, b, c] = lines[i];
   }
   ```
   - `lines` is expected to be an array of arrays, where each sub-array contains three indices representing possible winning combinations (e.g., `[0, 1, 2]` for the top row).
   - The `for` loop iterates over each possible winning combination.
   - `const [a, b, c] = lines[i];` destructures the indices of the current winning line.

2. **Checking for a Winner**:
   ```javascript
   if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
     return squares[a];
   }
   ```
   - `squares` is an array representing the current state of the game board (e.g., `["X", "O", null, ...]`).
   - `squares[a]`: Checks if the first square in the line is not `null` (a move has been made).
   - `squares[a] === squares[b] && squares[a] === squares[c]`: Ensures all three squares in the line contain the same value (either "X" or "O").
   - If a winning line is found, the value of the winning player (`"X"` or `"O"`) is returned immediately.

3. **Checking for a Draw**:
   ```javascript
   if (squares.every((square) => square !== null)) {
     return "draw";
   }
   ```
   - `squares.every((square) => square !== null)`: Checks if all squares are filled (no `null` values).
   - If the board is full and no winner is found, the game is a draw, and `"draw"` is returned.

4. **No Winner or Draw**:
   ```javascript
   return null;
   ```
   - If no winning line is found and there are still empty squares, the game continues, and `null` is returned.

### Example Scenario:
Given `lines = [[0, 1, 2], [3, 4, 5], ...]` and `squares = ["X", "X", "X", null, "O", null, null, null, "O"]`:
1. The loop evaluates `[0, 1, 2]`:
   - `squares[0] === "X"`, `squares[1] === "X"`, and `squares[2] === "X"`.
   - A winner is found, and `"X"` is returned.

If `squares = ["X", "O", "X", "O", "X", "O", "O", "X", "O"]` (full board with no winner):
1. The loop finds no winning line.
2. `squares.every((square) => square !== null)` evaluates to `true`.
3. `"draw"` is returned.*/

export default Board;
