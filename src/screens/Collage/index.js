import React from 'react';
import {
  View, Dimensions, StyleSheet, CameraRoll, Text, Animated,
} from 'react-native';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Container, Icon, Button } from 'native-base';
import ViewShot from 'react-native-view-shot';
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
});

class Collage extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: null,
    headerStyle: {
      backgroundColor: '#E7E9EB',
    },
    headerTintColor: '#fff',
    headerTransparent: true,
    headerRight: (
      <View>
        <Button onPress={() => navigation.state.params.onCapture()} transparent>
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
      currentLayout: { direction: 'row', matrix: [] },
      opacityNotification: new Animated.Value(0),
    };
  }

  componentWillMount = () => {
    const { navigation } = this.props;
    const currentLayout = navigation.getParam('layout', []);
    this.setState({ currentLayout });
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ onCapture: this.onCapture });
  }

  showNotification = () => {
    Animated.sequence([
      Animated.timing(
        this.state.opacityNotification,
        {
          toValue: 0.85,
          duration: 300,
        },
      ),
      Animated.timing(
        this.state.opacityNotification,
        {
          delay: 1000,
          toValue: 0,
          duration: 1000,
        },
      ),

    ]).start();
  }


  onCapture = () => {
    this.refs.viewShot.capture().then((uri) => {
      CameraRoll.saveToCameraRoll(uri);
      this.showNotification();
    });
  }

  render() {
    const { currentLayout, opacityNotification } = this.state;
    const { pickedImages } = this.props
    return (
      <Container>
        <View style={styles.body}>
          <View style={styles.collageContainer}>
            <ViewShot ref="viewShot">
              <DynamicCollage
                width={Dimensions.get('window').width / 1.1}
                height={Dimensions.get('window').width / 1.1}
                direction={currentLayout.direction}
                images={pickedImages}
                matrix={currentLayout.matrix}
                containerStyle={styles.collage}
              />
            </ViewShot>
          </View>
          <Animated.View style={[styles.notification, { opacity: opacityNotification }]}>
            <Text style={styles.notificationText}>Photo saved to Camera Roll</Text>
          </Animated.View>
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

const mapStateToProps = (state) => ({
  pickedImages: state.pickedImages
})

export default connect(mapStateToProps,null)(Collage)
