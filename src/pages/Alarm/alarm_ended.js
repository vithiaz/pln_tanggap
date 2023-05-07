import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native'

import React, { useEffect, useState } from 'react'
import BackIcon from '../../assets/icon/back.png'
import CheckIcon from '../../assets/icon/check.png'
import AlertIcon from '../../assets/icon/alert.png'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function AlarmEnded({ navigation, route }) {
  const infoMessage = 'Tetap di lokasi evakuasi sampai keadaan darurat selesai';
  const infoMessageHeader = 'PERHATIAN ...';
  const [timeCount, setTimeCount] = useState('00:00')

  const getCounter = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('@counterData'))
      console.log('counter Data', value)
      setTimeCount(value);
    } catch(e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getCounter();
    AsyncStorage.removeItem('@counterData');
  }, [])


  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: '#FFF200', width: '100%', flexDirection: 'column' }}>
      <SafeAreaView style={{ height: '100%', }}>
        <View style={styles.pageContainer}>
          <View style={styles.topNavigationWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {navigation.pop()}}>
              <Image source={BackIcon} style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>

          {/* Alarm Button */}
          <View style={styles.pageBodyWrapper}>
            <TouchableOpacity style={styles.alarmButton}>
              <Image source={CheckIcon} style={styles.alarmButtonIcon}/>
            </TouchableOpacity>
            
            {/* Time Wrapper */}
            <View style={styles.timerWrapper}>
              <Text style={styles.timerNumber}>{timeCount}</Text>
              {/* <Text style={styles.timerNumber}>00</Text>
              <Text style={styles.timerNumberSeparator}>:</Text>
              <Text style={styles.timerNumber}>00</Text>
              <Text style={styles.timerNumberSeparator}>:</Text>
              <Text style={styles.timerNumber}>00</Text> */}
            </View>
            
            {/* Info Wrapper */}
            <View style={styles.infoWrapper}>
              <Image source={AlertIcon} style={styles.infoCardIcon} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoTextHeader}>{infoMessageHeader}</Text>
                <Text style={styles.infoTextMessage}>{infoMessage}</Text>
              </View>
            </View>
          </View>

          {/* Page Footer */}
          {/* <View style={styles.pageFooterWrapper}>
            <TouchableOpacity style={styles.footerButton}>
              <Text style={styles.footerButtonText}>Saya sudah di titik evakuasi</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

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

  pageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'column',
    gap: 10,
    flexGrow: 1,
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

  pageBodyWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexGrow: 1,
  },

  alarmButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
    // backgroundColor: '#FFF200',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#00AEEF',
    shadowColor: '#00AEEF',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 18,

  },
  alarmButtonIcon: {
    width: '50%',
    height: '50%',
  },
  alarmButtonText: {
    color: '#ED1C24',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },

  timerWrapper: {
    width: '100%',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  timerNumber: {
    fontSize: 18,
    color: 'black',
    fontWeight: '700',
    letterSpacing: 5,
  },
  timerNumberSeparator: {
    fontSize: 18,
    color: 'black',
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: 5,
  },

  infoWrapper: {
    width: '100%',
    backgroundColor: '#00AEEF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  infoCardIcon: {
    width: 40,
    height: 40,
  },
  infoTextWrapper: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextHeader: {
    color: 'white',
    fontWeight: '600',
  },
  infoTextMessage: {
    color: 'black',
    textAlign: 'center',
    fontWeight: '600',
  },

  pageFooterWrapper: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButton: {
    backgroundColor: '#FFF200',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
})