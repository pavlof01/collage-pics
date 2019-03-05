import React from 'react';
import {
  View, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { LayoutData, StaticCollage } from '../../components/collage';

const samplePhoto = require('../../../assets/img/sample.png');

const styles = StyleSheet.create({
  containerLayout: {
    marginHorizontal: 5,
  },
  isPicked: {
    borderColor: '#E88C92',
  },
});

export default class Layouts extends React.PureComponent {
  static navigationOptions = {
    header: () => null,
  }

  constructor() {
    super();
    this.state = {
      layouts: [],
    };
  }

  componentDidMount = () => {
    const layouts = [];
    /* eslint-disable */
    for (key in LayoutData) {
      LayoutData[key].forEach(item => layouts.push(item));
    }
    /* eslint-enable */
    this.setState({ layouts });
  }

  renderItem = ({ item }) => {
    const { pickLayout, currentLayout, pickedImages } = this.props;
    const { direction, matrix } = currentLayout;
    const isPicked = direction === item.direction && matrix === item.matrix;
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => pickLayout(item)}>
        <StaticCollage
          width={100}
          height={100}
          direction={item.direction}
          images={pickedImages}
          matrix={item.matrix}
          isStaticCollage={false}
          containerStyle={[styles.containerLayout, isPicked ? styles.isPicked : null]}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const { layouts } = this.state;
    return (
      <View>
        <FlatList
          keyExtractor={(item, index) => `${[...item.matrix]}${index}`}
          renderItem={this.renderItem}
          data={layouts}
          horizontal
          showsHorizontalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
          initialNumToRender={10} // 10
          // removeClippedSubviews // false
          maxToRenderPerBatch={10} // 10
          onEndReachedThreshold={0.5}
          updateCellsBatchingPeriod={50} // 50
          windowSize={21} // 21
          // legacyImplementation // false
        />
      </View>
    );
  }
}

Layouts.propTypes = {
  pickLayout: PropTypes.func.isRequired,
};
