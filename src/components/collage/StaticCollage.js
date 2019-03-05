import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

const backgroundColor = '#E86571';

const styles = StyleSheet.create({
  container: {
    padding: 3.5,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#F6F8FA',
  },
  item: {
    flex: 1,
    backgroundColor,
    margin: 1,
    borderRadius: 2,
  },
  image: {
    flex: 1,
    margin: 1,
    borderRadius: 2,
  },
});

class StaticCollage extends React.PureComponent {
  renderMatrix() {
    const {
      matrix, direction, imageStyle, seperatorStyle,
    } = this.props;

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const sectionDirection = direction === 'row' ? 'column' : 'row';

    return matrix.map((element, m, array) => {
      const startIndex = m ? array.slice(0, m).reduce(reducer) : 0;
      const imagesArr = this.props.images.concat([]);
      const countPhoto = matrix.reduce((acc, val) => acc + val);
      imagesArr.length = countPhoto;
      imagesArr.fill(null, this.props.images.length);
      const images = imagesArr.slice(startIndex, startIndex + element).map((image, i) => {
        if (image) {
          return <Image key={i} source={{ uri: image }} style={[styles.image, imageStyle]} />;
        }
        return <View key={i} style={[styles.item]} />;
      });

      return (
        <View key={m} style={[{ flex: 1, flexDirection: sectionDirection }, seperatorStyle]}>
          {images}
        </View>
      );
    });
  }

  render() {
    const {
      width, height, direction, containerStyle,
    } = this.props;

    return (
      <View style={[{ width, height }, styles.container, containerStyle]}>
        <View style={{ flex: 1, flexDirection: direction }}>
          {this.renderMatrix()}
        </View>
      </View>
    );
  }
}

StaticCollage.defaultProps = {
  // VARIABLES
  direction: 'row',
  // STYLE OF SEPERATORS ON THE COLLAGE
  seperatorStyle: {
    borderWidth: 0,
    // borderColor: '#E7E9EB',
  },

  // STYLE
  containerStyle: {
    borderWidth: 4,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  imageStyle: {}, // DEFAULT IMAGE STYLE
};

StaticCollage.propTypes = {
  images: PropTypes.array,
  matrix: PropTypes.array,
  direction: PropTypes.oneOf(['row', 'column']),
};

export { StaticCollage };
