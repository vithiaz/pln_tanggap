import 'react-native-gesture-handler';

import PushNotification from 'react-native-push-notification';

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Home from './src/pages/Home';
import Route from './route.js';

import { Linking } from 'react-native';
import NotifService from './notifService';
import { useState } from 'react';

import { Vibration } from 'react-native';

AppRegistry.registerComponent(appName, () => Route);
AppRegistry.registerComponent('notificationAlert', () => NotificationAlert);
