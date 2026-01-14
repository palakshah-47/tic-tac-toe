import React from 'react';
import { useState, useEffect } from 'react';

export const TicTacToe = ({ rows, columns }) => {
	const [grid, setGrid] = useState(
		Array(rows)
			.fill(null)
			.map(() => Array(columns).fill(null))
	);

	const PLAYER_MARKER = {
		1: 'X',
		2: 'O',
	};

	const [currentPlayer, setCurrentPlayer] = useState(1);

	const [roundWinner, setRoundWinner] = useState(null);
	const [score, setScore] = useState({
		X: 0,
		O: 0,
	});

	const matchWinner = score.X === 2 ? '1' : score.O === 2 ? '2' : null;
	// Optimized winner check: only inspect the row, column and possible diagonals
	// that are affected by the last move. This reduces work from O(n^2)
	// (full-board scan) to O(n) per move. It also safely handles non-square
	// boards by using rows/cols separately and only checking diagonals when
	// the board is square.
	const getWinner = (grid, lastRow, lastCol) => {
		const rowsCount = grid.length;
		const colsCount = grid[0]?.length ?? 0;

		// If lastRow/lastCol not provided (fallback), perform a safe full scan
		// but using rowsCount/colsCount instead of assuming a square board.
		if (lastRow === undefined || lastCol === undefined) {
			// Check rows
			for (let r = 0; r < rowsCount; r++) {
				const first = grid[r][0];
				if (first == null) continue;
				let allSame = true;
				for (let c = 1; c < colsCount; c++) {
					if (grid[r][c] !== first) {
						allSame = false;
						break;
					}
				}
				if (allSame) return first;
			}

			// Check columns
			for (let c = 0; c < colsCount; c++) {
				const first = grid[0][c];
				if (first == null) continue;
				let allSame = true;
				for (let r = 1; r < rowsCount; r++) {
					if (grid[r][c] !== first) {
						allSame = false;
						break;
					}
				}
				if (allSame) return first;
			}

			// Diagonals only make sense for square boards
			if (rowsCount === colsCount && rowsCount > 0) {
				const d1 = grid[0][0];
				if (d1 != null) {
					let allSame = true;
					for (let i = 1; i < rowsCount; i++) {
						if (grid[i][i] !== d1) {
							allSame = false;
							break;
						}
					}
					if (allSame) return d1;
				}

				const d2 = grid[0][colsCount - 1];
				if (d2 != null) {
					let allSame = true;
					for (let i = 1; i < rowsCount; i++) {
						if (grid[i][colsCount - 1 - i] !== d2) {
							allSame = false;
							break;
						}
					}
					if (allSame) return d2;
				}
			}

			return null;
		}

		// Fast path: only check lines that could be completed by the last move
		const val = grid[lastRow][lastCol];
		if (val == null) return null;

		// Check the affected row
		let win = true;
		for (let c = 0; c < colsCount; c++) {
			if (grid[lastRow][c] !== val) {
				win = false;
				break;
			}
		}
		if (win) return val;

		// Check the affected column
		win = true;
		for (let r = 0; r < rowsCount; r++) {
			if (grid[r][lastCol] !== val) {
				win = false;
				break;
			}
		}
		if (win) return val;

		// Check main diagonal (only if board is square and cell is on the diagonal)
		if (rowsCount === colsCount && lastRow === lastCol) {
			win = true;
			for (let i = 0; i < rowsCount; i++) {
				if (grid[i][i] !== val) {
					win = false;
					break;
				}
			}
			if (win) return val;
		}

		// Check anti-diagonal (only if board is square and cell is on that diagonal)
		if (rowsCount === colsCount && lastRow + lastCol === colsCount - 1) {
			win = true;
			for (let i = 0; i < rowsCount; i++) {
				if (grid[i][colsCount - 1 - i] !== val) {
					win = false;
					break;
				}
			}
			if (win) return val;
		}

		return null;
	};

	const handleCellClick = (row, col) => {
		if (grid[row][col] || matchWinner || roundWinner) return;
		const newGrid = grid.map((r, rIdx) =>
			rIdx === row ? r.map((cell, cIdx) => (cIdx === col ? currentPlayer : cell)) : r
		);
		setGrid(newGrid);

		// Pass last move coordinates to the optimized winner check so it only
		// inspects the row/column/diagonals affected by this move.
		const winner = getWinner(newGrid, row, col);

		if (winner) {
			setRoundWinner(winner);			
			setScore((prev) => ({
				...prev,
				[PLAYER_MARKER[winner]]: (prev[PLAYER_MARKER[winner]] ?? 0) + 1,
			}));			
		} else if (newGrid.every((row) => row.every((cell) => cell !== null))) {
			setRoundWinner('Tie');
		} else {
			setCurrentPlayer((p) => (p === 1 ? 2 : 1));
		}
	};

	useEffect(() => {
		setTimeout(() => {
			resetRound();
		}, 1000);
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
		setScore({ X: 0, O: 0 });
	};

	return (
		<div
			style={{
				textAlign: 'center',
				fontFamily: 'sans-serif',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<h2>Tic Tac Toe (Best of 3)</h2>

			<div>
				<strong>Score</strong> — Player 1: {score.X} | Player 2: {score.O}
			</div>

			{!roundWinner && !matchWinner && (
				<div style={{ marginTop: 8 }}>
					Player <strong>{currentPlayer}</strong>'s Turn ({PLAYER_MARKER[currentPlayer]})
				</div>
			)}

			{roundWinner && (
				<div style={{ marginTop: 8 }}>
					{roundWinner === 'Tie'
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
					display: 'grid',
					gridTemplateColumns: `repeat(${columns}, 80px)`,
					gap: '8px',
					justifyContent: 'center',
				}}
			>
				{grid.map((row, rIdx) =>
					row.map((cell, cIdx) => (
						<button
							key={`${rIdx}-${cIdx}`}
							onClick={() => handleCellClick(rIdx, cIdx)}
							style={{ width: 80, height: 80, fontSize: 32 }}
						>
							{cell ? PLAYER_MARKER[cell] : ''}
						</button>
					))
				)}
			</div>
			<button style={{ marginTop: '10px', width: '200px' }} onClick={() => resetRound()}>
				Reset Round
			</button>
			<button style={{ marginTop: '10px', width: '200px' }} onClick={() => resetMatch()}>
				Reset Match
			</button>
		</div>
	);
};
