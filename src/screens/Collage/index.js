import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { DynamicCollage } from '../../components/collage';

export default class Collage extends Component {
  constructor() {
    super();
    this.state = {
      pickedImages: [],
      currentLayout: { direction: 'row', matrix: [] },
    };
  }

  componentWillMount = () => {
    const { navigation } = this.props;
    const pickedImages = navigation.getParam('pickedImages', []);
    const currentLayout = navigation.getParam('layout', []);
    this.setState({ pickedImages, currentLayout });
  }

  render() {
    const { pickedImages, currentLayout } = this.state;
    return (
      <View>
        <DynamicCollage
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').width}
          direction={currentLayout.direction}
          images={pickedImages}
          matrix={currentLayout.matrix}
          isStaticCollage
        />
      </View>
    );
  }
}

Collage.propTypes = {
  navigation: PropTypes.shape({
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
