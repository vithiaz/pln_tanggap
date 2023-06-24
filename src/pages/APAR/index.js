import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AparList from './apar_list';
import RegisterApar from './register_apar';
import ScanApar from './scan_apar';
import AparDetails from './apar_details';

const Stack = createStackNavigator();

export default function AparPage({ route, navigation }) {
    const officeUID = route.params.userInfo.office_UID

  
    return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
            }}
    >
        <Stack.Screen
          name="AparList"
          component={AparList}
          initialParams={{ officeUID: officeUID }}
          />
        <Stack.Screen
          name="RegisterApar"
          component={RegisterApar}
          initialParams={{ officeUID: officeUID }}
          />
        <Stack.Screen
          name="AparDetails"
          component={AparDetails}
          initialParams={{ officeUID: officeUID }}
          />
        <Stack.Screen
          name="ScanApar"
          component={ScanApar}
          initialParams={{ officeUID: officeUID }}
          />
    </Stack.Navigator>
  )
}