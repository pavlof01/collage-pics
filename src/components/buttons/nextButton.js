import React, { Component } from 'react';
import {
  Text, StyleSheet, View, TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 30,
    backgroundColor: '#E80C7B',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900'
  }
});

export default class NextButton extends Component {
  render() {
    const { title, onPress } = this.props
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
