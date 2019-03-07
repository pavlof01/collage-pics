import React from 'react';
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
import { connect } from 'react-redux';
import {
  Container, Tab, Tabs, Button, ScrollableTab,
} from 'native-base';
import { isIphoneX } from 'react-native-iphone-x-helper';
import PropTypes from 'prop-types';
import { addPhoto } from '../../actions/pickImages';
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

class Main extends React.Component {
  static navigationOptions = {
    header: () => null,
  }

  constructor() {
    super();
    this.state = {
      albums: {},
      loading: true,
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

  pickImage = uri => this.props.addPhotoItem(uri)

  pickLayout = (layout) => {
    this.setState({ currentLayout: layout });
  }

  goNext = () => {
    const { currentLayout } = this.state;
    const { navigation } = this.props;
    navigation.navigate('Collage', { layout: currentLayout });
  }

  render() {
    const { albums, loading, currentLayout } = this.state;
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
            tabBarUnderlineStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
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
                  getItemLayout={(data, index) => ({
                    length: 100,
                    offset: 100 * index,
                    index,
                  })}
                />
              </Tab>
            ))}
          </Tabs>
        ) : null}
        <View style={styles.layoutsContainer}>
          <Layouts pickLayout={this.pickLayout} currentLayout={currentLayout} />
          <View style={styles.selectedContainer}>
            {/* <Text>{`${pickedImages.length} Photo Selected`}</Text> */}
            <Button onPress={this.goNext} style={{ width: 70 }}>
              <Text>Next</Text>
            </Button>
          </View>
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

const mapDispatchToProps = dispatch => ({
  addPhotoItem: photo => dispatch(addPhoto(photo)),
});

export default connect(
  null,
  mapDispatchToProps,
)(Main);
