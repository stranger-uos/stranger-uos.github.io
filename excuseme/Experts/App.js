import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './screens/Home';
import OpenChannel from './screens/OpenChannel';

const MainNavigator = createStackNavigator({
  Home: {screen: Home},
  OpenChannel: { screen: OpenChannel }
});

const App = createAppContainer(MainNavigator);
export default App;
