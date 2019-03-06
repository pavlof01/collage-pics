import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { LayoutData } from '../../components/collage';
import Layout from '../../components/layoutItem';

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
      LayoutData[key].forEach(item => layouts.push(item))
    }
    /* eslint-enable */
    this.setState({ layouts });
  }

  renderItem = ({ item }) => {
    const { pickLayout, currentLayout, pickedImages } = this.props;
    const { direction, matrix } = currentLayout;
    const isPicked = direction === item.direction && matrix === item.matrix;
    return (
      <Layout
        item={item}
        pickLayout={pickLayout}
        pickedImages={pickedImages}
        isPicked={isPicked}
      />
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
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  }
}

Layouts.propTypes = {
  pickLayout: PropTypes.func.isRequired,
  currentLayout: PropTypes.object, //eslint-disable-line
  pickedImages: PropTypes.array, //eslint-disable-line
};
