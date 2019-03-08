import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { StaticCollage } from '../collage';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3 - 10

const styles = StyleSheet.create({
  containerLayout: {
    marginHorizontal: 5,
  },
  isPicked: {
    borderColor: '#E88C92',
  },
});

export default class LayoutItem extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { pickedImages, isPicked } = this.props;
    if (pickedImages !== nextProps.pickedImages || isPicked !== nextProps.isPicked) {
      return true;
    }
    return false;
  }

  render() {
    const {
      item, pickLayout, pickedImages, isPicked,
    } = this.props;
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => pickLayout(item)}>
        <StaticCollage
          width={ITEM_SIZE}
          height={ITEM_SIZE}
          direction={item.direction}
          images={pickedImages}
          matrix={item.matrix}
          containerStyle={[styles.containerLayout, isPicked ? styles.isPicked : null]}
        />
      </TouchableOpacity>
    );
  }
}

LayoutItem.propTypes = {
  pickLayout: PropTypes.func.isRequired,
  currentLayout: PropTypes.object, //eslint-disable-line
  item: PropTypes.object, //eslint-disable-line
  pickedImages: PropTypes.array, //eslint-disable-line
  isPicked: PropTypes.bool.isRequired,
};
