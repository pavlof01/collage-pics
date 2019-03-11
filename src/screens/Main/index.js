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
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import {
  Container, Tab, Tabs, ScrollableTab, Icon,
} from 'native-base';
import { isIphoneX } from 'react-native-iphone-x-helper';
import PropTypes from 'prop-types';
import { addPhoto } from '../../actions/pickImages';
import Photo from '../../components/photo';
import Layouts from '../Layouts';
import PhotoSelectedBottomMenu from '../../components/photoSelectedBottomMenu';

const { width, height } = Dimensions.get('window');
const showPhotoCountSelectedDurationAnim = 150;
const expandLayoutsDurationAnim = 300;
const unExpandLayoutsHeight = height / 4.5;
const expandLayoutsHeight = height / 3.6;

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
    paddingTop: 20,
    borderTopWidth: 0.3,
    borderTopColor: '#DDDFE0',
    width,
    position: 'absolute',
    bottom: 0,
  },
  arrow: {
    paddingLeft: 5,
    color: '#D4AEFF',
    fontSize: 32,
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
      opacitylayoutsContainer: new Animated.Value(0),
      layoutsContainerHeight: new Animated.Value(unExpandLayoutsHeight),
      isShowLayouts: false,
      isPickedPhotos: false,
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
    if (!currentLayout.matrix) return alert('Please pick layout');
    navigation.navigate('Collage', { layout: currentLayout });
  }

  expandLayouts = () => {
    Animated.timing(this.state.layoutsContainerHeight, {
      toValue: height,
      duration: expandLayoutsDurationAnim,
    }).start();
  }

  unExpandLayouts = () => {
    Animated.timing(this.state.layoutsContainerHeight, {
      toValue: unExpandLayoutsHeight,
      duration: expandLayoutsDurationAnim,
    }).start(() => {
      this.setState({ isShowLayouts: false }, () => {
        if (this.state.isPickedPhotos) {
          this.showPhotoCountSelected(expandLayoutsHeight, 1);
        }
      });
    });
  }

  showLayouts = () => {
    const { isShowLayouts } = this.state;
    if (isShowLayouts) {
      return this.unExpandLayouts();
    }
    return this.setState({ isShowLayouts: true }, () => this.expandLayouts());
  }

  showPhotoCountSelected = (value, opacity) => {
    Animated.parallel([
      Animated.timing(this.state.layoutsContainerHeight, {
        toValue: value,
        duration: showPhotoCountSelectedDurationAnim,
      }),
      Animated.timing(this.state.opacitylayoutsContainer, {
        toValue: opacity,
        duration: showPhotoCountSelectedDurationAnim,
      }),
    ]).start(() => this.setState({ isPickedPhotos: !!opacity }));
  }

  rTabs = () => {
    const { albums } = this.state;
    const nameAlbums = Object.keys(albums);
    return (
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
              contentContainerStyle={{ paddingBottom: expandLayoutsHeight }}
              data={albums[name]}
              renderItem={this.renderImageItem}
              extraData={this.state}
              numColumns={4}
              getItemLayout={(data, index) => ({
                length: 100,
                offset: 100 * index,
                index,
              })}
            />
          </Tab>
        ))}
      </Tabs>
    );
  }

  render() {
    const {
      loading,
      currentLayout,
      opacitylayoutsContainer,
      layoutsContainerHeight,
      isShowLayouts,
    } = this.state;
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
        {this.rTabs()}
        <Animated.View style={[styles.layoutsContainer, { height: layoutsContainerHeight }]}>
          <View
            style={{
              transform: [{ rotateX: `${isShowLayouts ? '180' : '0'}deg` }],
            }}
          >
            <Icon
              style={styles.arrow}
              onPress={this.showLayouts}
              type="MaterialIcons"
              name="keyboard-arrow-up"
            />
          </View>
          <Layouts
            isShowLayouts={isShowLayouts}
            pickLayout={this.pickLayout}
            currentLayout={currentLayout}
          />
          <Animated.View style={{ opacity: opacitylayoutsContainer }}>
            <PhotoSelectedBottomMenu animate={this.showPhotoCountSelected} goNext={this.goNext} />
          </Animated.View>
        </Animated.View>
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
