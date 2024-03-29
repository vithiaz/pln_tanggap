import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'

import SafetyInductionOne from './pageOne.js';
import SafetyInductionTwo from './pageTwo.js';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default SafetyInduction = ({ navigation }) => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name="PageOne"
          component={SafetyInductionOne}
        />
        <Stack.Screen
          name="PageTwo"
          component={SafetyInductionTwo}
        />
    </Stack.Navigator>
  )
}

// Styles
const styles = StyleSheet.create({
  topNavigationWrapper: {
    flexDirection: 'column',
    gap: 20,
  },

  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'column',
    gap: 10,
  },
  
  containerFillHeight: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'column',
    gap: 10,
    flexGrow: 1,
  },
  
  pageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'column',
    gap: 10,
    flexGrow: 1,
    backgroundColor: 'red',
  },


  button: {
    height: 38,
    width: 38,
    borderRadius: 19,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: '90%',
    height: '90%',
  },

  appLogoText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 4,
    color: 'white',
  },

  logoWrapper: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
    paddingVertical: 60,
  },

  pageTitleWrapper: {
    padding: 20,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitleText: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 22,
    fontWeight: 700,
    color: 'black',
    letterSpacing: 2,
  },

  pageIconContainer: {
    backgroundColor: '#fff200',
    borderRadius: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  pageIcon: {
    width: '80%',
    height: '80%',
  }
})

const contentCardStyles = StyleSheet.create({
  contentCard: {
    width: '100%',
    minHeight: 420,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#F4F7FF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardBody: {
    flexDirection: 'column',
    gap: 10,
    flexGrow: 1,
  },
  formInput: {
    width: '100%',
    flexDirection: 'column',
    gap: 8,
    paddingVertical: 8,
  },
  formInputLabel: {
    color: 'black',
    fontWeight: 600,
  },
  formInputText: {
    color: 'black',
    fontSize: 16,
  },
  datetimeForm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 20,
  },

  buttonWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingVertical: 20,
  },
  SubmitButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#FFF200',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  SubmitButtonText: {
    color: 'black',
    fontWeight: 700,
  },
  DangerButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#ed1c24',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  DangerButtonText: {
    color: 'white',
    fontWeight: 700,
  },
  AbortButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#222F34',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  AbortButtonText: {
    color: 'white',
    fontWeight: 700,
  },

  // Card Footer
  cardFooter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  footerLogoContainer: {
    width: 40,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  footerLogo: {
    width: '100%',
    height: '100%',
  },
  footerLogoText: {
    fontWeight: '600',
    letterSpacing: 4,
  }
})