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
import axios from 'axios';

import BackIcon from '../../assets/icon/back.png'
import SirenIcon from '../../assets/icon/siren.png'
import AlertIcon from '../../assets/icon/alert.png'
import bellRingingIcon from '../../assets/icon/bell_ringing.png';
import { TextArea } from 'native-base'
import { TextInput } from 'react-native-gesture-handler'
import { child, onValue, push, ref, set } from 'firebase/database'
import { db, messagingApiUrl, messagingServerKey } from '../../config/firebase'
import { useFocus } from 'native-base/lib/typescript/components/primitives'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/loader';

export default AlarmAlert = ({ route, navigation }) => {
  const infoMessageHeader = 'INFORMASI PENTING';
  const infoMessage = 'Alarm darurat akan memperingati semua orang pada tempat anda Check-in untuk segera melakukan evakuasi.';
  const checkinId = route.params.checkinId;
  const checkinKey = route.params.checkinKey;
  const myToken = route.params.myToken;

  // const [locationId, setLocationId] = useState(null);
  const [information, setInformation] = useState('');
  const [checkinTokens, setCheckinTokens] = useState([]);
  const [staffTokens, setStaffTokens] = useState([]);
  const [guestTokens, setGuestTokens] = useState([]);
  const [notifyTokens, setNotifyTokens] = useState([])
  const [safePointId, setSafePointId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInformationChange = (info) => {
    setInformation(info);
  }

  useEffect(() => {
    console.log('updateId ' , checkinId)
    console.log('Locationkey ' , checkinKey)
    console.log('TOken ' , myToken)
  }, [])

  const getOfficeData = () => {
    onValue(ref(db, '/offices/' + checkinKey), (snap) => {
      setSafePointId(snap.val().safe_point_id);
    }, {onlyOnce: true})
  }

  const getCheckinToken = () => {
    onValue(ref(db, '/checkin_data'), (snap) => {
      const newData = [];
      snap.forEach((snapchild) => {
        if (snapchild.val().checkout_time == null && snapchild.val().location_id == checkinKey) {
          newData.push(snapchild.val().device_token);
        }
      })
      setCheckinTokens(newData)
    }, {onlyOnce: true})
  }

  const getStaffToken = () => {
    onValue(ref(db, '/users'), (snap) => {
      const newData = [];
      snap.forEach((snapchild) => {
        if (snapchild.val().office_UID == checkinKey) {
          newData.push(snapchild.val().device_token)
        }
      })
      setStaffTokens(newData)
    }, {onlyOnce: true})
  }

  const getGuestToken = () => {
    onValue(ref(db, '/guest_checkin'), (snap) => {
      const newData = [];
      snap.forEach((snapchild) => {
        if (snapchild.val().location_id == checkinKey) {
          newData.push(snapchild.val().device_token);
        }
      })
      setGuestTokens(newData)
    }, {onlyOnce: true})
  }
    
  const combineArrays = (...arrays) => {
    const combinedArray = [].concat(...arrays);
    return [...new Set(combinedArray)];
  };

  const getAllToken = () => {
    getCheckinToken(),
    getStaffToken(),
    getGuestToken(),
    getOfficeData()
  }

  useEffect(() => {
    getAllToken();
  }, [notifyTokens])

  const sendPushNotification = (notificationData) => {
    axios({
      method: 'POST',
      url: messagingApiUrl,
      headers: {
        Authorization: `key=${messagingServerKey}`,
        'Content-Type': 'application/json',
      },
      data: notificationData,
    })
      .then(response => {
        console.log('Notification sent:', response.data);
      })
      .catch(error => {
        console.log('Error sending notification:', error);
      });
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
  
  const handleAlarmTriggered = async() => {
    const getNotificationTokens = async() => {
      await Promise.all([
        getAllToken(),
        res = combineArrays(checkinTokens, ...staffTokens, ...guestTokens)
      ])
      setNotifyTokens(res);
      return res;
    }
    const notifyTokensResult = await getNotificationTokens();
    // Create alarms table
    try {
      const alarmKey = push(child(ref(db), 'alarms')).key;
      set(ref(db, 'alarms/' + alarmKey), {
        alarmKey: alarmKey,
        trigerred_token: myToken,
        status: 'activate',
        title: 'Alarm Darurat',
        body: information,
        safeKey: safePointId,
        triggeredTime: getCurrentTime()
      });

      const notificationData = {
        registration_ids: notifyTokensResult,
        priority: "high",
        notification: {
          title: "Alarm Darurat",
          body: information,
          sound: "alarm",
          android_channel_id: "default",
          // android_channel_id: "alarm_channel",
          userInteraction: true,
          autoCancel: true,
          vibrate: true,
          vibration: 1000,
          ongoing: true,
          show_in_foreground: true
          // send_at: 0, // UNIX timestamp
        },
        data: {
          notificationType: 'emergency',
          alarmKey: alarmKey,
          trigerred_token: myToken,
          simulation: false
        }
      }

      const notificationAwaker = {
        registration_ids: notifyTokensResult,
        priority: "high",
        notification: {
          title: "",
          body: "",
          sound: "",
          android_channel_id: "default",
          // android_channel_id: "alarm_channel",
        },
        data: {
          notificationType: 'awaker',
        }
      }

      const sendAwaker = () => {
        console.log('sending awaker...');
        setIsLoading(true)
        sendPushNotification(notificationAwaker);
      }

      sendAwaker();
      setTimeout(() => {
        console.log('sending notification...');
        sendPushNotification(notificationData);
        setIsLoading(false)
        
        console.log('notification send...');
        const activeAlarmData = {
          alarmKey: alarmKey,
          simulation: false
        }
        AsyncStorage.setItem('@activeAlarm', JSON.stringify(activeAlarmData));
        navigation.navigate('Active', {
          myToken: myToken,
          alarmKey: alarmKey,
          simulation: false
         }, { replace: true });
        navigation.reset({
          index: 0,
          routes: [{ name: 'Alert' }]
        });
      }, 7000)
      
            
    }
    catch (e) {
      console.log('Error while activating alarm: ', e);
    }

  }
  
  return (
    <>
      {isLoading ? (<Loader/>) : null}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: 'white', width: '100%', flexDirection: 'column' }}>
        <SafeAreaView style={{ height: '100%', }}>
          <View style={styles.pageContainer}>
            <View style={styles.topNavigationWrapper}>
              <TouchableOpacity style={styles.button} onPress={() => {navigation.pop()}}>
                <Image source={BackIcon} style={styles.buttonIcon} />
              </TouchableOpacity>
            </View>

            {/* Alarm Button */}
            <View style={styles.pageBodyWrapper}>
              <TouchableOpacity style={styles.alarmButton} onPress={handleAlarmTriggered}>
                <Image source={SirenIcon} style={styles.alarmButtonIcon}/>
                <Text style={styles.alarmButtonText}>BUNYIKAN ALARM</Text>
              </TouchableOpacity>
                          
              {/* Info Wrapper */}
              <View style={styles.infoWrapper}>
                <Image source={AlertIcon} style={styles.infoCardIcon} />
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoTextHeader}>{infoMessageHeader}</Text>
                  <Text style={styles.infoTextMessage}>{infoMessage}</Text>
                </View>
              </View>

              <View style={styles.addInfoWrapper}>
                <Text style={{ color: 'black', fontWeight: '600' }}>Informasi :</Text>
                <TextInput placeholder='Informasi keadaan darurat...' onChangeText={handleInformationChange}></TextInput>
              </View>
            </View>


          </View>
        </SafeAreaView>
      </ScrollView>
    </>
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
    backgroundColor: '#FFF200',
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
  },
  timerNumber: {
    fontSize: 16,
    color: 'black',
    fontWeight: '700',
    letterSpacing: 1,
  },
  timerNumberSeparator: {
    fontSize: 16,
    color: 'black',
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: 5,
  },

  infoWrapper: {
    width: '100%',
    backgroundColor: '#FFF200',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addInfoWrapper: {
    width: '100%',
    backgroundColor: '#f4f7ff',
    borderRadius: 12,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
    color: '#ED1C24',
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