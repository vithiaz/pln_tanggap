import 'react-native-gesture-handler';

import PushNotification from 'react-native-push-notification';

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Home from './src/pages/Home';
import Route from './route.js';
import { Vibration } from 'react-native';

import { emergencyNotificationChannel } from './notificationManager.js';
import messaging from '@react-native-firebase/messaging';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import RNRestart from 'react-native-restart'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  RNRestart.restart();
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
        channelId: 'alarm_channel',
        // channelId: 'alert-channel',
        channelName: 'Alert Channel',
        notificationIcon: 'ic_launcher', //mipmap
        notificationTitle: remoteMessage.notification.title,
        notificationBody: remoteMessage.notification.body,
        answerText: 'Lihat',
        declineText: 'Abaikan',
        notificationColor: 'colorAccent',
        notificationSound: 'alarm.wav', //raw
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


AppRegistry.registerComponent(appName, () => Route);
AppRegistry.registerComponent('notificationAlert', () => NotificationAlert);
