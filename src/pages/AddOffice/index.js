import React, { useEffect, useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import AddOfficeForm from './addForm';
import AddOfficeConfirmation from './confirmation';

const Stack = createStackNavigator();

export default function AddOffice({ navigation }) {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="addForm"
                component={AddOfficeForm}
            />
            <Stack.Screen
                name="addConfirmation"
                component={AddOfficeConfirmation}
            />

        </Stack.Navigator>
    )
}