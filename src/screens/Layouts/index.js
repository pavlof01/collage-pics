import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { LayoutData, DynamicCollage } from '../../components/collage';

const samplePhoto = require('../../../assets/img/sample.png');

export default class Layouts extends Component {
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
    const { pickLayout } = this.props;
    const images = [];
    const countImages = item.matrix.reduce((acc, val) => acc + val);
    images.length = countImages;
    images.fill(samplePhoto, 0, countImages);
    return (
      <TouchableOpacity onPress={() => pickLayout(item)}>
        <DynamicCollage
          width={100}
          height={100}
          direction={item.direction}
          images={images}
          matrix={item.matrix}
          isStaticCollage={false}
          containerStyle={{ borderWidth: 0, marginHorizontal: 5 }}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const { layouts } = this.state;
    return (
      <View>
        <FlatList
          renderItem={this.renderItem}
          data={layouts}
          horizontal
        />
      </View>
    );
  }
}

Layouts.propTypes = {
  pickLayout: PropTypes.shape({
    direction: PropTypes.string,
    matrix: PropTypes.array,
  }),
};
