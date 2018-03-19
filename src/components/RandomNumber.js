import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

class RandomNumContainer extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isRequired,
  }

  handlePress = () => {
    this.props.onPress(this.props.id);
  }

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Text style={[styles.randomNum, this.props.isDisabled && styles.isDisabled]}>
          {this.props.number}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  randomNum: {
    backgroundColor: 'white',
    width: 100,
    marginHorizontal: 15,
    marginVertical: 25,
    fontSize: 35,
    textAlign: 'center',
  },
  isDisabled: {
    opacity: 0.3,
  }

});

export default RandomNumContainer;