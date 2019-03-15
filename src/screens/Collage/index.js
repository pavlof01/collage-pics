import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  CameraRoll,
  Text,
  Animated,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import PropTypes from 'prop-types';
import { Container, Icon, Button } from 'native-base';
import ViewShot from 'react-native-view-shot';
import { DynamicCollage } from '../../components/collage';
import PhotoEditContainer from '../../components/photoEditContainer';

const { PESDK } = NativeModules;
const { height, width } = Dimensions.get('window');
const durationPhotoEditContainerAnim = 300;
const photoEditContainerHeight = height / 5;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E7E9EB',
  },
  leftHeaderContainer: {
    flexDirection: 'row',
  },
  collageContainer: {
    alignSelf: 'center',
  },
  collage: {
    backgroundColor: '#fff',
  },
  body: {
    backgroundColor: '#E7E9EB',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification: {
    position: 'absolute',
    width: 250,
    height: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  notificationText: {
    color: '#fff',
  },
  bottomMenu: {
    backgroundColor: '#E7E9EB',
    height: height / 11,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
});

class Collage extends React.PureComponent {
  static navigationOptions = {
    header: () => null,
  }

  constructor() {
    super();
    this.state = {
      currentLayout: { direction: 'row', matrix: [] },
      opacityNotification: new Animated.Value(0),
      opacityCollageContainer: new Animated.Value(0),
      scaleCollageContainer: new Animated.Value(0),
      translateYPhotoEditContainer: new Animated.Value(photoEditContainerHeight),
      translateYCollage: new Animated.Value(0),
      translateYHeader: new Animated.Value(0),
      aspectRatioWidth: 1.1,
      aspectRatioHeight: 1.1,
      outerMargin: new Animated.Value(5),
      innerMargin: 2,
      borderRadius: new Animated.Value(0),
    };
    this.sliderValue = null;
  }

  componentWillMount = () => {
    const { navigation } = this.props;
    const currentLayout = navigation.getParam('layout', []);
    this.setState({ currentLayout });
    // this.eventEmitter = new NativeEventEmitter(NativeModules.PESDK);
    // this.eventEmitter.addListener('PhotoEditorDidCancel', () => {
    //   console.warn("PhotoEditorDidCancel")
    //   // The photo editor was cancelled.
    //   // Delete photo from tmp
    //   // const { currentPhotoPath } = this.state;
    //   // RNFS.exists(currentPhotoPath).then((res) => {
    //   //   if (res) {
    //   //     RNFS.unlink(currentPhotoPath)
    //   //       .then(() => console.warn('FILE DELETED'))
    //   //       .catch(err => console.warn(err));
    //   //   }
    //   // });
    //   // Alert.alert('PESDK did Cancel', '...do what you need to do.', { cancelable: true });
    // });
    // this.eventEmitter.addListener('PhotoEditorDidSave', (body) => {
    //   console.warn("PhotoEditorDidSave")
    //   // The body contains the edited image in JPEG and NSData representation and
    //   const path = `${RNFS.TemporaryDirectoryPath}test.jpg`
    //   RNFS.writeFile(path,body.image,'base64').then(() => {
    //     console.warn(path);
    //     // CameraRoll.saveToCameraRoll(path)
    //   })
    // });
    // this.eventEmitter.addListener('PhotoEditorDidFailToGeneratePhoto', () => {
    //   console.warn("PhotoEditorDidFailToGeneratePhoto")
    //   // The photo editor could not create a photo.
    //   // Alert.alert('PESDK did Fail to generate a photo.', 'Please try again.', { cancelable: true });
    // });
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ onCapture: this.onCapture });
    this.collageContainerAnim();
  }

  onAspectRatioChange = (value) => {
    const { aspectRatioHeight, aspectRatioWidth } = this.state;
    // console.warn(aspectRatioHeight);
    const valH = 0.05;
    const valW = 0.05;
    if (this.sliderValue > value) {
      if (aspectRatioWidth >= 1.1) {
        this.setState({
          aspectRatioHeight: this.state.aspectRatioHeight + valH,
          // aspectRatioWidth: this.state.aspectRatioWidth - valW,
        });
      } else {
        this.setState({
          aspectRatioHeight: this.state.aspectRatioHeight + valH,
          aspectRatioWidth: this.state.aspectRatioWidth - valW,
        });
      }
    } else {
      if (aspectRatioHeight >= 1.1) {
        this.setState({
          // aspectRatioHeight: this.state.aspectRatioHeight - valH,
          aspectRatioWidth: this.state.aspectRatioWidth + valW,
        });
      } else {
        this.setState({
          aspectRatioHeight: this.state.aspectRatioHeight - valH,
          aspectRatioWidth: this.state.aspectRatioWidth + valW,
        });
      }
    }
    this.sliderValue = value;
  }

  onChangeOuterMargin = (value) => {
    Animated.timing(this.state.outerMargin, {
      toValue: value,
    }).start();
  }

  onChangeInnerMargin = (value) => {
    // Animated.timing(this.state.innerMargin, {
    //   toValue: value,
    // }).start();
    this.setState({ innerMargin: value });
  }

  onChangeBorderRadius = (value) => {
    Animated.timing(this.state.borderRadius, {
      toValue: value,
    }).start();
  }

  showNotificationAnim = () => {
    Animated.sequence([
      Animated.timing(this.state.opacityNotification, {
        toValue: 0.85,
        duration: 300,
      }),
      Animated.timing(this.state.opacityNotification, {
        delay: 1000,
        toValue: 0,
        duration: 1000,
      }),
    ]).start();
  }

  collageContainerAnim = () => {
    Animated.parallel([
      Animated.timing(this.state.opacityCollageContainer, {
        toValue: 1,
        duration: 450,
      }),
      Animated.timing(this.state.scaleCollageContainer, {
        toValue: 1,
        duration: 450,
      }),
    ]).start();
  }

  showPhotoEditContainer = (translateYPhotoEditContainer, translateYHeader, translateYCollage) => {
    Animated.parallel([
      Animated.timing(this.state.translateYPhotoEditContainer, {
        toValue: translateYPhotoEditContainer,
        duration: durationPhotoEditContainerAnim,
      }),
      Animated.timing(this.state.translateYHeader, {
        toValue: translateYHeader,
        duration: durationPhotoEditContainerAnim,
      }),
      Animated.timing(this.state.translateYCollage, {
        toValue: translateYCollage,
        duration: durationPhotoEditContainerAnim,
      }),
    ]).start();
  }

  onCapture = () => {
    this.refs.viewShot.capture().then((uri) => {
      PESDK.present(uri);
      // CameraRoll.saveToCameraRoll(uri);
      // this.showNotificationAnim();
    });
  }

  render() {
    const {
      currentLayout,
      opacityNotification,
      opacityCollageContainer,
      scaleCollageContainer,
      translateYPhotoEditContainer,
      translateYCollage,
      translateYHeader,
      aspectRatioWidth,
      aspectRatioHeight,
      outerMargin,
      innerMargin,
      borderRadius,
    } = this.state;
    const { pickedImages, navigation } = this.props;
    const showPhotoEditContainer = () => this.showPhotoEditContainer(0, -100, -100);
    const hidePhotoEditContainer = () => this.showPhotoEditContainer(photoEditContainerHeight, 0, 0);
    // console.disableYellowBox = true;
    return (
      <Container style={{ backgroundColor: '#E7E9EB' }}>
        <Animated.View
          style={[styles.headerContainer, { transform: [{ translateY: translateYHeader }] }]}
        >
          <View style={styles.leftHeaderContainer}>
            <Button transparent>
              <Icon type="AntDesign" name="close" />
            </Button>
            <Button onPress={() => navigation.goBack()} transparent>
              <Icon type="AntDesign" name="back" />
            </Button>
          </View>
          <View>
            <Button onPress={() => navigation.state.params.onCapture()} transparent>
              <Icon type="AntDesign" name="totop" />
            </Button>
          </View>
        </Animated.View>
        <View style={styles.body}>
          <Animated.View
            style={[
              styles.collageContainer,
              {
                opacity: opacityCollageContainer,
                transform: [{ scale: scaleCollageContainer }, { translateY: translateYCollage }],
              },
            ]}
          >
            <ViewShot ref="viewShot">
              <DynamicCollage
                width={width / aspectRatioWidth}
                height={width / aspectRatioHeight}
                direction={currentLayout.direction || 'row'}
                images={pickedImages || []}
                matrix={currentLayout.matrix || [1, 1]}
                containerStyle={styles.collage}
                outerMargin={outerMargin}
                innerMargin={innerMargin}
                borderRadius={borderRadius}
              />
            </ViewShot>
          </Animated.View>
          <Animated.View style={[styles.notification, { opacity: opacityNotification }]}>
            <Text style={styles.notificationText}>Photo saved to Camera Roll</Text>
          </Animated.View>
        </View>
        <View style={styles.bottomMenu}>
          {/* <TouchableOpacity onPress={showPhotoEditContainer}>
            <Icon type="Ionicons" name="ios-qr-scanner" />
          </TouchableOpacity> */}
          <PhotoEditContainer
          onAspectRatioChange={this.onAspectRatioChange}
          onChangeOuterMargin={this.onChangeOuterMargin}
          onChangeInnerMargin={this.onChangeInnerMargin}
          onChangeBorderRadius={this.onChangeBorderRadius}
          hidePhotoEditContainer={hidePhotoEditContainer}
          translateYPhotoEditContainer={translateYPhotoEditContainer}
        />
        </View>
        {/* <PhotoEditContainer
          onAspectRatioChange={this.onAspectRatioChange}
          onChangeOuterMargin={this.onChangeOuterMargin}
          onChangeInnerMargin={this.onChangeInnerMargin}
          onChangeBorderRadius={this.onChangeBorderRadius}
          hidePhotoEditContainer={hidePhotoEditContainer}
          translateYPhotoEditContainer={translateYPhotoEditContainer}
        /> */}
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

const mapStateToProps = state => ({
  pickedImages: state.pickedImages,
});

export default connect(
  mapStateToProps,
  null,
)(Collage);
