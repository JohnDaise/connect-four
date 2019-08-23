import React from 'react';
import './App.css';
import { Button, Container } from 'semantic-ui-react';
import Row from './Components/Row';
import io from 'socket.io-client';



class App extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      player1: 1,
      player2: 2,
      currentPlayer: null,
      board: [],
      gameOver: false,
      message: ''
    };
  }

  componentDidMount(){
    this.initBoard(); 
  }
  
  // Starts new game
  initBoard() {
    // Create a blank 6x7 matrix
    let board = [];
    for (let r = 0; r < 6; r++) {
      let row = [];
      for (let c = 0; c < 7; c++) { row.push(null) }
      board.push(row);
    }
    
    this.setState({
      board,
      currentPlayer: this.state.player1,
      gameOver: false,
      message: ''
    });
  }


  computerMove = () => {
    if(this.state.gameOver) {
      return;
    }
    // this.play();

    // program computer to be smarter
    // select c in priority

    // let options = [];
    // options[0] = [];  // computer wins
    // options[1] = [];  // block player from winning
    // options[2] = []; // random move
    // options[3] = []; // give away win 

    // // loop thru each column
    // let cell;
    // for (let r = 5; r >= 0; r--) { 
    //   // if column full go to the next column
      
      
    // }


    // let c; 

    // if (options[0]>0) {
    //   c = options[0][0]; // just picks the first option to win
    // } else if (options[1]>0) {
    //   c = options[1][0]; 
    // } else if (options[2]>0) {
    //   c = options[2][0]; 
    // } else if (options[3]>0) {
    //   c = options[3][0]; 
    // }



    let board = this.state.board;
    for (let r = 5; r >= 0; r--) {
      if (!board[r][0]) {
        board[r][0] = this.state.player2;
        break;
      }
    }


    
    this.setState({ board, currentPlayer: this.togglePlayer() });
  }
  
  togglePlayer() {
    return (this.state.currentPlayer === this.state.player1) ? this.state.player2 : this.state.player1;
  }


  
  play = (c) => {
    if (!this.state.gameOver) {
      // Place piece on board
      let board = this.state.board;
      for (let r = 5; r >= 0; r--) {
        if (!board[r][c]) {
          board[r][c] = this.state.player1;
          break;
        }
      }

      // this.computerMove();
      // Check status of board
      let result = this.checkAll(board);
      if (result === this.state.player1) {
        this.setState({ board, gameOver: true, message: 'Player 1 (red) wins!' });
      } else if (result === this.state.player2) {
        this.setState({ board, gameOver: true, message: 'Computer wins!' });
      } else if (result === 'draw') {
        this.setState({ board, gameOver: true, message: 'Draw game.' });
      } else {
        this.computerMove();
        this.setState({ board, currentPlayer: this.togglePlayer() });
      }
    } else {
      this.setState({ message: 'Game over. Please start a new game.' });
    }
  }


  
  checkVertical(board) {
    // Check only if row is 3 or greater
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r - 1][c] &&
              board[r][c] === board[r - 2][c] &&
              board[r][c] === board[r - 3][c]) {
            return board[r][c];    
          }
        }
      }
    }
  }
  
  checkHorizontal(board) {
    // Check only if column is 3 or less
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r][c + 1] && 
              board[r][c] === board[r][c + 2] &&
              board[r][c] === board[r][c + 3]) {
            return board[r][c];
          }
        }
      }
    }
  }
  
  checkDiagonalRight(board) {
    // Check only if row is 3 or greater AND column is 3 or less
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r - 1][c + 1] &&
              board[r][c] === board[r - 2][c + 2] &&
              board[r][c] === board[r - 3][c + 3]) {
            return board[r][c];
          }
        }
      }
    }
  }
  
  checkDiagonalLeft(board) {
    // Check only if row is 3 or greater AND column is 3 or greater
    for (let r = 3; r < 6; r++) {
      for (let c = 3; c < 7; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r - 1][c - 1] &&
              board[r][c] === board[r - 2][c - 2] &&
              board[r][c] === board[r - 3][c - 3]) {
            return board[r][c];
          }
        }
      }
    }
  }
  
  checkDraw(board) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] === null) {
          return null;
        }
      }
    }
    return 'draw';    
  }
  
  checkAll(board) {
    return this.checkVertical(board) || this.checkDiagonalRight(board) || this.checkDiagonalLeft(board) || this.checkHorizontal(board) || this.checkDraw(board);
  }
  
  componentWillMount() {
    this.initBoard();
  }
  
  render() {
    return (
      <Container textAlign="center">
        <h1>CONNECT FOUR</h1> 
        <table>
          <thead>
          </thead>
          <tbody>
            {this.state.board.map((row, i) => (<Row key={i} row={row} play={this.play} computerMove={this.computerMove} />))}
          </tbody>
        </table>
        <br></br>
        {/* <Button size="massive" onClick={() => {this.initBoard()}}>New Game</Button> */}
        <button onClick={() => {this.initBoard()}}>New Game</button>
        <br></br>
        <p className="message">{this.state.message}</p>
      </Container>
    );
  }
}



export default App;

// let socket;
   
// sendBoard(value) {
//   socket.emit('chat message', value);
// };


// if(!socket) {
//    socket = io(':3001');
// };
