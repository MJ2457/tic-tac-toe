import React, { useEffect, useState } from "react";
import Square from "./Square";

const Board = ({ rounds = 5 }) => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [round, setRound] = useState(1);

  const winner = calculateWinner(squares);
  const draw = calculateDraw(squares);

  useEffect(() => {
    if (winner && !isGameOver) {
      setIsGameOver(true);
      if (winner === "X") {
        setPlayerWins((prev) => prev + 1);
      } else {
        setComputerWins((prev) => prev + 1);
      }
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

  useEffect(() => {
    if (playerWins > rounds / 2 || computerWins > rounds / 2) {
      alert(
        playerWins > computerWins
          ? "Congratulations! You won the series!"
          : "The computer won the series. Better luck next time!"
      );
      resetSeries();
    } else if (isGameOver) {
      setRound((prev) => prev + 1);
    }
  }, [playerWins, computerWins, isGameOver]);

  const handleClick = (i) => {
    if (isGameOver || squares[i] || (!isXNext && !isGameOver)) return;
    const newSquares = squares.slice();
    newSquares[i] = "X";
    setSquares(newSquares);
    setIsXNext(false);
  };

  const makeComputerMove = () => {
    const newSquares = squares.slice();
    // Check for winning or blocking moves
    const move = findBestMove(newSquares, "O") || findBestMove(newSquares, "X") || findRandomMove(newSquares);
    if (move !== null) {
      newSquares[move] = "O";
      setSquares(newSquares);
      setIsXNext(true);
    }
  };

  const findBestMove = (board, player) => {
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
    for (let [a, b, c] of lines) {
      if (board[a] === player && board[b] === player && !board[c]) return c;
      if (board[a] === player && board[c] === player && !board[b]) return b;
      if (board[b] === player && board[c] === player && !board[a]) return a;
    }
    return null;
  };

  const findRandomMove = (board) => {
    const emptySquares = board.map((value, index) => (value === null ? index : null)).filter((value) => value !== null);
    return emptySquares.length > 0
      ? emptySquares[Math.floor(Math.random() * emptySquares.length)]
      : null;
  };

  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(round % 2 === 1);
    setIsGameOver(false);
  };

  const resetSeries = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setIsGameOver(false);
    setPlayerWins(0);
    setComputerWins(0);
    setRound(1);
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
        <span className="text-xl font-semibold text-violet-500">X Player:</span>
        <span className="px-5 py-2 rounded-md border">{playerWins}</span>
      </p>
      <div className="text-xl font-bold mb-4">{`Round ${round} - ${status}`}</div>
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
          Restart Round
        </button>
      </div>
      <p className="flex justify-between w-full">
        <span className="text-xl font-semibold text-red-500">O Player:</span>
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

export default Board;

