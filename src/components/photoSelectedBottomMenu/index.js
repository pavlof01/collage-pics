import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NextButton from '../buttons/nextButton';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  selectedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  text: {
    fontSize: 16,
    opacity: 0.7,
  },
  boldText: {
    fontWeight: '700',
  },
  button: {
    width: '30%',
  },
});

export class PhotoSelectedMenu extends Component {
  static propTypes = {
    pickedImages: PropTypes.array.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    const { animate } = this.props;
    if (nextProps.pickedImages.length) {
      animate(height / 3.6, 1);
    } else {
      animate(height / 4.5, 0);
    }
  }

  render() {
    const { pickedImages, goNext } = this.props;
    const nextScreen = () => goNext();
    return (
      <View style={[styles.selectedContainer]}>
        <Text style={styles.text}>
          <Text style={styles.boldText}>{pickedImages.length || 1}</Text>
          {' '}
          Photo Selected
        </Text>
        <NextButton title="Next" onPress={nextScreen} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  pickedImages: state.pickedImages,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhotoSelectedMenu);
