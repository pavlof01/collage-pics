import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  CameraRoll,
  FlatList,
  Dimensions,
  ActivityIndicator,
  View,
  StatusBar,
} from 'react-native';
import {
  Container, Tab, Tabs, Button, ScrollableTab,
} from 'native-base';
import { isIphoneX } from 'react-native-iphone-x-helper';
import PropTypes from 'prop-types';
import Photo from '../../components/photo';
import Layouts from '../Layouts';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: '#E7E9EB',
  },
  tabStyle: {
    width: width / 2,
    alignSelf: 'center',
    backgroundColor: '#E7E9EB',
  },
  activeTabStyle: {
    width: width / 2,
    alignSelf: 'center',
    backgroundColor: '#E7E9EB',
  },
  textStyle: {
    fontWeight: '700',
    color: '#7B7C7D',
  },
  activeTextStyle: {
    color: '#000',
    fontWeight: '700',
  },
  layoutsContainer: {
    backgroundColor: '#F6F8FA',
    paddingTop: 30,
    paddingBottom: 30,
    borderTopWidth: 0.3,
    borderTopColor: '#DDDFE0',
  },
  selectedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
});

export default class Main extends Component {
  static navigationOptions = {
    header: () => null,
  }

  constructor() {
    super();
    this.state = {
      albums: {},
      loading: true,
      pickedImages: [],
      currentLayout: { direction: null, matrix: null },
    };
  }

  componentDidMount = () => {
    const albums = {};
    CameraRoll.getPhotos({ groupTypes: 'All', first: 20000 })
      .then((images) => {
        images.edges.forEach(({ node }) => {
          if (albums.hasOwnProperty(node.group_name)) {
            //eslint-disable-line
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
    const {
      albums, loading, currentLayout, pickedImages,
    } = this.state;
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
        <StatusBar hidden />
        {nameAlbums.length ? (
          <Tabs
            style={[styles.tabs, isIphoneX() ? { paddingTop: 30 } : null]}
            tabBarBackgroundColor="#E7E9EB"
            prerenderingSiblingsNumber={20}
            tabBarUnderlineStyle={{ backgroundColor: 'transperent' }}
            renderTabBar={() => <ScrollableTab />}
          >
            {nameAlbums.map(name => (
              <Tab
                tabStyle={[styles.tabStyle]}
                activeTabStyle={styles.activeTabStyle}
                activeTextStyle={styles.activeTextStyle}
                textStyle={styles.textStyle}
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
        <View style={styles.layoutsContainer}>
          <Layouts
            pickedImages={pickedImages}
            pickLayout={this.pickLayout}
            currentLayout={currentLayout}
          />
          {!pickedImages.length || (
            <View style={styles.selectedContainer}>
              <Text>{`${pickedImages.length} Photo Selected`}</Text>
              <Button onPress={this.goNext} style={{ width: 70 }}>
                <Text>Next</Text>
              </Button>
            </View>
          )}
        </View>
      </Container>
    );
  }
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }),
  }),
};
