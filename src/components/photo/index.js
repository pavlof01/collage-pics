import React, { Component } from 'react';
import {
  StyleSheet, TouchableOpacity, Image, Dimensions,
} from 'react-native';
import ProptTypes from 'prop-types';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  imageContainer: {
    height: 100,
    maxWidth: width / 3,
    flex: 1,
    borderWidth: 3,
    borderColor: '#fff',
  },
  image: {
    flex: 1,
  },
  selected: {
    borderColor: 'red',
  },
});

export default class Photo extends Component {
  constructor() {
    super();
    this.state = {
      selected: false,
    };
  }

  pickImage = () => {
    const { selected } = this.state;
    const { photo, onPressImage } = this.props;
    onPressImage(photo.image.uri);
    this.setState({ selected: !selected });
  }

  render() {
    const { selected } = this.state;
    const { photo } = this.props;
    return (
      <TouchableOpacity
        onPress={this.pickImage}
        style={[styles.imageContainer, !selected || styles.selected]}
      >
        <Image style={styles.image} source={{ uri: photo.image.uri }} />
      </TouchableOpacity>
    );
  }
}

Photo.propTypes = {
  photo: ProptTypes.shape({
    uri: ProptTypes.string.isRequired,
  }).isRequired,
  onPressImage: ProptTypes.func.isRequired,
};
