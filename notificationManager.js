import PushNotification from 'react-native-push-notification';
import { PendingIntent, NotificationManager } from 'react-native';


export const emergencyNotificationChannel = () => {
  PushNotification.createChannel(
    {
        channelId: 'alert-channel',
        channelName: 'Alert Channel',
        channelDescription: 'Channel for handle emergency notification',
        playSound: true,
        soundName: 'alarm.wav',
        importance: 4,
        notificationTimeout: 120,
        vibration: true,
        vibrationPattern: [1000, 500, 1000, 500, 1000] 
    },
    () => {},
  );
  console.log('Channel created!');
};

// export const showCustomNotification = () => {
//     // create a PendingIntent that launches an activity
//     const intent = new PendingIntent(
//       {
//         intentType: 'ACTIVITY',
//         packageName: NotificationManager.getAppName(),
//         className: 'MainActivity'
//       }
//     );
  
//     // send a notification with fullScreenIntent
//     PushNotification.localNotification({
//       /* Android Only Properties */
//       channelId: 'my-channel-id',
//       title: 'My Notification',
//       message: 'This is my notification message!',
//       playSound: true,
//       soundName: 'alarm.wav',
//       fullScreenIntent: true,
//       pendingIntent: intent
//     });
//   };
  
