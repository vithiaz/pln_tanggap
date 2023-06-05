import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import AlarmAlert from './alarm_alert';
import AlarmActive from './alarm_active';
import AlarmEnded from './alarm_ended';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function Alarm({route}) {
  const checkinId = route.params.checkinId; // Checkin id,, in database checkin_data.id
  const checkinKey = route.params.checkinKey; // Checkin Location id, in database offices.id
  const myToken = route.params.deviceToken;
  const simulation = route.params.simulation;
  const pageState = route.params.alarmState; // pending, incoming
  const alarmKey = route.params.alarmKey; // AlarmId, in database alarams.id

  return (
    <Stack.Navigator 
        screenOptions={{
        headerShown: false
        }}
    >{(pageState == 'pending') && (
      <Stack.Screen
          name="Alert"
          component={AlarmAlert}
          initialParams={{ myToken: myToken, checkinId: checkinId, checkinKey: checkinKey }}
        />
    )}
      <Stack.Screen
          name="Active"
          component={AlarmActive}
          initialParams={{ myToken: myToken, alarmKey: alarmKey, simulation: simulation }}
          />
      <Stack.Screen
          name="Ended"
          component={AlarmEnded} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})