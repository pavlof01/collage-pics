import { createStackNavigator, createAppContainer } from 'react-navigation';

import Main from './screens/Main';
import Collage from './screens/Collage';
import Layouts from './screens/Layouts';

const AppNavigator = createStackNavigator(
  {
    Main: {
      screen: Main,
    },
    Collage: {
      screen: Collage,
    },
    Layouts: {
      screen: Layouts,
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
