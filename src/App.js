import React from 'react';
import './App.css';
import { Container } from 'semantic-ui-react';
import Row from './Components/Row';

class App extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      blockingMoves: [],
      board: [],
      currentPlayer: null,
      gameOver: false,
      message: '',
      player1: 1,
      player2: 2
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
    let board = this.state.board;
    let randomMove = Math.floor(Math.random() * 6);
    let firstCheck = this.checkAll(board);
    let secondCheck = this.checkAlmost(board);
    let blockingMoves = this.state.blockingMoves;
    
    console.log('blockingMoves', blockingMoves);
    // check where row or col or diagonal has 3 pieces
    
    if (firstCheck === this.state.player1) {
      this.setState({ board, gameOver: true, message: 'Player 1 (red) wins!' });
      return;
    }  

    console.log(secondCheck);
  if (secondCheck === this.state.player1) {
    BLOCK:
      for (let i=0; i<blockingMoves.length; i++) {
        if (blockingMoves[i]['c']) {
          // loop below executes computer's move
          for (let r = 5; r >= 0; r--) {
            if (!board[r][blockingMoves[i]['c']]) {
              board[r][blockingMoves[i]['c']] = this.state.player2;
              break BLOCK;
            }
          }
        }
      }
      
      
      console.log('block!');
      
      this.setState({ blockingMoves:[], board, currentPlayer: this.togglePlayer() });
      return;
    } 
    // TODO: RANDOM COMPUTER MOVE

      for (let r = 5; r >= 0; r--) {
        if (!board[r][randomMove]) {
          board[r][randomMove] = this.state.player2;
          break;
        }
      }
      console.log('comp move complete');
  

    // TODO: change decided move by computer below


    // checks result after move
    let result = this.checkAll(board);
  
    if (result === this.state.player2) {
      this.setState({ board, gameOver: true, message: 'Computer wins!' });
    }

    if (result === 'draw') {
      this.setState({ board, gameOver: true, message: 'Draw game.' });
    } 

    

    if(this.state.gameOver) {
      return;
    }
    
    this.setState({ blockingMoves:[], board, currentPlayer: this.togglePlayer() });
    // end of computerMove
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
      
      // Check status of board
      let result = this.checkAll(board);
      if (result === this.state.player1) {
        this.setState({ board, gameOver: true, message: 'Player 1 (red) wins!' });
      }  
      
      // if (result === this.state.player2) {
      //   this.setState({ board: newBoard, gameOver: true, message: 'Computer wins!' });
      // } 
      
      if (result === 'draw') {
        this.setState({ board, gameOver: true, message: 'Draw game.' });
      } 

      this.setState({ board, currentPlayer: this.togglePlayer() });
      this.computerMove(board);
      
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

  checkAlmostVertical() {
    // Check only if row is 3 or greater
    let blockingMoves = this.state.blockingMoves;
    let board = this.state.board;

    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c]) {
          if((board[r][c] === board[r-1][c]) && (board[r][c] === board[r-2][c])) {
            // vertical block scenario
            console.log('hi!');
            if (board[r][c] === 1) {
              blockingMoves.push({r:r-3, c:c});
              return board[r][c];
            } 
          }




          // if (board[r][c] === board[r - 1][c] &&
          //     board[r][c] === board[r - 2][c]) {
          //   return board[r][c];    // set coordinates above and below in state array almost coordinates
          // }
        }


      }      
    }
  }
  
  checkHorizontal(board) {
    // Check only if column is 3 or less
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
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

  checkAlmostHorizontal() {
    // Check only if column is 3 or less
    let blockingMoves = this.state.blockingMoves;
    let board = this.state.board;

    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] && (board[r][c] === 1)) {
          // checks for a horizontal pair
          if(board[r][c] === board[r][c+1]) {
            if( !board[r][c+2] && (board[r][c+3] === board[r][c])) {
              blockingMoves.push({r:r, c:c+2});
              return board[r][c]; 
            } else if ((board[r][c+2] === board[r][c]) && (!board[r][c+3])) {
              if (c <= 3) {
                blockingMoves.push({r:r, c:c+3});
                return board[r][c]; 
              }
              if (c === 4) {
                blockingMoves.push({r:r, c:c-1});
                return board[r][c]; 
              }
            } else if (!board[r][c-1] && (board[r][c-2] === board[r][c])) {
              blockingMoves.push({r:r, c:c-1});
              return board[r][c]; 
            } else if ((board[r][c-1] === board[r][c]) && !board[r][c-2]) {
              blockingMoves.push({r:r, c:c-2});
              return board[r][c]; 
            }
            // horizontal block scenarios
            // one above pair is null // two above is board[r][c]
            // one above is board[r][c] and two above is null
            // one below is null // two below is board[r][c]
            // one below is board[r][c] and two below is null
          }

          // if (board[r][c] === board[r][c + 1] && 
          //     board[r][c] === board[r][c + 2]) {
          //     // adds moves that would make horizontal block
          //     // blockingMoves.push({r: r, c: c-1});
          //     // blockingMoves.push({r: r, c: c+3});
          //   return board[r][c];
          // }


        }
      }
    }
  }
  
  checkDiagonalRight(board) {
    // Check only if row is 3 or greater AND column is 3 or less
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
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

  // TODO: modify this so prioritizes returning 2 for a possible computer win
  checkAlmost() {
    let board = this.state.board;
    return this.checkAlmostVertical(board) || this.checkAlmostHorizontal(board);
    // || this.checkDiagonalRight(board) || this.checkDiagonalLeft(board) || 
  }
  
  checkAll(board) {
    return this.checkVertical(board) || this.checkDiagonalRight(board) || this.checkDiagonalLeft(board) || this.checkHorizontal(board) || this.checkDraw(board);
  }
  
  // componentWillMount() {
  //   this.initBoard();
  // }
  
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

