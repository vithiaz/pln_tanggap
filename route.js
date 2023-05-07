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

// import { TokenContext } from './appContext.js';
import AsyncStorage from "@react-native-async-storage/async-storage"
import SimulationInfo from './src/pages/SimulationInfo/index.js';
import SafetyInduction from './src/pages/SafetyInduction/index.js';


emergencyNotificationChannel();
messaging().requestPermission();

RNNotificationCall.addEventListener('answer', (data) => {
  const { callUUID, payloadJSON } = data;
  const payload = JSON.parse(data.payload);

  console.log('payload data', payload);
  console.log('Listen payload', payload.alarmKey);
  console.log('simulation payload', payload.simulation);
  const activeAlarmData = {
      alarmKey: payload.alarmKey,
      simulation: payload.simulation
    }
  AsyncStorage.setItem('@activeAlarm', JSON.stringify(activeAlarmData));
  RNNotificationCall.backToApp();
  // console.log('press answer', callUUID);
  // props.setActiveAlarm(payload.alarmKey);
  // navigation.navigate('Alarm', {alarmState: 'incoming', alarmKey: payload.alarmKey});
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (remoteMessage.data.notificationType == 'emergency') {
    RNNotificationCall.displayNotification(
      remoteMessage.messageId,
      null,
      180000,
      {
        channelId: 'alert-channel',
        channelName: 'Alert Channel',
        notificationIcon: 'ic_launcher', //mipmap
        notificationTitle: remoteMessage.notification.title,
        notificationBody: remoteMessage.notification.body,
        answerText: 'Lihat',
        declineText: 'Abaikan',
        notificationColor: 'colorAccent',
        notificationSound: null, //raw
        payload: remoteMessage.data
        // notificationColor: 'red',
        // mainComponent:'PlnTanggap',//AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
      }
    );
    const activeAlarmData = {
      alarmKey: remoteMessage.data.alarmKey,
      simulation: remoteMessage.data.simulation
    }
    AsyncStorage.setItem('@activeAlarm', JSON.stringify(activeAlarmData));
  }

})

// Notification handler 


const Stack = createStackNavigator();

const HomeStack = (props) => {
    const navigation = useNavigation();
    const [activeAlarm, setActiveAlarm] = useState(false);
    // const [isSimulation, setIsSimulation] = useState(false);
    const [deviceToken, setDeviceToken] = useState('');
    const getDeviceToken = async() => {
      try {
        const value = await AsyncStorage.getItem('@device_token')
        setDeviceToken(JSON.parse(value))
      } catch(e) {
        console.log(e);
      }
    }

    const handleActiveAlarm = async () => {
      try {
        const saveAlarmData = await AsyncStorage.getItem('@activeAlarm');
        if (saveAlarmData) {
          const alarmKey = JSON.parse(saveAlarmData).alarmKey;
          const isSimulation = JSON.parse(saveAlarmData).simulation
          setActiveAlarm(alarmKey)
          navigation.navigate('Alarm', {
            alarmState: 'incoming',
            alarmKey: alarmKey,
            deviceToken: deviceToken,
            simulation: isSimulation
          });
        }
      } catch(e) {
        console.log(e);
      }
    }
    useEffect(() => {
      handleActiveAlarm();
    }, [])

    // Handle notification when app is running foreground
    useEffect(() => {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('FCM Arrived!');
        if (remoteMessage.data.notificationType == 'emergency') {
          const alarmKey = remoteMessage.data.alarmKey;
          const simulation = remoteMessage.data.simulation;
          const activeAlarmData = {
            alarmKey: alarmKey,
            simulation: simulation
          }
          AsyncStorage.setItem('@activeAlarm', JSON.stringify(activeAlarmData));
          navigation.navigate('Alarm', {
            alarmState: 'incoming',
            alarmKey: alarmKey,
            deviceToken: deviceToken,
            simulation: simulation
          });
        }
        
        });
      return unsubscribe;
    }, []);

    useEffect(() => {
      const unsubs = messaging().onNotificationOpenedApp((remoteMessage) => {
        if (remoteMessage.data.notificationType == 'emergency') {
          const alarmKey = remoteMessage.data.alarmKey;
          props.setActiveAlarm(alarmKey);
          navigation.navigate('Alarm', {
            alarmState: 'incoming',
            alarmKey: value,
            alarmState: 'incoming',
            deviceToken: deviceToken,
            simulation: remoteMessage.data.simulation
          });
        }
      });
      return unsubs;
    }, [])



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
        name="SimulationInfo"
        component={SimulationInfo}
        />
      <Stack.Screen
        name="Alarm"
        component={Alarm}
        />
      <Stack.Screen
        name="SafetyInduction"
        component={SafetyInduction}
        />
    </Stack.Navigator>
  );

}

export const TokenContext = createContext();


const App = () => {
  // useEffect(() => {
  //    // const durationMs = 2 * 1000; // 120 seconds = 120,000 milliseconds
  //     // Vibration.vibrate(durationMs);
  //   });

  //   return unsubscribe;
  // }, []);

  // Use this for update the device token value in token context provider
  const [deviceToken, setDeviceToken] = useState('');
  const handleUpdateDeviceToken = (token) => {
    setDeviceToken(token);
  };
  
  // useEffect(() => {
  //   const getUrlAsync = async () => {
  //     // Get the deep link used to open the app
  //     const initialUrl = await Linking.getInitialURL();

  //     // The setTimeout is just for testing purpose
  //     setTimeout(() => {
  //       console.log('linking: ', initialUrl);
  //     }, 1000);
  //   };

  //   getUrlAsync();
  // }, []);

  

  return (
    // <TokenContext.Provider value={{ deviceToken, setDeviceToken }}>
      <AuthUserProvider>
        <NavigationContainer >
        {/* <Text>{activeAlarm}</Text> */}
            <HomeStack />
        </NavigationContainer>
      </AuthUserProvider>
    // </TokenContext.Provider>
  );
};

export default App;
