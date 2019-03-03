import React, { Component } from 'react';
import {
  Text, StyleSheet, View, CameraRoll, FlatList, Image, Dimensions, TouchableOpacity,
} from 'react-native';
import {
  Container, Tab, Tabs,
} from 'native-base';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  image: {
    height: 100,
    maxWidth: width / 3,
    flex: 1,
    borderWidth: 3,
    borderColor: '#fff',
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
    };
  }

  componentDidMount = () => {
    const albums = {};
    CameraRoll.getPhotos({ groupTypes: 'All', first: 20000 }).then((images) => {
      images.edges.forEach(({ node }) => {
        if (albums.hasOwnProperty(node.group_name)) {
          albums[node.group_name].push(node);
        } else {
          albums[node.group_name] = [];
          albums[node.group_name].push(node);
        }
      });
    }).then(() => this.setState({ albums }));
  }

  renderImageItem = ({ item }) => {
    console.warn(JSON.stringify(item, null, 2));
    return (
      <Image style={styles.image} source={{ uri: item.image.uri }} />
    );
  }


  render() {
    const { albums } = this.state;
    const nameAlbums = Object.keys(albums);
    // console.warn(JSON.stringify(albums, null, 2));
    return (
      <Container>
        {nameAlbums.length ? (
          <Tabs>
            {nameAlbums.map(name => (
              <Tab key={name} heading={name}>
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
      </Container>
    );
  }
}
