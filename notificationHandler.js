import { Linking } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { useNavigation } from '@react-navigation/native';
import Alarm from './src/pages/Alarm';
import AsyncStorage from "@react-native-async-storage/async-storage"


class NotificationHandler {
  onNotification(notification) {
    // console.log('NotificationHandler:', notification);
    // console.log('Messaage:', notification['data']);
    notification.userInteraction = true;

    if (typeof this._onNotification === 'function') {
      this._onNotification(notification);
    }
  }

  onRegister(token) {
    console.log(token);
    const storeData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        AsyncStorage.setItem('@device_token', jsonValue)
        console.log('stored token: ', value);
      } catch (e) {
        console.log('storing data error: ', e);
      }
    }
    storeData(token.token);

    if (typeof this._onRegister === 'function') {
      this._onRegister(token);
    }
  }

  onAction(notification) {
    console.log ('Notification action received:');
    console.log(notification.action);
    console.log(notification);

    if(notification.action === 'Yes') {
      PushNotification.invokeApp(notification);
    }
  }

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError(err) {
    console.log(err);
  }
  
  attachRegister(handler) {
    this._onRegister = handler;
  }

  attachNotification(handler) {
    this._onNotification = handler;
  }
}

const handler = new NotificationHandler();

PushNotification.configure({

  // (optional) Called when Token is generated (iOS and Android)
  onRegister: handler.onRegister.bind(handler),

  // (required) Called when a remote or local notification is opened or received
  onNotification: handler.onNotification.bind(handler),
  // onNotification: (notification) => {
  //   PushNotification.localNotification({
  //     title: 'My Notification Title',
  //     message: 'My Notification Message',
  //     channelId: "alarm_channel",
  //     sound: "alarm",
  //     userInteraction: true,
  //     // vibration: true,
  //     // vibrationPattern: [1000, 500, 1000, 500, 1000, 500, 1000, 500],
  //     // Set the 'ongoing' property to true to make the notification persistent until the user clicks on it
  //     // actions: ['Terima'],
  //     ongoing: true,
  //     autoCancel: false,
  //     // playSound: true,
  //     vibrate: true,
  //     vibration: 1000,
  //     timeoutAfter: 10000,
  //   });
  // },

  // (optional) Called when Action is pressed (Android)
  onAction: handler.onAction.bind(handler),

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: handler.onRegistrationError.bind(handler),

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true,
});


export default handler;