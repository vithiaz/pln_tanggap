import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native'
import RNRestart from 'react-native-restart'; 

import React, { useEffect, useState } from 'react'
import BackIcon from '../../assets/icon/back.png'
import CheckIcon from '../../assets/icon/check.png'
import AlertIcon from '../../assets/icon/alert.png'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase';

export default function AlarmEnded({ navigation, route }) {
  const infoMessage = 'Tetap di lokasi evakuasi sampai keadaan darurat selesai';
  const infoMessageHeader = 'PERHATIAN ...';
  const [timeCount, setTimeCount] = useState('00:00')
  const [alarmMembers, setAlarmMembers] = useState([])

  const appendAlarmMember = (newData) => {
    setAlarmMembers((prevData) => [...prevData, newData]);
  }
  
  const alarmId = route.params.alarmId;
  const isSimulation = route.params.simulation;

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

  const handleResetApp = () => {
    RNRestart.restart()
  }

  // Listen to alarms table / simulations table
  useEffect(() => {
    console.log('Table ID : ', alarmId);
    console.log('Is simulation: : ', isSimulation);
    try {
      // Handle if simulations
      if (isSimulation == true) {
        onValue(ref(db, '/simulations/' + alarmId + '/members/'), (snap) => {
          setAlarmMembers([]);
          snap.forEach((memberId) => {
            if (memberId.val().secure_state) {
              appendAlarmMember(memberId);
            }
          })
        }, { onlyOnce: true })
      } else {    // Handle if real emergency
        onValue(ref(db, '/alarms/' + alarmId + '/members/'), (snap) => {
          setAlarmMembers([]);
          snap.forEach((memberId) => {
            appendAlarmMember(memberId);
          })
        }, { onlyOnce: true })
      }
    } catch (e) {
      console.log('Error : ', e);
    }
  }, [])

  const getTimeFromString = (dateTimeString) => {
    const [date, time] = dateTimeString.split(', ');

    const [month, day, year] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    const timeString = formattedDate + ' ' + time;
    const dateObj = new Date(timeString);
    const formattedTime = dateObj.toLocaleTimeString();

    return formattedTime;
  };
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: 'white', width: '100%', flexDirection: 'column' }}>
      <SafeAreaView style={{ height: '100%', }}>
        <View style={styles.pageContainer}>
          <View style={styles.topNavigationWrapper}>
            {/* <TouchableOpacity style={styles.button} onPress={() => {navigation.pop()}}>
              <Image source={BackIcon} style={styles.buttonIcon} />
            </TouchableOpacity> */}
          </View>

          {/* Alarm Button */}
          <View style={styles.pageBodyWrapper}>
            <TouchableOpacity style={styles.alarmButton} onPress={ () => handleResetApp() }>
              <Image source={CheckIcon} style={styles.alarmButtonIcon}/>
              <Text style={styles.alarmButtonText}>Kembali ke Beranda</Text>
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

            <View style={styles.reportWrapper}>
              <Text style={{ fontWeight: '600', marginBottom: 5 }}>Laporan Waktu tiba di Area Evakuasi</Text>
              <View style={styles.reportWrapperItem}>
                  <Text style={{ fontWeight: '600' }}>Nama</Text>
                  <Text style={{ fontWeight: '600' }}>Waktu</Text>
                </View>
              
              {Object.entries(alarmMembers).map(([key, values]) => (
                <View key={key} style={styles.reportWrapperItem}>
                  <Text>{values.val().checkin_name ? values.val().checkin_name : 'Anonim'}</Text>
                  <Text>{values.val().secure_time ? getTimeFromString(values.val().secure_time) : ''}</Text>
                </View>
              ))}
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
    // color: '',
    textAlign: 'center',
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

  reportWrapper: {
    width: '100%',
    backgroundColor: '#F4F7FF',
    borderRadius: 12,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  reportWrapperItem: {
    width: '100%',
    paddingVertical: 5,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
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