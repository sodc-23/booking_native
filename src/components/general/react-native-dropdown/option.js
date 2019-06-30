import React, { Component, } from 'react';

import {
  StyleSheet,
  View,
  Text
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
  }
});

class Option extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { style, styleText } = this.props;

    return (
      <View style={[ styles.container, style ]}>
        <Text style={ styleText }>{this.props.children}</Text>
      </View>
    );
  }
}

module.exports = Option;
