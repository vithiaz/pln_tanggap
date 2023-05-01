import React, {Component, useState, useEffect, createContext} from 'react';
import { Alert, AppRegistry, Text, Touchable, TouchableOpacity, Linking } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { AuthUserProvider } from './src/provider/auth_user.js'

import Home from './src/pages/Home';
import Login from './src/pages/Login';
import CreateSimulation from './src/pages/CreateSimulation';
import Alarm from './src/pages/Alarm';

import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import PushNotification from "react-native-push-notification";
import { navigationRef } from './RootNavigation';
import messaging from '@react-native-firebase/messaging';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import { emergencyNotificationChannel } from './notificationManager.js';
import AlarmActive from './src/pages/Alarm/alarm_active.js';
import NotificationAlert from './src/pages/NotificationAlert/index.js';
// import Alarm from './src/pages/Alarm';


emergencyNotificationChannel();
messaging().requestPermission();

AppRegistry.registerComponent('notificationAlert', () => NotificationAlert);

// Notification handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    RNNotificationCall.displayNotification(
      '22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad',
      null,
      30000,
      {
        // channelId: 'com.abc.incomingcall',
        channelId: 'alert-channel',
        channelName: 'Alert Channel',
        notificationIcon: 'ic_launcher', //mipmap
        notificationTitle: 'KEADAAN DARURAT!!!',
        notificationBody: 'Lakukan protokol evakuasi',
        // answerText: 'Bu',
        // declineText: 'Decline',
        // notificationColor: 'colorAccent',
        notificationColor: 'red',
        notificationSound: null, //raw
        // mainComponent:'notificationAlert',//AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
        // payload:{name:'Test',Body:'test'}
      }
    );
    

    // const durationMs = 2 * 1000; // 120 seconds = 120,000 milliseconds
    // Vibration.vibrate(durationMs);

});

messaging().onNotificationOpenedApp((remoteMessage) => {
    // const durationMs = 2 * 1000; // 120 seconds = 120,000 milliseconds
    // Vibration.vibrate(durationMs);

    // Handle the notification as desired
    console.log('Notification opened in foreground:', remoteMessage.notification);
  });

RNNotificationCall.addEventListener('answer', (data) => {
  RNNotificationCall.backToApp();
  const { callUUID, payload } = data;
  console.log('press answer', callUUID);
  console.log('payload data', payload);
});
  


const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}    
      >
      <Stack.Screen
        name="Home"
        component={Home}
        />
      <Stack.Screen
        name="Login"
        component={Login}
        />
      <Stack.Screen
        name="CreateSimulation"
        component={CreateSimulation}
        />
      <Stack.Screen
        name="Alarm"
        component={Alarm}
        />
    </Stack.Navigator>
  );

}

const App = () => {

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();

      // The setTimeout is just for testing purpose
      setTimeout(() => {
        console.log('linking: ', initialUrl);
      }, 1000);
    };

    getUrlAsync();
  }, []);

  

  return (
    <AuthUserProvider>
      <NavigationContainer >
          <HomeStack />
      </NavigationContainer>
    </AuthUserProvider>
  );
};

export default App;
