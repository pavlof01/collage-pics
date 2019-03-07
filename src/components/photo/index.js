import React from 'react';
import {
  StyleSheet, TouchableOpacity, Image, Dimensions, View,
} from 'react-native';
import ProptTypes from 'prop-types';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  imageContainer: {
    height: 100,
    maxWidth: width / 3 - 9,
    width: width / 3 - 9,
    flex: 1,
    borderWidth: 3,
    borderColor: '#fff',
    margin: 3,
  },
  image: {
    flex: 1,
  },
  selected: {
    borderColor: 'red',
  },
  maskSelectedItem: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
    opacity: 0.3,
  },
});

export default class Photo extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      selected: false,
    };
  }

  pickImage = () => {
    const { selected } = this.state;
    const { photo, onPressImage } = this.props;
    this.setState({ selected: !selected });
    requestAnimationFrame(() => {
      onPressImage(photo.image.uri);
    });
  }

  render() {
    const { selected } = this.state;
    const { photo } = this.props;
    return (
      <TouchableOpacity
        onPress={this.pickImage}
        style={[styles.imageContainer, !selected || styles.selected]}
        activeOpacity={1}
      >
        <View style={{ flex: 1 }}>
          <Image style={styles.image} source={{ uri: photo.image.uri }} />
          {!selected || <View style={styles.maskSelectedItem} />}
        </View>
      </TouchableOpacity>
    );
  }
}

Photo.propTypes = {
  photo: ProptTypes.shape({
    uri: ProptTypes.string,
  }).isRequired,
  onPressImage: ProptTypes.func.isRequired,
};
