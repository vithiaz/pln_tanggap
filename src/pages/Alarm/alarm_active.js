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
import SirenIcon from '../../assets/icon/siren.png'
import AlertIcon from '../../assets/icon/alert.png'
import bellRingingIcon from '../../assets/icon/bell_ringing.png';
import Sound from 'react-native-sound'
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';

const alarmSound = require("../../assets/sound/alarm.wav")

export default function AlarmActive() {
  const infoMessage = 'Lakukan protokol evakuasi dan secepatnya ke titik kumpul evakuasi.';
  const infoMessageHeader = 'KEADAAN DARURAT!!!';

  const [playingState, setPlayingState] = useState(true);

  // const sound = new Sound(alarmSound, Sound.MAIN_BUNDLE, (err) => {
  //   if (err) {
  //     console.log(err)
  //     return;
  //   }
  // })
  const releaseSound = () => {
    console.log('Sound Released');
    // sound.release();
  }
  // useEffect(() => {
  //   console.log("Sound Played!")
  //   setTimeout(() => {
  //     sound.setNumberOfLoops(-1)
  //             .setVolume(1)
  //             // .setSystemVolume(1)
  //             .play(() => {
  //       // console.log('ended');
  //       // console.log('duration in seconds: ' + sound.getDuration());
  //     });
  //   }, 100);
  // }, [])

  useEffect(() => {
    console.log('Page Triggered');
    // RNNotificationCall.backToApp();
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

          {/* Alarm Button */}
          <View style={styles.pageBodyWrapper}>
            <TouchableOpacity style={styles.alarmButton} onPress={releaseSound}>
              <Image source={SirenIcon} style={styles.alarmButtonIcon}/>
            </TouchableOpacity>
            
            {/* Time Wrapper */}
            <View style={styles.timerWrapper}>
              <Text style={styles.timerNumber}>00</Text>
              <Text style={styles.timerNumberSeparator}>:</Text>
              <Text style={styles.timerNumber}>00</Text>
              <Text style={styles.timerNumberSeparator}>:</Text>
              <Text style={styles.timerNumber}>00</Text>
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
          <View style={styles.pageFooterWrapper}>
            <TouchableOpacity style={styles.footerButton}>
              <Text style={styles.footerButtonText}>Saya sudah di titik evakuasi</Text>
            </TouchableOpacity>
          </View>
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
    letterSpacing: 1,
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