import { Map } from "immutable";

const MOVE = "MOVE";

export function move(turn, [row, col]) {
	return {
		type: MOVE,
		position: [row, col],
		turn: turn
	};
}

function turnReducer(turn = "X", action) {
	if (action.type === MOVE) {
		return turn === 'X' ? 'O' : 'X'
	}
	return turn;
}

function boardReducer(board = Map(), action) {
	if (action.type === MOVE) {
		return board.setIn(action.position, action.turn);
	}
	return board
}

export default function reducer(state = {}, action) {
	const newBoard = boardReducer(state.board, action);
	const winnerState = winner(newBoard);
	return {
		board: newBoard,
		turn: turnReducer(state.turn, action),
		winner: winnerState
	};
}

const winner = board => {
  let gotWinner = null;
  //Tie Checker
  if (board.get(0) !== undefined && board.get(1) !== undefined && board.get(2) !== undefined) {
    gotWinner = 'draw';
    for (let i = 0; i<= 2; i++) {
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
      if (board.get(i).get(0) === board.get(i).get(1) && board.get(i).get(1) === board.get(i).get(2)) {
        gotWinner = board.get(i).get(0);
      }
    }
  }

  //Column Win
  for (let i=0; i<=2; i++) {
    if (board.get(0) !== undefined && board.get(1) !== undefined && board.get(2) !== undefined) {
      if (board.get(0).get(i) === board.get(1).get(i) && board.get(1).get(i) === board.get(2).get(i)) {
        gotWinner = board.get(0).get(i);
      }
    }
  }

  //Diagonal Win
  if (board.get(0) !== undefined && board.get(1) !== undefined && board.get(2) !== undefined) {
    if (board.get(0).get(0) === board.get(1).get(1) && board.get(1).get(1) === board.get(2).get(2)){
      gotWinner = board.get(0).get(0);
    }
    if (board.get(0).get(2) === board.get(1).get(1) && board.get(1).get(1) === board.get(2).get(0)) {
      gotWinner = board.get(1).get(1);
    }
  }
  return gotWinner;
};
