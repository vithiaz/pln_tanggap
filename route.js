import React, {Component, useState, useEffect, createContext} from 'react';
import { AppState, Alert, AppRegistry, Text, Touchable, TouchableOpacity, Linking } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import RNRestart from 'react-native-restart'; 

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
import AddUser from './src/pages/AddUser/index.js';

import BackgroundTimer from 'react-native-background-timer';
import BackgroundFetch from 'react-native-background-fetch';
import AddOffice from './src/pages/AddOffice/index.js';

messaging().requestPermission();

const Stack = createStackNavigator();

const HomeStack = (props) => {
    const navigation = useNavigation();
    const [activeAlarm, setActiveAlarm] = useState(false);
    // const [isSimulation, setIsSimulation] = useState(false);
    const [simulationStat, setSimulationStat] = useState(false);
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
          setSimulationStat(isSimulation)
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
      getDeviceToken();
      handleActiveAlarm();
    }, [])

    // Handle notification when app is running foreground
    useEffect(() => {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        // console.log('FCM Arrived!!!!');
        if (remoteMessage.data.notificationType == 'emergency') {
          RNRestart.restart();
          
          const alarmKey = remoteMessage.data.alarmKey;
          const simulation = remoteMessage.data.simulation;

          setActiveAlarm(alarmKey);
          setSimulationStat(simulation);

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


          // navigation.navigate('SafetyInduction');

        }
        
        });
      return unsubscribe;
    }, []);

    useEffect(() => {
      const unsubs = messaging().onNotificationOpenedApp((remoteMessage) => {
        if (remoteMessage.data.notificationType == 'emergency') {
          const alarmKey = remoteMessage.data.alarmKey;
          setActiveAlarm(alarmKey);
          setSimulationStat(remoteMessage.data.simulation)

          navigation.navigate('Alarm', {
            alarmKey: alarmKey,
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
            name="AddUser"
            component={AddUser}
            />
          <Stack.Screen
            name="AddOffice"
            component={AddOffice}
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
  )
}

export const TokenContext = createContext();


const App = () => {

  useEffect(() => {
    // Handle app state changes
    AppState.addEventListener('change', handleAppStateChange);

    // Start background tasks
    startBackgroundTasks();

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (newState) => {
    if (newState === 'active') {
      // App is back to foreground, restart background tasks
      startBackgroundTasks();
    }
  };

  const startBackgroundTasks = () => {
    BackgroundTimer.start();
    BackgroundFetch.configure({}, () => {
      // Perform background task here
      // For example, make API calls or update data

      // Once the background task is finished, you can call the following
      BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
    }, (error) => {
      console.log('[BackgroundFetch] Error: ', error);
    });
    BackgroundFetch.scheduleTask({
      forceAlarmManager: true,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      delay: 0,
      periodic: true,
      enableRemoteNotification: false,
    });
  };



  // const [deviceToken, setDeviceToken] = useState('');
  
  // const [devToken, setDevtoken] = useState('');

  // const getDevToken = async() => {
  //   try {
  //     const value = await AsyncStorage.getItem('@device_token')
  //     setDeviceToken(JSON.parse(value))
  //   } catch(e) {
  //     console.log(e);
  //   }
  // }

  // useEffect(() => {
  //   getDevToken();
  //   console.log('dev token: ', deviceToken)
  // }, [deviceToken])

  // useEffect(() => {
  //    // const durationMs = 2 * 1000; // 120 seconds = 120,000 milliseconds
  //     // Vibration.vibrate(durationMs);
  //   });

  //   return unsubscribe;
  // }, []);

  // Use this for update the device token value in token context provider
  // const [deviceToken, setDeviceToken] = useState('');
  // const handleUpdateDeviceToken = (token) => {
  //   setDeviceToken(token);
  // };
 

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
