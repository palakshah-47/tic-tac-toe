import React from "react";
import { useState, useEffect } from "react";

export const TicTacToe = ({ rows, columns }) => {
  const [grid, setGrid] = useState(
    Array(rows)
      .fill(null)
      .map(() => Array(columns).fill(null))
  );

  const PLAYER_MARKER = {
    1: "X",
    2: "O",
  };

  const [currentPlayer, setCurrentPlayer] = useState(1);

  const [roundWinner, setRoundWinner] = useState(null);
  const [score, setScore] = useState({
    1: 0,
    2: 0,
  });

  const matchWinner = score[1] === 2 ? 1 : score[2] === 2 ? 2 : null;

  const getWinner = (grid) => {
    const size = grid.length;

    //check rows
    for (let r = 0; r < size; r++) {
      const firstRow = grid[r][0];
      if (firstRow && grid[r].every((cell) => cell === firstRow)) {
        return firstRow;
      }
    }

    //check columns
    for (let c = 0; c < size; c++) {
      const firstColumn = grid[0][c];
      if (firstColumn && grid.every((row) => row[c] === firstColumn)) {
        return firstColumn;
      }
    }

    //check diagonal
    const daig1 = grid[0][0];
    if (daig1 && grid.every((row, i) => row[i] === daig1)) {
      return daig1;
    }
    const daig2 = grid[0][size - 1];
    if (daig2 && grid.every((row, i) => row[size - 1 - i] === daig2)) {
      return daig2;
    }
    return null;
  };

  const handleCellClick = (row, col) => {
    if (grid[row][col] || matchWinner || roundWinner) return;
    const newGrid = grid.map((r, rIdx) =>
      rIdx === row
        ? r.map((cell, cIdx) => (cIdx === col ? currentPlayer : cell))
        : r
    );
    setGrid(newGrid);

    const winner = getWinner(newGrid);

    if (winner) {
      setRoundWinner(winner);
      setScore((prev) => ({
        ...prev,
        [PLAYER_MARKER[winner]]: prev[PLAYER_MARKER[winner]],
      }));
      // setTimeout(() => {
      //   resetRound();
      // }, 1000);
    } else if (newGrid.every((row) => row.every((cell) => cell !== null))) {
      setRoundWinner("Tie");
    } else {
      setCurrentPlayer((p) => (p === 1 ? 2 : 1));
    }
  };

  useEffect(() => {
    console.log("winners symbol", roundWinner);
  }, [roundWinner]);

  const resetRound = () => {
    setGrid(
      Array(rows)
        .fill(null)
        .map(() => Array(columns).fill(null))
    );
    setRoundWinner(null);
    setCurrentPlayer(1);
  };

  const resetMatch = () => {
    resetRound();
    setScore({ 1: 0, 2: 0 });
  };

  console.log("score", score);

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>Tic Tac Toe (Best of 3)</h2>

      <div>
        <strong>Score</strong> — Player 1: {score[PLAYER_MARKER[currentPlayer]]}{" "}
        | Player 2: {score[PLAYER_MARKER[currentPlayer]]}
      </div>

      {!roundWinner && !matchWinner && (
        <div style={{ marginTop: 8 }}>
          Player <strong>{currentPlayer}</strong>'s Turn (
          {PLAYER_MARKER[currentPlayer]})
        </div>
      )}

      {roundWinner && (
        <div style={{ marginTop: 8 }}>
          {roundWinner === "Tie"
            ? "It's a Tie!"
            : `Player ${roundWinner} wins the round!`}
        </div>
      )}

      {matchWinner && (
        <div style={{ marginTop: 8 }}>
          🎉 Player <strong>{matchWinner}</strong> wins the match!
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 80px)`,
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <button
              key={`${rIdx}-${cIdx}`}
              onClick={() => handleCellClick(rIdx, cIdx)}
              style={{ width: 80, height: 80, fontSize: 32 }}
            >
              {cell ? PLAYER_MARKER[cell] : ""}
            </button>
          ))
        )}
      </div>
      <button
        style={{ marginTop: "10px", width: "200px" }}
        onClick={() => resetRound()}
      >
        Reset Round
      </button>
      <button
        style={{ marginTop: "10px", width: "200px" }}
        onClick={() => resetMatch()}
      >
        Reset Match
      </button>
    </div>
  );
};
