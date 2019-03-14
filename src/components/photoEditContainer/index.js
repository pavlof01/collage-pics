import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Slider,
  TouchableOpacity,
} from 'react-native';
import { Icon, Button } from 'native-base';

const { height, width } = Dimensions.get('window');
const photoEditContainerHeight = height / 5;

const styles = StyleSheet.create({
  photoEdit: {
    position: 'absolute',
    bottom: 0,
  },
  photoEditContainer: {
    height: photoEditContainerHeight,
    backgroundColor: '#fff',
    width,
    padding: 15,
    justifyContent: 'space-between',
  },
  checkIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    marginLeft: 10,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  active: {
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default class PhotoEditContainer extends Component {
  constructor() {
    super();
    this.state = {
      currentEditor: 'aspectRatio',
    };
  }

  renderEditor = () => {
    const { currentEditor } = this.state;
    const { onAspectRatioChange, onChangeOuterMargin, onChangeInnerMargin, onChangeBorderRadius } = this.props;
    switch (currentEditor) {
      case 'aspectRatio':
        return (
          <CommonSlider
            title="ASPECT RATIO"
            minimumValue={0}
            maximumValue={2}
            step={0.1}
            value={1}
            onSliderChange={onAspectRatioChange}
          />
        );
      case 'outerMargin':
        return (
          <CommonSlider
            title="OUTER MARGIN"
            minimumValue={0}
            maximumValue={30}
            step={1}
            value={5}
            onSliderChange={onChangeOuterMargin}
          />
        );
      case 'innerMargin':
        return (
          <CommonSlider
            title="INNER MARGIN"
            minimumValue={0}
            maximumValue={10}
            step={0.5}
            value={2}
            onSliderChange={onChangeInnerMargin}
          />
        );
      case 'cornerRadius':
        return (
          <CommonSlider
            title="CORNER RADIUS"
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={0}
            onSliderChange={onChangeBorderRadius}
          />
        );
      case 'shadow':
        return (
          <CommonSlider
            title="SHADOW"
            minimumValue={0.1}
            maximumValue={2.1}
            step={0.01}
            value={2.1 / 2}
            onSliderChange={() => {}}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { currentEditor } = this.state;
    const { translateYPhotoEditContainer, hidePhotoEditContainer, onAspectRatioChange } = this.props;
    return (
      <Animated.View
        style={[styles.photoEdit, { transform: [{ translateY: 0 /* translateYPhotoEditContainer */ }] }]}
      >
        <View style={styles.photoEditContainer}>
          {/* <CommonSlider onSliderChange={onAspectRatioChange} /> */}
          {this.renderEditor()}
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={[currentEditor === 'aspectRatio' ? styles.active : null]}
              onPress={() => this.setState({ currentEditor: 'aspectRatio' })}
            >
              <Icon type="Ionicons" name="ios-qr-scanner" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[currentEditor === 'outerMargin' ? styles.active : null]}
              onPress={() => this.setState({ currentEditor: 'outerMargin' })}
            >
              <Icon type="Ionicons" name="ios-qr-scanner" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[currentEditor === 'innerMargin' ? styles.active : null]}
              onPress={() => this.setState({ currentEditor: 'innerMargin' })}
            >
              <Icon type="Ionicons" name="ios-qr-scanner" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[currentEditor === 'cornerRadius' ? styles.active : null]}
              onPress={() => this.setState({ currentEditor: 'cornerRadius' })}
            >
              <Icon type="Ionicons" name="ios-qr-scanner" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[currentEditor === 'shadow' ? styles.active : null]}
              onPress={() => this.setState({ currentEditor: 'shadow' })}
            >
              <Icon type="Ionicons" name="ios-qr-scanner" />
            </TouchableOpacity>
          </View>
        </View>
        <Button onPress={hidePhotoEditContainer} style={styles.checkIcon} transparent>
          <Icon type="Ionicons" name="ios-checkmark-circle-outline" />
        </Button>
      </Animated.View>
    );
  }
}

const CommonSlider = ({
  title,
  onSliderChange,
  minimumValue,
  maximumValue,
  step = 0.01,
  value = maximumValue / 2,
}) => (
  <View>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={styles.sliderContainer}>
      {/* <Text>
        {width}
:
        {height}
      </Text> */}
      <Slider
        onValueChange={value => onSliderChange(value)}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        style={styles.slider}
      />
    </View>
  </View>
);
