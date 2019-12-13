import React from 'react';
import { createStackNavigator, createButtomTopNavigator, createAppContainer } from 'react-navigation';
import {Text, View} from 'react-native';

import MainScreen from './MainScreen';
import ChatRoomScreen from './ChatRoomScreen';
import ChatStartScreen from './ChatStartScreen';
import ChatScreen from './ChatScreen';
import HistoryListScreen from './HistoryListScreen';
import HistoryScreen from './HistoryScreen';

const AppStackNavigator = createStackNavigator({
    Main: {
        screen: MainScreen
    }
});

export default createAppContainer(AppStackNavigator);