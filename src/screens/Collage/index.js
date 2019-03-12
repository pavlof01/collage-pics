import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  CameraRoll,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Icon, Button } from 'native-base';
import ViewShot from 'react-native-view-shot';
import { DynamicCollage } from '../../components/collage';
import PhotoEditContainer from '../../components/photoEditContainer';

const { height } = Dimensions.get('window');
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
      aspectRatioWidth: 1.2,
      aspectRatioHeight: 1.2,
      outerMargin: new Animated.Value(5),
      innerMargin: 2,
      borderRadius: new Animated.Value(0),
    };
  }

  componentWillMount = () => {
    const { navigation } = this.props;
    const currentLayout = navigation.getParam('layout', []);
    this.setState({ currentLayout });
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ onCapture: this.onCapture });
    this.collageContainerAnim();
  }

  onAspectRatioChange = (value) => {
    if (value > 2.1 / 2) {
      this.setState({ aspectRatioHeight: value });
    } else {
      this.setState({ aspectRatioWidth: value });
    }
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
      CameraRoll.saveToCameraRoll(uri);
      this.showNotificationAnim();
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
                width={Dimensions.get('window').width / aspectRatioWidth}
                height={Dimensions.get('window').width / aspectRatioHeight}
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
          <TouchableOpacity onPress={showPhotoEditContainer}>
            <Icon type="Ionicons" name="ios-qr-scanner" />
          </TouchableOpacity>
        </View>
        <PhotoEditContainer
          onAspectRatioChange={this.onAspectRatioChange}
          onChangeOuterMargin={this.onChangeOuterMargin}
          onChangeInnerMargin={this.onChangeInnerMargin}
          onChangeBorderRadius={this.onChangeBorderRadius}
          hidePhotoEditContainer={hidePhotoEditContainer}
          translateYPhotoEditContainer={translateYPhotoEditContainer}
        />
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
