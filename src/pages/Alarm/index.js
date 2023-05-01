import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import AlarmAlert from './alarm_alert';
import AlarmActive from './alarm_active';
import AlarmEnded from './alarm_ended';

const Stack = createStackNavigator();


export default function Alarm() {
  return (
    <Stack.Navigator 
        screenOptions={{
        headerShown: false
        }}    
    >
        <Stack.Screen
            name="Alert"
            component={AlarmAlert} />
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