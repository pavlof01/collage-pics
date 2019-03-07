import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LayoutData } from '../../components/collage';
import Layout from '../../components/layoutItem';

class Layouts extends React.PureComponent {
  static navigationOptions = {
    header: () => null,
  }

  constructor() {
    super();
    this.state = {
      layouts: [],
      viewableLayouts: [],
    };
  }

  componentDidMount = () => {
    const layouts = [];
    /* eslint-disable */
    for (key in LayoutData) {
      LayoutData[key].forEach(item => layouts.push(item))
    }
    /* eslint-enable */
    const viewableLayouts = layouts.slice(0, 6);
    this.setState({ layouts, viewableLayouts });
  }

  renderItem = ({ item }) => {
    const { viewableLayouts } = this.state;
    const isVisible = viewableLayouts.includes(item);
    const { pickLayout, currentLayout, pickedImages } = this.props;
    const { direction, matrix } = currentLayout;
    const isPicked = direction === item.direction && matrix === item.matrix;
    return (
      <Layout
        item={item}
        pickLayout={pickLayout}
        pickedImages={isVisible ? pickedImages : []}
        isPicked={isPicked}
      />
    );
  }

  onViewablePhotosChanged = ({ viewableItems, changed }) => {
    const { layouts } = this.state;
    const viewableLayouts = [];
    const firstIndex = viewableItems[0].index;
    const lastIndex = viewableItems[viewableItems.length - 1].index;
    const forwardItems = layouts.slice(lastIndex, lastIndex + 3);
    const lastItems = layouts.slice(firstIndex - 3, firstIndex);
    viewableItems.forEach(({ item }) => viewableLayouts.push(item));
    const largerViewableLayouts = viewableLayouts.concat(forwardItems).concat(lastItems)
    this.setState({ viewableLayouts: largerViewableLayouts });
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
            length: 110,
            offset: 110 * index,
            index,
          })}
          onViewableItemsChanged={this.onViewablePhotosChanged}
          onEndReached={() => console.warn('onEndReached')}
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

const mapStateToProps = state => ({
  pickedImages: state.pickedImages,
});

export default connect(
  mapStateToProps,
  null,
)(Layouts);
