'use strict';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  LogBox,
  Vibration
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
import { useSafeArea } from 'native-base';

const alarmSound = require("../../assets/sound/alarm.wav")

LogBox.ignoreAllLogs();

export default function AlarmActive({ route, navigation }) {
  const [infoMessage, setInfoMessage] = useState('');
  // const [infoMessage, setInfoMessage] = useState('Lakukan protokol evakuasi dan secepatnya ke titik kumpul evakuasi.');
  const [infoMessageHeader, setInfoMessageHeader] = useState('KEADAAN DARURAT!!!');
  
  const [dataMembers, setDataMembers] = useState([]);
  const [membersGroup, setMembersGroup] = useState('');
  
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
  const [checkinName, setCheckinName] = useState('');
  const [alarmMembers, setAlarmMembers] = useState([]);
  const [stopVibration, setStopVibration] = useState(false);
  const pattern = [100, 2000];

  const [memberGroup, setMemberGroup] = useState('');

  const appendAlarmMember = (newData) => {
    setAlarmMembers((prevData) => [...prevData, newData]);
  }

  const getIsCheckin = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('@isCheckin'))
      if (value) {
        setCheckinName(value.checkinName);
      }
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getIsCheckin();
  }, []);



  // Handle Vibration
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Check the condition to stop the vibration
      if (stopVibration) {
        // Stop the vibration loop
        clearInterval(intervalId);
      } else {
        // Vibrate with the specified pattern
        Vibration.vibrate(pattern);
      }
    }, pattern.reduce((a, b) => a + b)); // Calculate the total duration of the pattern

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [stopVibration]);

  // Function to stop the vibration loop
  const stopVibrationLoop = () => {
    setStopVibration(true);
  };


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
  const handleOpenScan = () => {
    setScanned(true);
    stopVibrationLoop();
  }

  const handleScan = (e) => {
    console.log('Scanned data: ', e.data);
    
    // Handle if Simulation
    if (simulation == true) {
      if (e.data == alarmData.safeKey) {
        stopCountdown();
        const simulationRef = ref(db, 'simulations/' + alarmId + '/members/' + myToken);
        try {
          update(simulationRef, {
            device_token: myToken,
            secure_state: true,
            secure_time: getCurrentTime()
          });
  
          AsyncStorage.removeItem('@activeAlarm');
          navigation.replace('Ended', { alarmTime: timeCount });
          navigation.reset({
            index: 0,
            routes: [{
              name: 'Ended',
              params: {
                alarmId : alarmId,
                simulation: simulation,
              }
            }]
          });
        } catch (e) {
          console.log("Error while updating the simulations database: ", e);
        }
      } 
    }
    else {  // Handle if real emergency
      if (e.data == alarmData.safeKey) {
        stopCountdown();
        const alarmRef = ref(db, 'alarms/' + alarmId + '/members/' + myToken);
        try {
          set(alarmRef, {
            device_token: myToken,
            secure_state: true,
            secure_time: getCurrentTime(),
            checkin_name: checkinName
          });

          AsyncStorage.removeItem('@activeAlarm');
          navigation.replace('Ended', { alarmTime: timeCount });
          navigation.reset({
            index: 0,
            routes: [{
              name: 'Ended',
              params: {
                alarmId : alarmId,
                simulation: simulation,
              }
            }]
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
              navigation.replace('Ended', { alarmTime: timeCount });
              navigation.reset({
                index: 0,
                routes: [{
                  name: 'Ended',
                  params: {
                    alarmId : alarmId,
                    simulation: simulation,
                  }
                }]
              });
              AsyncStorage.removeItem('@activeAlarm');
            }

            if (data.members) {
              setDataMembers(data.members);
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
              navigation.reset({
                index: 0,
                routes: [{
                  name: 'Ended',
                  params: {
                    alarmId : alarmId,
                    simulation: simulation,
                  }
                }]
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

  useEffect(() => {
    if (dataMembers) {
      if (dataMembers[myToken])
        if (dataMembers[myToken]['group']) {
          setMembersGroup(dataMembers[myToken]['group']);
        }
    } 
  }, [dataMembers])

  // Handle Members Group
  useEffect(() => {
    console.log('membersGroup: ', membersGroup);
        if (membersGroup === 'security') {
          setInfoMessage('Lakukan pengamanan area, arahkan seluruh pegawai untuk mengevakuasi diri melewati jalur evakuasi yang sudah disediakan. Pastikan seluruh penghuni ruangan gedung dalam keadaan aman')
        } else if (membersGroup === 'pemadam') {
          setInfoMessage('Cari titik api kemudian lakukan pemadaman jika api masih mungkin untuk dipadamkan menggunakan APAR. Jika api sudah terlalu besar maka hubungi pemadam kebakaran')
        } else if (membersGroup === 'evakuasi') {
          setInfoMessage('Carilah korban cidera atau tertinggal dan lakukan evakuasi korban cidera atau tertinggal')
        } else if (membersGroup === 'dokumen') {
          setInfoMessage('Selamatkan dokumen penting dan aset - aset perusahaan yang penting')
        } else if (membersGroup === 'p3k') {
          setInfoMessage('Ambil P3K kemudian lakukan pertolongan pertama pada korban kecelakaan yang sudah dievakuasi oleh tim evakuasi')
        } else {
          setInfoMessage('Lakukan protokol evakuasi dan secepatnya ke titik kumpul evakuasi.')
        }
  }, [membersGroup])

  // const getMemberGroup = async() => {
  //   await onValue(ref(db, '/simulations/' + alarmId + '/members/' + myToken + '/'), (snap) => {
  //     if (snap.val()) 
  //     {
  //       // const group = snap.val().group;
  //       if (snap.val().group == 'security') {
  //         console.log('ITS TRUEEE');
  //         const msgTxt = 'Lakukan pengamanan area, arahkan seluruh pegawai untuk mengevakuasi diri melewati jalur evakuasi yang sudah disediakan. Pastikan seluruh penghuni ruangan gedung dalam keadaan aman';
  //       }
  //       else if (snap.val().group == 'pemadam') {
  //         const msgTxt = 'Cari titik api kemudian lakukan pemadaman jika api masih mungkin untuk di padamkan menggunakan APAR. Jika api sudah terlalu besar maka hubungi pemadam kebakaran';
  //       }
  //       else if (snap.val().group == 'evakuasi') {
  //         const msgTxt = 'Carilah korban cidera atau tertinggal dan lakukan evakuasi korban cidera atau tertinggal';
  //       }
  //       else if (snap.val().group == 'dokumen') {
  //         const msgTxt = 'Selamatkan dokumen penting dan aset - aset perusahaan yang penting';
  //       }
  //       else if (snap.val().group == 'p3k') {
  //         const msgTxt = 'Ambil P3K kemudian lakukan pertolongan pertama pada korban kecelakaan yang sudah di evakuasi oleh tim evakuasi';
  //       }
  //       else {
  //         const msgTxt = 'Lakukan protokol evakuasi dan secepatnya ke titik kumpul evakuasi.';
  //       }
  //     }
  //   }, { onlyOnce: true })
  //   return msgTxt;
  // }

  // const getMemberGroup = async () => {
  //   let msgTxt = '';
  
  //   await onValue(ref(db, '/simulations/' + alarmId + '/members/' + myToken + '/'), (snap) => {
  //     if (snap.val()) {
  //       if (snap.val().group === 'security') {
  //         console.log('ITS TRUEEE');
  //         msgTxt = 'Lakukan pengamanan area, arahkan seluruh pegawai untuk mengevakuasi diri melewati jalur evakuasi yang sudah disediakan. Pastikan seluruh penghuni ruangan gedung dalam keadaan aman';
  //       } else if (snap.val().group === 'pemadam') {
  //         msgTxt = 'Cari titik api kemudian lakukan pemadaman jika api masih mungkin untuk dipadamkan menggunakan APAR. Jika api sudah terlalu besar maka hubungi pemadam kebakaran';
  //       } else if (snap.val().group === 'evakuasi') {
  //         msgTxt = 'Carilah korban cidera atau tertinggal dan lakukan evakuasi korban cidera atau tertinggal';
  //       } else if (snap.val().group === 'dokumen') {
  //         msgTxt = 'Selamatkan dokumen penting dan aset - aset perusahaan yang penting';
  //       } else if (snap.val().group === 'p3k') {
  //         msgTxt = 'Ambil P3K kemudian lakukan pertolongan pertama pada korban kecelakaan yang sudah dievakuasi oleh tim evakuasi';
  //       } else {
  //         msgTxt = 'Lakukan protokol evakuasi dan secepatnya ke titik kumpul evakuasi.';
  //       }
  //     }
  //   }, { onlyOnce: true });
  
  //   return msgTxt;
  // };

  // const getMemberGroup = async () => {
  //   let msgTxt = '';
  //   const snap = await get(ref(db, '/simulations/' + alarmId + '/members/' + myToken + '/'));
  //   if (snap.val()) {
  //     if (snap.val().group === 'security') {
  //       msgTxt = 'Lakukan pengamanan area, arahkan seluruh pegawai untuk mengevakuasi diri melewati jalur evakuasi yang sudah disediakan. Pastikan seluruh penghuni ruangan gedung dalam keadaan aman';
  //     } else if (snap.val().group === 'pemadam') {
  //       msgTxt = 'Cari titik api kemudian lakukan pemadaman jika api masih mungkin untuk dipadamkan menggunakan APAR. Jika api sudah terlalu besar maka hubungi pemadam kebakaran';
  //     } else if (snap.val().group === 'evakuasi') {
  //       msgTxt = 'Carilah korban cidera atau tertinggal dan lakukan evakuasi korban cidera atau tertinggal';
  //     } else if (snap.val().group === 'dokumen') {
  //       msgTxt = 'Selamatkan dokumen penting dan aset - aset perusahaan yang penting';
  //     } else if (snap.val().group === 'p3k') {
  //       msgTxt = 'Ambil P3K kemudian lakukan pertolongan pertama pada korban kecelakaan yang sudah dievakuasi oleh tim evakuasi';
  //     } else {
  //       msgTxt = 'Lakukan protokol evakuasi dan secepatnya ke titik kumpul evakuasi.';
  //     }
  //   }
  
  //   return msgTxt;
  // };
  

  // // Listen to Members
  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log('fetching data...')
  //     try {
  //       // Handle if simulations
  //       if (simulation === true) {
  //         const infoMsg = await getMemberGroup();
  //         setInfoMessage(infoMsg);
  //       }
  //     } catch (e) {
  //       console.log('Error:', e);
  //     }
  //   };
  
  //   fetchData();
  // }, []);
  
  // useEffect(() => {
  //   console.log('infoMsg:', infoMessage);
  // }, [infoMessage]);
  
  // useEffect(() => {
  //   try {
  //     // Handle if simulations
  //     if (simulation == true) {
  //       console.log('logging: ', getMemberGroup())
  //       // getMemberGroup();
  //     }
  //   } catch (e) {
  //     console.log('Error : ', e);
  //   }
  // }, [])
  
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

    stopVibrationLoop();
  }

  // useEffect(() => {
  //   console.log("Sound Played!")
  //   setTimeout(() => {
  //     sound.setNumberOfLoops(-1)
  //     .setVolume(1)
  //     // .setSystemVolume(1)
  //     .play(() => {
  //       releaseSound();
  //     });
  //   }, 1000);
  // }, [])

  const getTimeFromString = (dateTimeString) => {
    const [date, time] = dateTimeString.split(', ');

    const [month, day, year] = date.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    const timeString = formattedDate + ' ' + time;
    const dateObj = new Date(timeString);
    const formattedTime = dateObj.toLocaleTimeString();

    return formattedTime;
  };

  // useEffect(() => {
  //   console.log('alarmMembers: ', alarmMembers, '\n\n')
  // }, [alarmMembers])
 
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

              {/* <View style={styles.reportWrapper}>
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
              </View> */}

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
                <TouchableOpacity style={styles.footerButton} onPress={handleOpenScan}>
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