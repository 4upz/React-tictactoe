import React, {Component} from "react";
import Square from "./square";

// Controls board rendering
export default class Board extends Component {
  renderSquare(index) {
    const winningRow = this.props.winningRow;
    return (
      <Square
        key={index}
        value={this.props.squares[index]}
        //Passes the onClick function through the square's prop parameter
        onClick={() => this.props.onClick(index)}
        /* Solution 5: Whether this square is a winning square */
        isWinningSquare={winningRow && winningRow.includes(index)}
      />
    );
  }

  /* Solution 3: Uses two loops to Render rows of squares for the tic-tac-toe board */
  renderBoard(boardSize) {
    let board = [];
    for (let i = 0; i < boardSize; i++) {
      let squareRow = [];
      for (let j = 0; j < boardSize; j++) {
        squareRow.push(this.renderSquare(3 * i + j));
      }
      board.push(
        <div key={i} className="board-row">
          {squareRow}
        </div>
      );
    }
    return board;
  }

  render() {
    /* Solution 3: Using two loops (in helper method) to make the board squares */
    const boardSize = 3;
    return <div>{this.renderBoard(boardSize)}</div>;
  }
}
