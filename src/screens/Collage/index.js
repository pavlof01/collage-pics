import React, { Component } from 'react';
import {
  View, Dimensions, StyleSheet, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container, Icon, Button, Right,
} from 'native-base';
import { DynamicCollage } from '../../components/collage';

const styles = StyleSheet.create({
  leftHeaderContainer: {
    flexDirection: 'row',
  },
  collageContainer: {
    alignSelf: 'center',
  },
  collage: {
    borderWidth: 10,
    borderColor: '#fff',
  },
  body: {
    backgroundColor: '#E7E9EB',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class Collage extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: null,
    headerStyle: {
      backgroundColor: '#E7E9EB',
    },
    headerTintColor: '#fff',
    headerTransparent: true,
    headerRight: (
      <View>
        <Button transparent>
          <Icon type="AntDesign" name="totop" />
        </Button>
      </View>
    ),
    headerLeft: (
      <View style={styles.leftHeaderContainer}>
        <Button transparent>
          <Icon type="AntDesign" name="close" />
        </Button>
        <Button onPress={() => navigation.goBack()} transparent>
          <Icon type="AntDesign" name="back" />
        </Button>
      </View>
    ),
  })

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
      <Container>
        <View style={styles.body}>
          <View style={styles.collageContainer}>
            <DynamicCollage
              width={Dimensions.get('window').width / 1.1}
              height={Dimensions.get('window').width / 1.1}
              direction={currentLayout.direction}
              images={pickedImages}
              matrix={currentLayout.matrix}
              isStaticCollage
              containerStyle={styles.collage}
            />
          </View>
        </View>
      </Container>
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
