import React from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LayoutData } from '../../components/collage';
import Layout from '../../components/layoutItem';

const { width } = Dimensions.get('window');

const ITEM_SIZE = width / 3 - 10;

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
    const { isShowLayouts } = this.props;
    const isVisible = viewableLayouts.includes(item);
    const { pickLayout, currentLayout, pickedImages } = this.props;
    const { direction, matrix } = currentLayout;
    const isPicked = direction === item.direction && matrix === item.matrix;
    return (
      <Layout
        item={item}
        pickLayout={pickLayout}
        pickedImages={isVisible || isShowLayouts ? pickedImages : []}
        isPicked={isPicked}
      />
    );
  }

  onViewablePhotosChanged = ({ viewableItems }) => {
    const { layouts } = this.state;
    const viewableLayouts = [];
    const firstIndex = viewableItems[0].index;
    const lastIndex = viewableItems[viewableItems.length - 1].index;
    const forwardItems = layouts.slice(lastIndex, lastIndex + 3);
    const lastItems = layouts.slice(firstIndex - 3, firstIndex);
    viewableItems.forEach(({ item }) => viewableLayouts.push(item));
    const largerViewableLayouts = viewableLayouts.concat(forwardItems).concat(lastItems);
    this.setState({ viewableLayouts: largerViewableLayouts });
  }

  render() {
    const { layouts } = this.state;
    const { isShowLayouts } = this.props;
    return (
      <View>
        <FlatList
          key={isShowLayouts ? 'v' : 'h'}
          keyExtractor={(item, index) => `${[...item.matrix]}${index}`}
          renderItem={this.renderItem}
          data={layouts}
          horizontal={!isShowLayouts}
          numColumns={isShowLayouts ? 3 : 1}
          columnWrapperStyle={isShowLayouts ? { paddingBottom: 30 } : null}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: ITEM_SIZE,
            offset: ITEM_SIZE * index,
            index,
          })}
          contentContainerStyle={isShowLayouts ? { paddingBottom: 100 } : null}
          onViewableItemsChanged={isShowLayouts ? null : this.onViewablePhotosChanged}
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
