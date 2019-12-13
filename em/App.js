import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'

import MainScreen from './src/screen/MainScreen';
import ChatRoomScreen from './src/screen/ChatRoomScreen';
import ChatScreen from './src/screen/ChatScreen';
import HistoryScreen from './src/screen/HistoryScreen';

const AppStackNavigator = createStackNavigator(
    {
        Main: { screen: MainScreen },
        ChatRoom: { screen: ChatRoomScreen },
        Chat: { screen: ChatScreen },
        History: { screen: HistoryScreen },
    },
    { initialRoutName: 'Main'}
);

export default createAppContainer(AppStackNavigator);