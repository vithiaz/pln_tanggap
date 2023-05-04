import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import AlarmAlert from './alarm_alert';
import AlarmActive from './alarm_active';
import AlarmEnded from './alarm_ended';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function Alarm({route}) {
  const checkinId = route.params.checkinId;
  const checkinKey = route.params.checkinKey;
  const myToken = route.params.deviceToken;

  return (
    <Stack.Navigator 
        screenOptions={{
        headerShown: false
        }}    
    >
        <Stack.Screen
            name="Alert"
            component={AlarmAlert}
            initialParams={{ myToken: myToken, checkinId: checkinId, checkinKey: checkinKey }}
            />
        <Stack.Screen
            name="Active"
            component={AlarmActive} />
        <Stack.Screen
            name="Ended"
            component={AlarmEnded} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})