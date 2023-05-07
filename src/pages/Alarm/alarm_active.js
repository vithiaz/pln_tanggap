'use strict';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  LogBox
} from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import moment from 'moment';

import BackIcon from '../../assets/icon/back.png'
import SirenIcon from '../../assets/icon/siren.png'
import AlertIcon from '../../assets/icon/alert.png'
import bellRingingIcon from '../../assets/icon/bell_ringing.png';
import Sound from 'react-native-sound'
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { child, onValue, push, ref, set, update } from 'firebase/database'
import { db } from '../../config/firebase'
import { useFocus } from 'native-base/lib/typescript/components/primitives';

const alarmSound = require("../../assets/sound/alarm.wav")

LogBox.ignoreAllLogs();

export default function AlarmActive({ route, navigation }) {
  const infoMessage = 'Lakukan protokol evakuasi dan secepatnya ke titik kumpul evakuasi.';
  const [infoMessageHeader, setInfoMessageHeader] = useState('KEADAAN DARURAT!!!');
  const alarmId = route.params.alarmKey;
  const simulation = JSON.parse(route.params.simulation);
  const [alarmData, setAlarmData] = useState([]);
  const [myToken, setMyToken] = useState(null);
  const [canStopAlarm, setCanStopAlarm] = useState(false);
  const [hostIds, setHostIds] = useState([]);
  const scanner = useRef(null)
  const [scanned, setScanned] = useState(false);
  const [isCount, setIsCount] = useState(true);
  const [count, setCount] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const [timeCount, setTimeCount] = useState('00:00:00');


  function getCurrentTime() {
    const now = new Date();
    const options = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return now.toLocaleString('en-US', options);
  }

  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (isCount) {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1000);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isCount]);

  const formatTime = (time) => {
    const date = new Date(time);
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(date.getMilliseconds() / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }


  // const startCountdown = (startTime) => {
  //   const interval = setInterval(() => {
  //     const currentTime = new Date().getTime();
  //     const timeGap = currentTime + startTime;
  
  //     // Check if condition is met
  //     if (isCount == false) {
  //       clearInterval(interval);
  //       setIntervalId(null);
  //       return;
  //     }
  //     // console.log(convertTime(timeGap));
  //     setTimeCount(convertTime(timeGap));
  //   }, 750);

  //   setIntervalId(interval);
  // };

  const stopCountdown = () => {
    setIsCount(false);
    const storeCounter = formatTime(elapsedTime);
    AsyncStorage.setItem('@counterData', JSON.stringify(storeCounter));
  };

  // const convertDBTime = (timeStrData) => {
  //   console.log('timeStrData: ', timeStrData)
  //   const [dateStr, time] = timeStrData.split(', ');
  //   const [month, day, year] = dateStr.split('/');
  //   const [hours, minutes, seconds] = time.split(':');
  //   const timestamp = new Date('en-US', `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`).getTime();
  //   return timestamp;
  // };
  
  // const convertTime = (timeStr) => {
  //   const milliseconds = timeStr;
  //   const date = new Date(milliseconds);
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   const seconds = date.getSeconds().toString().padStart(2, '0');
  //   const millisecondsFormatted = date.getMilliseconds().toString().padStart(3, '0').substring(0, 2);
  //   return `${minutes}:${seconds}:${millisecondsFormatted}`;  
  // }

  // const datetimeToTimestamp = (datetimeStr) => {
  //   const date = new Date(datetimeStr.replace(',', ''));
  //   return date.getTime();
  // };


  // // Start Countdown
  // useEffect(() => {
  //   if (isCount) {
  //     if (alarmData.triggeredTime != null) {
  //       // const startTime = datetimeToTimestamp(alarmData.triggeredTime);        
  //       const newStr = alarmData.triggeredTime.replace(/[\/,]/g, (match) => {
  //         if (match === '/') return '-';
  //         if (match === ',') return '';
  //       });

  //       const date = moment(newStr, 'DD/MM/YYYY, HH:mm:ss').toDate();
  //       const timestamp = date.getTime();

        
  //       console.log('stTimeReplace ', date.toLocaleString(), Date.now().toLocaleString());
        
  //       // const startTime = convertDBTime(alarmData.triggeredTime);
  //       // startCountdown(startTime);      
  //     }
  //   } else {
  //     clearInterval(intervalId);
  //     setIntervalId(null);
  //   }
  // }, [isCount, alarmData]);  

  // Handle QR Scanning
  const handleScan = (e) => {
    console.log('Scanned data: ', e.data);
    if (simulation == true) {
      if (e.data == alarmData.safeKey) {
        stopCountdown();
        const simulationRef = ref(db, 'simulations/' + alarmId + '/members/' + myToken);
        try {
          set(simulationRef, {
            device_token: myToken,
            secure_state: true,
            secure_time: getCurrentTime()
          });
  
          AsyncStorage.removeItem('@activeAlarm');
          // navigation.navigate('Ended', {alarmTime: timeCount}, { replace: true });
          navigation.replace('Ended', { alarmTime: timeCount });

          navigation.reset({
            index: 0,
            routes: [{ name: 'Ended' }]
          });
        } catch (e) {
          console.log("Error while updating the simulations database: ", e);
        }
      } 
    } else {
      if (e.data == alarmData.safeKey) {
        stopCountdown();
        const alarmRef = ref(db, 'alarms/' + alarmId + '/members/' + myToken);
        try {
          set(alarmRef, {
            device_token: myToken,
            secure_state: true,
            secure_time: getCurrentTime()
          });

          AsyncStorage.removeItem('@activeAlarm');
          // navigation.navigate('Ended', {alarmTime: timeCount}, { replace: true });
          // navigation.navigate('Ended', { alarmTime: timeCount, replace: true });
          navigation.replace('Ended', { alarmTime: timeCount });

          navigation.reset({
            index: 0,
            routes: [{ name: 'Ended' }]
          });
        } catch (e) {
          console.log("Error while updating the alarms database: ", e);
        }
      }
    }
    setScanned(true);
  };

  const getDeviceToken = async() => {
    try {
      const value = await AsyncStorage.getItem('@device_token')
      setMyToken(JSON.parse(value))
    } catch(e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getDeviceToken();
  }, [])

  // Gather the host ids
  useEffect(() => {
    setHostIds([]);
    const saveHostIds = [];
    const getHostIds = () => onValue(ref(db, '/users'), (snap) => {
        snap.forEach((snapchild) => {
          if (snapchild.val().user_type == 'host') {
            saveHostIds.push(snapchild.val().device_token);
          }
        })
        setHostIds(saveHostIds);
      }, { onlyOnce: true })
    return getHostIds();
  }, [])
  
  // Listen to alarms table / simulations table
  useEffect(() => {
    console.log('Table ID : ', alarmId);
    console.log('Is simulation: : ', simulation);
    try {
      if (simulation == true) {
        onValue(ref(db, '/simulations/' + alarmId), (snap) => {
          setAlarmData([]);
          const data = snap.val();
          console.log('simulations data: ', data);
          if (data !== null) {
            setAlarmData(data);
            setInfoMessageHeader(data.name)
            if (data.status == 'ended') {
              // navigation.navigate('Ended', {alarmTime: timeCount}, { replace: true });
              // navigation.navigate('Ended', { alarmTime: timeCount, replace: true });
              navigation.replace('Ended', { alarmTime: timeCount });

              navigation.reset({
                index: 0,
                routes: [{ name: 'Ended' }]
              });
              AsyncStorage.removeItem('@activeAlarm');
            }
          } else {
            AsyncStorage.removeItem('@activeAlarm');
            navigation.pop();
          }
        });
      } else {
        onValue(ref(db, '/alarms/' + alarmId), (snap) => {
          setAlarmData([]);
          const data = snap.val();
          if (data !== null) {
            setAlarmData(data);
            setInfoMessageHeader(data.title)
            if (data.status == 'ended') {
              navigation.navigate('Ended', {alarmTime: timeCount}, { replace: true });
              // navigation.navigate('Ended', { alarmTime: timeCount, replace: true });
              // navigation.replace('Ended', { alarmTime: timeCount });
              navigation.reset({
                index: 0,
                routes: [{ name: 'Ended' }]
              });
              AsyncStorage.removeItem('@activeAlarm');
            }
          } else {
            AsyncStorage.removeItem('@activeAlarm');
            navigation.pop();
          }
        })
      }
    } catch (e) {
      console.log('Error : ', e);
    }
  }, [])
  
  // Handle who can end the alarm
  useEffect(() => {
    console.log('Alarm Data : ', alarmData);
    console.log('token : ', myToken);

    if (alarmData) {
      if (simulation != true) {
        if (alarmData.trigerred_token === myToken) {
          setCanStopAlarm(true);
        }
      }
      if (hostIds && hostIds.includes(myToken)) {
        setCanStopAlarm(true);
      }
    }
  }, [canStopAlarm, alarmData, hostIds])

  // Handle Turning off the Alarm
  const handleTurnOffAlarm = () => {
    stopCountdown();
    if (simulation) {
      const simulationRef = ref(db, 'simulations/' + alarmId);
      update(simulationRef, {
        status: 'ended',
      })
    } else {
      const alarmRef = ref(db, 'alarms/' + alarmId);
      update(alarmRef, {
        status: 'ended',
      })
    }
  }

  // Handle Sound
  const sound = new Sound(alarmSound, Sound.MAIN_BUNDLE, (err) => {
    if (err) {
      console.log(err)
      return;
    }
  })
  const releaseSound = () => {
    console.log('Sound Released');
    sound.release();
    stopCountdown();
  }
  useEffect(() => {
    // console.log("Sound Played!")
    // setTimeout(() => {
    //   sound.setNumberOfLoops(-1)
    //           .setVolume(1)
    //           // .setSystemVolume(1)
    //           .play(() => {
    //     // console.log('ended');
    //     // console.log('duration in seconds: ' + sound.getDuration());
    //   });
    // }, 100);
  }, [])
 
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: '#222F34', width: '100%', flexDirection: 'column' }}>
      <SafeAreaView style={{ height: '100%', }}>
        <View style={styles.pageContainer}>
          <View style={styles.topNavigationWrapper}>
            {/* <TouchableOpacity style={styles.button} onPress={() => {navigation.goBack()}}>
              <Image source={BackIcon} style={styles.buttonIcon} />
            </TouchableOpacity> */}
          </View>

          {(scanned == false) ? (
            <View style={styles.pageBodyWrapper}>
              <TouchableOpacity style={styles.alarmButton} onPress={releaseSound}>
                <Image source={SirenIcon} style={styles.alarmButtonIcon}/>
              </TouchableOpacity>
              
              {/* Time Wrapper */}
              <View style={styles.timerWrapper}>
                <Text style={styles.timerNumber}>{formatTime(elapsedTime)}</Text>
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
                  <Text style={styles.infoTextHeader}>{infoMessageHeader.toUpperCase()}</Text>
                  <Text style={styles.infoTextMessage}>{alarmData.body}</Text>
                  <Text style={styles.infoTextMessage}>{infoMessage}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.pageBodyWrapper}>
              <QRCodeScanner
                onRead={handleScan}
                ref={scanner}
                showMarker={true}
                reactivate={true}
                permissionDialogTitle={'Permission to use camera'}
                permissionDialogMessage={'We need your permission to use your camera phone'}
                markerStyle={styles.marker}
                cameraStyle={styles.camera}
                // flashMode={RNCamera.Constants.FlashMode.torch}
                // bottomContent={
                //   <TouchableOpacity style={styles.footerButton}>
                //     <Text style={styles.footerButtonText}>OK. Got it!</Text>
                //   </TouchableOpacity>
                // }
              />
            </View>
          )}
          

          {/* Page Footer */}
          <View style={styles.pageFooterWrapper}>
            {(canStopAlarm == true) ? (
              <TouchableOpacity style={styles.footerButton} onPress={handleTurnOffAlarm}>
                <Text style={styles.footerButtonText}>Matikan Alarm</Text>
              </TouchableOpacity>
            ) : (
              <>
              {(scanned == true) ? (
                  <TouchableOpacity style={styles.footerButton} onPress={() => setScanned(false)}>
                    <Text style={styles.footerButtonText}>Kembali</Text>
                  </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.footerButton} onPress={() => setScanned(true)}>
                  <Text style={styles.footerButtonText}>Saya sudah di titik evakuasi</Text>
                </TouchableOpacity>
              )}
              </>
            )

            }
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  marker: {
    borderColor: '#fff',
    borderRadius: 10,
  },
  camera: {
    height: '100%',
  },

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
    backgroundColor: '#FFF200',
    // backgroundColor: '#ED1C24',
    borderWidth: 2,
    borderColor: '#ED1C24',
    shadowColor: '#ED1C24',
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
    color: 'white',
    fontWeight: '700',
    letterSpacing: 5,
  },
  timerNumberSeparator: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: 5,
  },

  infoWrapper: {
    width: '100%',
    backgroundColor: '#ED1C24',
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