import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native'
import RNRestart from 'react-native-restart';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

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
  const [officeName, setOfficeName] = useState('')
  const [triggeredTime, setTriggeredTime] = useState('')
  

  const appendAlarmMember = (newData) => {
    setAlarmMembers((prevData) => [...prevData, newData]);
  }
  
  const alarmId = route.params.alarmId;
  const isSimulation = route.params.simulation;
  const isHost = route.params.isHost;

  useEffect(() => {
    console.log("isHost: ", isHost)
  }, [isHost])

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
    if (isSimulation == true) {
      onValue(ref(db, '/simulations/' + alarmId), (snap) => {
        console.log('simulations name ', snap.val().name)
        console.log('triggeredTime ', snap.val().triggeredTime)
        setOfficeName(snap.val().name)
        setTriggeredTime(snap.val().triggeredTime)
      }, { onlyOnce: true })
    } else {
      onValue(ref(db, '/alarms/' + alarmId + '/'), (snap) => {
        if (snap.val()) {
          setOfficeName(snap.val().location)
          setTriggeredTime(snap.val().triggeredTime)
        }
      }, { onlyOnce: true })
    }
  }, [alarmId])

  // Listen to alarms table members / simulations table members
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


  const downloadReport = async () => {
    const alarmMembersStr = JSON.stringify(alarmMembers)
    const alarmMembersData = JSON.parse(alarmMembersStr)

    try {
      const html = `
      <html>
      <head>
          <style>
              * {
                  margin: 0;
                  box-sizing: border-box;
                  font-family: Arial, Helvetica, sans-serif;
              }
              body {
                  padding: 20px 40px;
              }
              .page-title {
                  font-size: 1.8rem;
                  font-weight: 600;
                  letter-spacing: 2px;
                  margin-bottom: 20px;
              }
              .content-head {
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
              }
              .content-head .row-wrapper {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  flex-wrap: wrap;
                  column-gap: 10px;
                  row-gap: 5px;
              }
              .content-head .row-wrapper .row-title {
                  flex-basis: 220px;
              }
              .content-head .row-wrapper .row-content {
                  flex-grow: 1;
                  font-weight: 600;
              }
              .content-body {
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
                  padding: 10px 0;
              }
              .content-body .content-title {
                  font-weight: 600;
                  padding: 10px 0;
              }
              .content-body table {
                  gap: 0;
              }
              .content-body table thead {
                  background-color: #eaeaea;
                  height: 40px;
              }
              .content-body table tbody tr td{
                  padding: 10px 5px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <h1 class="page-title">Alarm Report</h1>
          <div class="content-head">
              <div class="row-wrapper">
                  <span class="row-title">Tipe Alarm</span>
                  <span class="row-content">${isSimulation ? ("SIMULASI ALARM DARURAT") : ("ALARM DARURAT")}</span>
              </div>
              ${isSimulation ? (`
                <div class="row-wrapper">
                    <span class="row-title">Nama Simulasi</span>
                    <span class="row-content">${officeName}</span>
                </div>
              `) : (`
                <div class="row-wrapper">
                    <span class="row-title">Lokasi Alarm</span>
                    <span class="row-content">${officeName}</span>
                </div>
              `)}
              <div class="row-wrapper">
                  <span class="row-title">Waktu diaktifkan</span>
                  <span class="row-content">${triggeredTime}</span>
              </div>
          </div>
          <div class="content-body">
              <span class="content-title">Laporan Evakuasi</span>
              <table cellspacing="0" border=1 frame=hsides rules=rows>
                  <thead>
                    ${isSimulation ? (`
                      <tr>
                          <th>Nama</th>
                          <th>Grup</th>
                          <th>Waktu Evakuasi</th>
                      </tr>                    
                    `) : (`
                      <tr>
                          <th>Nama</th>
                          <th>Telepon</th>
                          <th>Pekerjaan</th>
                          <th>Jabatan</th>
                          <th>Waktu Evakuasi</th>
                      </tr>                    
                    `)}
                  </thead>
                  ${isSimulation ? (`
                    <tbody>
                      ${alarmMembersData.map((item) => `
                        <tr>
                          <td>${item.checkin_name ? `${item.checkin_name}` : ``}</td>
                          <td>${item.group ? `${item.group}` : ``}</td>
                          <td>${item.secure_time ? `${item.secure_time}` : ``}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  `) : (`
                    <tbody>
                      ${alarmMembersData.map((item) => `
                        <tr>
                          <td>${item.checkin_name ? `${item.checkin_name}` : ``}</td>
                          <td>${item.checkin_phone ? `${item.checkin_phone}` : ``}</td>
                          <td>${item.checkin_job ? `${item.checkin_job}` : ``}</td>
                          <td>${item.checkin_pos ? `${item.checkin_pos}` : ``}</td>
                          <td>${item.secure_time ? `${item.secure_time}` : ``}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  `)}
              </table>
          </div>
      </body>
      </html>
      `;
      
      let date = new Date();
      const options = {
        html,
        fileName: 'data_' + Math.floor(date.getTime() + date.getSeconds() / 2),
        directory: 'PLNTanggapDocs',
      };  
      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert(
        'Success',
        `PDF disimpan di ${file.filePath}`,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    }
    catch (e) {
      console.log(e)
    }
  }
  
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
          {/* {isHost && ( */}
            <View style={styles.pageFooterWrapper}>
              <TouchableOpacity style={styles.footerButton} onPress={downloadReport}>
                <Text style={styles.footerButtonText}>Download Laporan</Text>
              </TouchableOpacity>
            </View>
          {/* )} */}
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
    backgroundColor: '#00AEEF',
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