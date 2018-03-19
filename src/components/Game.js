import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Button } from 'react-native';
import shuffle from 'lodash.shuffle';
import RandomNumberContainer from './RandomNumber';

class Game extends React.Component {
  static propTypes = {
    randomNumberAmount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  }

  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  }

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  }

  gameStatus = 'PLAYING';
  
  // [5, 5, 2, 3, 5, 5] 
  arrayRandomNum = Array
    .from({ length: this.props.randomNumberAmount })
    .map(() => 1 + Math.floor(10 * Math.random()));
  
  
  // this array will be use to create components 
  shuffleArrayRandomN = shuffle(this.arrayRandomNum);

  // use the sufffled array... slice it, then add up its numbers using the N given - 2
  // ex. [5, 5, 2, 3] === 15
  target = this.shuffleArrayRandomN
    .slice(0, this.props.randomNumberAmount - 2)
    .reduce((acc, currentValue) => acc + currentValue, 0);

  
  selectNumber = (numberIndex) => {
    this.setState((prevState) => {
      return { selectedIds: [...prevState.selectedIds, numberIndex] };
    });
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState((prevState) => {
        return { remainingSeconds: prevState.remainingSeconds - 1 };
      }, () => {
        if (this.state.remainingSeconds === 0) {
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }

  calcGameStatus = (nextState) => {
    const sumSelected = nextState.selectedIds.reduce((acc, currValue) => {
      return acc + this.shuffleArrayRandomN[currValue];
    }, 0);

    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }
  };

  handlePlayAgain = () => {
    this.props.onPlayAgain(this.gameStatus);
  } 

  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={styles.numbersContainer}>
          {this.shuffleArrayRandomN.map((num, index) => {
            return (
              <RandomNumberContainer
                key={index}
                id={index}
                number={num}
                isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
                onPress={this.selectNumber}
              />
            );
          })}
        </View>
        {this.gameStatus !== 'PLAYING' && (<Button style={styles.button} title='Play Again' onPress={this.handlePlayAgain} /> )}
        <Text style={styles.counter}>
          {this.state.remainingSeconds}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(3,3,3)',
    flex: 1,
    paddingTop: 50,
  },
  target: {
    fontSize: 50,
    backgroundColor: 'white',
    margin: 70,
    textAlign: 'center',
  },
  numbersContainer: {
    backgroundColor: 'rgb(5,5,5)',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'white',
  },
  counter: {
    color: 'white',
    fontSize: 25,
    marginLeft: 20,
    marginBottom: 30,

  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },
  STATUS_WON: {
    backgroundColor: 'green',
  },
  STATUS_LOST: {
    backgroundColor: 'red',
  },

});

export default Game;
