import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  // This is considered a functiopn component, for a component that only contains a render method and doesn't need to be a class
  function Square(props){
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    )
  }
  
  // Controls board rendering
  class Board extends React.Component {
    renderSquare(index) {
      return (
        <Square 
          value={this.props.squares[index]}
          //Passes the onClick function through the square's prop parameter
          onClick={() => this.props.onClick(index)}
          />
        );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  // Controls the game functionality and overview
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          moveRow: null,
          moveCol: null,
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    handleClick(index) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      // Do nothing if someone has won the game or if the square is already filled
      if (calculateWinner(squares) || squares[index]){
        return;
      }
      squares[index] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
        squares: squares,
        moveCol: index % 3 + 1,
        moveRow: Math.floor(index / 3) + 1,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
        `Go to Move # ${move} - (Col ${step.moveCol}, Row ${step.moveRow})` :
        `Go to Game Start`;
        // Conditional class assignment for bolding currently selected step
        return (<li key={move}> 
          <button className={move===this.state.stepNumber ? 'bold-selection' : null} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>);
      });

      let status;
      if (winner) {
        status = `Winner: ${winner}`;
      } else {
        status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(index) => this.handleClick(index)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  // Analyzes when the game is won and reveals the tic-tac-toe winner
  function calculateWinner(squares){
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
  }