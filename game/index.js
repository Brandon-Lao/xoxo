import { Map } from "immutable";

const MOVE = "MOVE";

export function move(turn, [row, col]) {
	return {
		type: MOVE,
		position: [row, col],
		turn: turn
	};
}

function bad(state, action) {
	if (action.position !== undefined) {
	if (action.position.isArray === false) {
		console.log("Invalid input: Not an array!");
		return "Invalid input!";
	}
	if (
		action.position[0] >= 3 ||
		action.position[0] < 0 ||
		action.position[1] >= 3 ||
		action.position[1] < 0
	) {
		console.log("Invalid input: Not a valid number!")
		return "Invalid input!";
	}
	if (state.board.get(action.position[0]) !== undefined) {
		if (
			state.board.get(action.position[0]).get(action.position[1]) !== undefined
		) {
			console.log("Invalid input: overriding a filled space!");
			return "Cannot override an existing X/O!";
		}
	} }
	else {
		console.log("No errors found!");
		return null;
	}
}

function turnReducer(turn = "X", action) {
	if (action.type === MOVE) {
		return turn === "X" ? "O" : "X";
	}
	return turn;
}

function boardReducer(board = Map(), action) {
	if (action.type === MOVE) {
		return board.setIn(action.position, action.turn);
	}
	return board;
}

const winner = board => {
	let gotWinner = null;
	//Tie Checker
	if (
		board.get(0) !== undefined &&
		board.get(1) !== undefined &&
		board.get(2) !== undefined
	) {
		gotWinner = "draw";
		for (let i = 0; i <= 2; i++) {
			for (let n = 0; n <= 2; n++) {
				if (board.get(i).get(n) === undefined) {
					gotWinner = null;
				}
			}
		}
	}

	//Row Win
	for (let i = 0; i <= 2; i++) {
		if (board.get(i) !== undefined) {
			if (
				board.get(i).get(0) === board.get(i).get(1) &&
				board.get(i).get(1) === board.get(i).get(2)
			) {
				gotWinner = board.get(i).get(0);
			}
		}
	}

	//Column Win
	for (let i = 0; i <= 2; i++) {
		if (
			board.get(0) !== undefined &&
			board.get(1) !== undefined &&
			board.get(2) !== undefined
		) {
			if (
				board.get(0).get(i) === board.get(1).get(i) &&
				board.get(1).get(i) === board.get(2).get(i)
			) {
				gotWinner = board.get(0).get(i);
			}
		}
	}

	//Diagonal Win
	if (
		board.get(0) !== undefined &&
		board.get(1) !== undefined &&
		board.get(2) !== undefined
	) {
		if (
			board.get(0).get(0) === board.get(1).get(1) &&
			board.get(1).get(1) === board.get(2).get(2)
		) {
			gotWinner = board.get(0).get(0);
		}
		if (
			board.get(0).get(2) === board.get(1).get(1) &&
			board.get(1).get(1) === board.get(2).get(0)
		) {
			gotWinner = board.get(1).get(1);
		}
	}
	return gotWinner;
};

export default function reducer(state = {}, action) {
	const error = bad(state, action);
	if (error) return Object.assign({}, state, {error});

	const newBoard = boardReducer(state.board, action);
	const winnerState = winner(newBoard);
	return {
		board: newBoard,
		turn: turnReducer(state.turn, action),
		winner: winnerState
	};
}

// reducer(undefined, {
// 	type: MOVE,
// 	position: [1, 1],
// 	player: 'X'
// });
