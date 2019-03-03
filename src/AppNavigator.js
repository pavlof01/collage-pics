import { createStackNavigator, createAppContainer } from 'react-navigation';

import Main from './screens/Main';

const AppNavigator = createStackNavigator(
  {
    Main: {
      screen: Main,
    },
  },
  {
    headerMode: 'float',
    initialRouteName: 'Main',
    // defaultNavigationOptions: {
    //   headerTransparent: true,
    //   headerTintColor: "#ff7e42",
    //   headerBackTitleStyle: {
    //     color: "#ff7e42",
    //     fontFamily: "Montserrat-Medium",
    //     fontSize: fontSize(2)
    //   }
    // }
  },
);

export default createAppContainer(AppNavigator);
