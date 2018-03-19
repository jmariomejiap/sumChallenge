import React from 'react';
import Game from './Game';

export default class App extends React.Component {
  state = {
    gameId: 1,
    randomNC: 6,
    initialSeconds: 14,
    wins: 0,
    lost: 0,
  }

  gameWon = () => {
    this.setState((prevState) => {
      return {
        wins: prevState.wins + 1,
        lost: prevState.lost - 1,
      };
    });
  }

  gameLost = () => {
    this.setState((prevState) => {
      return {
        lost: prevState.lost + 1,
        wins: prevState.wins - 1,
      };
    });
  }

  resetGame = (veredict) => {
    if (veredict === 'WON') {
      this.gameWon();
    }
    if (veredict === 'LOST') {
      this.gameLost();
    }

    this.setState((prevState) => {
      if (prevState.wins > 6) {
        return { 
          gameId: prevState.gameId + 1,
          randomNC: 8,
          initialSeconds: 12,
        };  
      }
      if (prevState.lost > 4) {
        return { 
          gameId: prevState.gameId + 1,
          randomNC: 4,
          initialSeconds: 12,
        };
      }

      return { 
        gameId: prevState.gameId + 1,
        randomNC: 6,
        initialSeconds: 14,
      };
    });
  }

  render() {
    return (
      <Game
        key={this.state.gameId}
        randomNumberAmount={this.state.randomNC}
        initialSeconds={this.state.initialSeconds}
        onPlayAgain={this.resetGame}
        onGameWon={this.gameWon}
        onGameLost={this.gameLost}
      />
    );
  }
}
