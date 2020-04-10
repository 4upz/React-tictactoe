/* React */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
/* Components & Styling */
import './index.css';
import Board from './components/board';
/* Material UI */
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button'; //Uses Material Core as Button reference
import IconButton from '@material-ui/core/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
  
  // Controls the game functionality and overview
  class Game extends Component {
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
        hasDescendingHistory: false,
      };
    }

    handleClick(index) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      // Do nothing if someone has won the game or if the square is already filled
      if (calculatedWinner(squares).winner || squares[index]){
        return;
      }
      squares[index] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
        squares: squares,
        /* Solution 1: How to calculate columns and rows for recording move locations */
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

    /* Solution 4: Helper function for ascending/descending list items after sort button is clicked */
    sortHistory(){
      this.setState({
        hasDescendingHistory: !this.state.hasDescendingHistory,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      /* Solution 5: New variables to account for game progress and results if there is a winner */
      const gameProgress = calculatedWinner(current.squares);
      const winner = gameProgress.winner;
      const winningRow = gameProgress.winningRow;

      const moves = history.map((step, move) => {
        /* Solution 1: Displaying the move location in the history list */
        const desc = move ?
        `Go to Move # ${move} - (Col ${step.moveCol}, Row ${step.moveRow})` :
        `Go to Game Start`;
        /* Solution 2: Conditional class assignment for bolding currently selected step */
        return (<li key={move}> 
          <Button variant="contained" size="small" color={move===this.state.stepNumber ? "primary" : "default"} onClick={() => this.jumpTo(move)}>{desc}</Button>
        </li>);
      });

      /* Solution 4: Display the list of move history based on selected sort method */
      if (this.state.hasDescendingHistory) moves.reverse();

      let status;
      if (winner) {
        status = `${winner} is the winner!`;
      } 
      /* Solution 6: Extra condition for declaring a tie when the maximum moves are made with no winner */
      else if (this.state.stepNumber >= current.squares.length) {
        status = 'The game is a tie!';
      } 
      else {
        status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
      }

      return (
        <Container maxwidth="sm" className="game">
        <div className="game-title">
          <h1>Tic-Tac-Toe</h1>
        </div>
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(index) => this.handleClick(index)}
              winningRow={winningRow}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            {/* Solution 4: Added sort button with listener.*/}
            <ol>{moves}</ol>
            <IconButton arialabel="sort" size="small" onClick={() => this.sortHistory()}>
              {this.state.hasDescendingHistory ?  <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />}
            </IconButton>
          </div>
        </Container>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  // Analyzes when the game is won and reveals the tic-tac-toe winner
  function calculatedWinner(squares){
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
        /* Solution 5: New return values that now includes the winning row of squares */
        return {
          winner: squares[a],
          winningRow: lines[i]
        };
      }
    }
    return {
      winner: null,
      winningRow: null
    };
  }