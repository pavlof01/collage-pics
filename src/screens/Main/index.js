import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  CameraRoll,
  FlatList,
  Dimensions,
  ActivityIndicator,
  View,
} from 'react-native';
import {
  Container, Tab, Tabs, Button, ScrollableTab,
} from 'native-base';
import PropTypes from 'prop-types';
import Photo from '../../components/photo';
import Layouts from '../Layouts';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  tabStyle: {
    width: width / 2,
    alignSelf: 'center',
  },
});

export default class Main extends Component {
  static navigationOptions = {
    title: 'Albums',
  }

  constructor() {
    super();
    this.state = {
      albums: {},
      loading: true,
      pickedImages: [],
      currentLayout: null,
    };
  }

  componentDidMount = () => {
    const albums = {};
    CameraRoll.getPhotos({ groupTypes: 'All', first: 20000 })
      .then((images) => {
        images.edges.forEach(({ node }) => {
          if (albums.hasOwnProperty(node.group_name)) { //eslint-disable-line
            albums[node.group_name].push(node);
          } else {
            albums[node.group_name] = [];
            albums[node.group_name].push(node);
          }
        });
      })
      .then(() => this.setState({ albums, loading: false }));
  }

  renderImageItem = ({ item }) => <Photo onPressImage={this.pickImage} photo={item} />

  pickImage = (uri) => {
    const { pickedImages } = this.state;
    const newArray = pickedImages;
    const isExist = newArray.includes(uri);
    if (isExist) {
      const bb = newArray.filter(image => image !== uri);
      return this.setState({ pickedImages: bb });
    }
    return this.setState({ pickedImages: [...newArray, uri] });
  }

  pickLayout = (layout) => {
    this.setState({ currentLayout: layout });
  }

  goNext = () => {
    const { pickedImages, currentLayout } = this.state;
    const { navigation } = this.props;
    navigation.setParams({ pickedImages: [] });
    navigation.navigate('Collage', { pickedImages, layout: currentLayout });
  }

  render() {
    const { albums, loading } = this.state;
    const nameAlbums = Object.keys(albums);
    if (loading) {
      return (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator />
          <Text>Loading photo...</Text>
        </View>
      );
    }
    return (
      <Container>
        {nameAlbums.length ? (
          <Tabs prerenderingSiblingsNumber={20} renderTabBar={() => <ScrollableTab />}>
            {nameAlbums.map(name => (
              <Tab
                tabStyle={[styles.tabStyle]}
                activeTabStyle={[styles.tabStyle]}
                key={name}
                heading={name}
              >
                <FlatList
                  keyExtractor={item => `${item.timestamp}`}
                  data={albums[name]}
                  renderItem={this.renderImageItem}
                  extraData={this.state}
                  columnWrapperStyle={{ width }}
                  numColumns={3}
                />
              </Tab>
            ))}
          </Tabs>
        ) : null}
        <View style={{ paddingVertical: 25 }}>
          <Layouts pickLayout={this.pickLayout} />
          <Button full onPress={this.goNext}>
            <Text>Next</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
