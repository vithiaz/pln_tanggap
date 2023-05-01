import React, {Component, useState, useContext, useEffect, createContext} from 'react';
import {
  _View,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Button,
  TouchableNativeFeedbackComponent,
  TouchableOpacity,
  // TouchableHighlight,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  ViewBase,
  ViewComponent,
  ScrollViewComponent,
  Dimensions,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import SettingsIcon from '../../assets/icon/settings.png';
import CheckInOutIcon from '../../assets/icon/check_in_out.png';
import OfficeIcon from '../../assets/icon/office.png';
import AnnouncementIcon from '../../assets/icon/announcement.png';
import AlertIcon from '../../assets/icon/alert.png';
import userDefaultIcon from '../../assets/icon/user_default.png';
import bellRingingIcon from '../../assets/icon/bell_ringing.png';
import timeIcon from '../../assets/icon/time.png';
import LogoutIcon from '../../assets/icon/check_in_out.png';

import { onAuthStateChanged, signOut } from 'firebase/auth';
// import auth from 'firebase/auth';
import { auth } from '../../config/firebase';

import PushNotification, { PushNotificationHandler } from 'react-native-push-notification';
import NotifService from '../../../notifService.js';

import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';

import { Vibration } from 'react-native';


const Home = ({ navigation }) => {
  // React Native Firebase Messaging
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //     console.log('vibrate')
  //     // const durationMs = 2 * 1000; // 120 seconds = 120,000 milliseconds
  //     // Vibration.vibrate(durationMs);
  //   });

  //   return unsubscribe;
  // }, []);



  // // Push Notification
  const [registerToken, setRegisterToken] = useState('');
  const [fcmRegistered, setFcmRegistered] = useState(false);

  const onRegister = (token) => {
    setRegisterToken(token.token);
    setFcmRegistered(true);
  }
  
  // const onNotif = (notif) => {
  //   navigation.navigate('Alarm')
  // }
 
  // const notif = new NotifService(onRegister, onNotif);
  // const handlePerm = (perms) => {
  //   Alert.alert('Permissions ', JSON.stringify(perms));
  // }

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
        async authenticatedUser => {
          authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        }
      );
    return () => unsubscribe();
  }, [user]);

  
  const isHost = true;
  const isCheckout = true;
  const currentDate = new Date();
  const announcementMessage = 'Hari ini akan dilaksanakan simulasi pada pukul 14:00. Diharapkan agar semua yang berada di dalam gedung kantor untuk menjalankan protokol evakuasi.';
  const checkinData = {
    checkinLocation: 'PLN Kawangkoan',
    checkinDate: currentDate.toString(),
    checkinTime: currentDate.getHours() + ':' + (currentDate.getMinutes() < 10 ? ('0' + currentDate.getMinutes()) : (currentDate.getMinutes())),
  }

  return (
    <View style={styles.appView}>
      <Navbar
        user={user}
        username={ "John Doe" }
        isHost={isHost}
        profileImage={ false } />
      <ScrollView endFillColor={ '#F4F7FF' }>
        <CheckoutInfo
          checkinState={ isCheckout }
          checkinData={checkinData}/>
          {isHost && isCheckout == true ? (
            <HostMenu isHost={isHost} isCheckin={isCheckout} />
          ) : ''}
        <CardBody
          announcement={announcementMessage}
          isHost={isHost}/>
      </ScrollView>
      <Footer isCheckout={isCheckout} />
    </View>
  );
}

const Navbar = (props) => {
  const [username, setUsername] = useState(false);
  const [userProfile, setUserProfile] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [user, setUser] = useState(false);

  const navigation = useNavigation();

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const logout = () => {
    signOut(auth).then(() => {
      console.log('Logged out')
    }).catch((error) => {
      console.log('error: ', error)
    });
    
  
  };

  useEffect(() => {
    setUsername(props.username);
    setUserProfile(props.profileImage);
    setIsHost(props.isHost);
    setUser(props.user);
  })
  
  return (
    <View style={navbarStyles.navbarContainer}>
      <View style={navbarStyles.navbarPLNLogoWrapper}>
        <Image source={PLN_logo} style={navbarStyles.navbarPLNLogo} />
        <Text style={navbarStyles.navbarPLNText}>PLN</Text>
      </View>

      {/* Account Info Wrapper */}
      <View style={navbarStyles.accountInfoWrapper}>
        <View style={navbarStyles.profileImageContainer}>
          {userProfile ? (
          <Image source={userProfile} style={navbarStyles.profileImage} />
          ) : (
            <Image source={userDefaultIcon} style={navbarStyles.profileImage} />
          )}
        </View>
          {user != null ? (
              <View style={navbarStyles.usernameWrapper}>
                <Text style={navbarStyles.welcomeText}>
                  Selamat Datang,
                </Text>
                <Text style={navbarStyles.usernameText}>
                  User
                </Text>
                {isHost ? (
                  <Text >
                    Host
                  </Text>
                ) : ''}
              </View>
            ) : (
              <View style={navbarStyles.usernameWrapper}>
                <Text style={navbarStyles.usernameText}>
                  Selamat Datang
                </Text>
              </View>
            )}
        
        {user ? (
          <TouchableOpacity style={navbarStyles.settingsBtn} onPress={logout}>
            <Image source={LogoutIcon} style={navbarStyles.settingsBtnIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={navbarStyles.settingsBtn} onPress={navigateToLogin}>
            <Image source={SettingsIcon} style={navbarStyles.settingsBtnIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const CheckoutInfo = (props) => {
  const [isCheckin, setIsCheckin] = useState(false);
  const [checkinDataInfo, setCheckinData] = useState(false);

  useEffect(() => {
    setIsCheckin(props.checkinState);
    setCheckinData(props.checkinData);
  }, [])

  return (
    <View style={checkoutInfoStyles.mainWrapper}>
      {isCheckin ? (
        <View style={checkoutInfoStyles.checkoutWrapper}>
          <TouchableOpacity style={checkoutInfoStyles.checkoutBtn}>
            <View style={checkoutInfoStyles.btnBg} />
            <Image source={CheckInOutIcon} style={checkoutInfoStyles.checkoutIcon} />
            <Text style={checkoutInfoStyles.checkoutBtnText}>
              Check-out
            </Text>
          </TouchableOpacity>
          <View style={checkoutInfoStyles.checkoutInfoMessageWrapper}>
            <Text style={checkoutInfoStyles.checkoutInfoMessage}>
              Silahkan <Text style={{ fontWeight: 600 }}>Check-out</Text>, setelah meninggalkan area kantor
            </Text>
          </View>
        </View>
      ) : (
        <View style={checkoutInfoStyles.checkoutWrapper}>
          <TouchableOpacity style={checkoutInfoStyles.checkoutBtn}>
            <View style={checkoutInfoStyles.btnBg} />
            <Image source={CheckInOutIcon} style={checkoutInfoStyles.checkoutIcon} />
            <Text style={checkoutInfoStyles.checkoutBtnText}>
              Check-in
            </Text>
          </TouchableOpacity>
          <View style={checkoutInfoStyles.checkoutInfoMessageWrapper}>
            <Text style={checkoutInfoStyles.checkoutInfoMessage}>
              Silahkan <Text style={{ fontWeight: 600 }}>Check-in</Text>, setelah memasuki area kantor
            </Text>
          </View>
        </View>

      )}
      {isCheckin ? (
        <TouchableOpacity style={checkoutInfoStyles.locationCardWrapper}>
          <Image source={OfficeIcon} style={checkoutInfoStyles.officeIcon} />
          <View style={checkoutInfoStyles.locationInfoWrapper} >
            <Text style={checkoutInfoStyles.checkinLocationTitle}>Anda sedang Check-in di</Text>
            <Text style={checkoutInfoStyles.checkinLocationDesc}>{checkinDataInfo.checkinLocation}</Text>
          </View>
          <Text style={checkoutInfoStyles.checkinTimeDesc}>{checkinDataInfo.checkinTime}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={checkoutInfoStyles.locationCardWrapper}>
          <Image source={AlertIcon} style={checkoutInfoStyles.officeIcon} />
          <View style={checkoutInfoStyles.locationInfoWrapper} >
            <Text style={checkoutInfoStyles.checkoutCardMessage}>Lakukan Check-in untuk mengakses alarm darurat</Text>
            {/* <Text style={checkoutInfoStyles.checkoutCardMessage}>s</Text> */}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const HostMenu = (props) => {
  const [isCheckin, setIsCheckin] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    setIsCheckin(props.isCheckin);
    setIsHost(props.isHost);
  })

  const navigation = useNavigation();

  const navigateToCreateSimulaiton = () => {
    navigation.navigate('CreateSimulation');
  }


  return (
    <View style={hostMenuStyles.hostMenuContainer}>
      <Text style={hostMenuStyles.containerTitle}>Host Menu</Text>
      <View style={hostMenuStyles.buttonWrapper}>
        <TouchableOpacity style={hostMenuStyles.menuButton} onPress={navigateToCreateSimulaiton}>
          <Image source={SettingsIcon} style={hostMenuStyles.buttonIcon}/>
          <Text style={hostMenuStyles.buttonText}>Simulasi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={hostMenuStyles.menuButton}>
          <Image source={AnnouncementIcon} style={hostMenuStyles.buttonIcon}/>
          <Text style={hostMenuStyles.buttonText}>Pengumuman</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

}

const CardBody = (props) => {
  const [announcement, setAnnouncement] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    setAnnouncement(props.announcement)
    setIsHost(props.isHost);
  })

  return(
    <View style={cardBodyStyles.cardBody}>
      {isHost ? (
        <View style={cardBodyStyles.cardBodyWrapper}>
          <Text style={cardBodyStyles.cardSeparatorTitle}>Simulasi Terjadwal</Text>
          <TouchableOpacity style={cardBodyStyles.simulationCardWrapper}>
            <Image source={bellRingingIcon} style={cardBodyStyles.simulationIcon}/>
            <View style={cardBodyStyles.simulationInfoWrapper}>
              <Text style={cardBodyStyles.simulationNameText}>Nama Simulasi</Text>
              <Text style={cardBodyStyles.simulationLocationText}>Lokasi Simulasi</Text>
              <Text style={cardBodyStyles.simulationTanggalText}>Tanggal</Text>
            </View>
            <View style={cardBodyStyles.simulationTimeWrapper}>
              <Text style={cardBodyStyles.simulationJamText}>Jam</Text>
            </View>
          </TouchableOpacity>

          <Text style={cardBodyStyles.cardSeparatorTitle}>Pengumuman Aktif</Text>
          <TouchableOpacity style={cardBodyStyles.announcementCardWrapper}>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <Image source={OfficeIcon} style={{ width: 25, height: 25 }}/>
              <Text style={{ flexGrow: 1, color: 'black' }}>PLN Kawangkoan</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <Image source={timeIcon} style={{ width: 25, height: 25 }}/>
              <Text style={{ flexGrow: 1, color: 'black' }}>23 April 2023 - 23 April 2023</Text>
            </View>
            <Text style={{ color: 'black' }}>Hari ini akan dilaksanakan simulasi pada pukul 14:00. Diharapkan agar semua yang berada di dalam gedung kantor untuk menjalankan protokol evakuasi.</Text>
          </TouchableOpacity>

        </View>
      ) : (
        <View style={cardBodyStyles.cardBodyWrapper}>
          {announcement ? (
            <View style={cardBodyStyles.cardMessageContainer}>
              <Text style={cardBodyStyles.cardMessageText}>{props.announcement}</Text>
            </View>
          ) : ''}
          <Text style={cardBodyStyles.cardSeparatorTitle}>Riwayat Aktivitas</Text>
          
        </View>
      )}

      <View style={cardBodyStyles.cardBodyActivityWrapper}>
        <Text style={cardBodyStyles.cardSeparatorTitle}>Riwayat Aktivitas</Text>
        <View style={cardBodyStyles.activityHistoryWrapper}>
          <ActivityHistory activityHistory={{ status: 'checkin', location: 'PLN Kawangkoan', date: '24/04/2023', time: '08:13' }}/>
          <ActivityHistory activityHistory={{ status: 'checkout', location: 'PLN Kawangkoan', date: '24/04/2023', time: '08:13' }} />
          <ActivityHistory activityHistory={{ status: 'checkin', location: 'PLN Kawangkoan', date: '24/04/2023', time: '08:13' }}/>
          <ActivityHistory activityHistory={{ status: 'checkout', location: 'PLN Kawangkoan', date: '24/04/2023', time: '08:13' }}/>
          <ActivityHistory activityHistory={{ status: 'checkin', location: 'PLN Kawangkoan', date: '24/04/2023', time: '08:13' }} />
          <ActivityHistory activityHistory={{ status: 'checkout', location: 'PLN Kawangkoan', date: '24/04/2023', time: '08:13' }}/>
          <ActivityHistory activityHistory={{ status: 'checkin', location: 'PLN Kawangkoan', date: '24/04/2023', time: '08:13' }} />
        </View>
      </View>
    </View>
  )

}

const ActivityHistory = (props) => {
  const [activityHistory, setActivityHistory] = useState(false);

  useEffect(() => {
    setActivityHistory(props.activityHistory);
  })

  if (activityHistory) {
    return (
      <View style={cardBodyStyles.activityHistoryCard}>
        <View style={cardBodyStyles.infoWrapper}>
        {activityHistory.status == 'checkin' ? (
          <Text style={cardBodyStyles.checkinStatus}>Check-in</Text>
        ) : (
          <Text style={cardBodyStyles.checkoutStatus}>Check-out</Text>
        )}
        <Text style={{ color: 'black' }}>{activityHistory.location}</Text>
        </View>
        <View style={cardBodyStyles.timeWrapper}>
          <Text style={{ color: 'black', fontSize: 12 }}>{activityHistory.date}</Text>
          <Text style={cardBodyStyles.timeRecorded}>{activityHistory.time}</Text>
        </View>
      </View>
    )
  } else {
    return
  }
}

const Footer = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);

  const navigation = useNavigation();

  const navigateToAlarm = () => {
    navigation.navigate('Alarm');
  };

  useEffect(() => {
    setIsCheckout(props.isCheckout)
  })

  return (
    <View style={footerStyles.footerContainer}>
      <Text style={footerStyles.footerTitle}>PLN TANGGAP</Text>
      {isCheckout ? (
        <View style={footerStyles.emergencyContainer}>
          <Text style={footerStyles.emergencyText}>ALARM <Text style={{ color: '#ed1c24' }}>DARURAT</Text></Text>
          <TouchableOpacity style={footerStyles.emergencyBtnContainer} onPress={navigateToAlarm}>
            <Image source={bellRingingIcon} style={footerStyles.emergencyBtn}/>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={footerStyles.emergencyContainer}>
          <Text style={footerStyles.emergencyText}>Alarm Darurat Tidak Tersedia</Text>
        </View>
      )}
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  appView: {
    // backgroundColor: Colors.white,
    backgroundColor: '#fff',
    height: '100%'
  }
})

const navbarStyles = StyleSheet.create({
  navbarContainer : {
    paddingHorizontal: 20,
    flexDirection: 'column',
    backgroundColor: '#F4F7FF',
    borderBottomLeftRadius: 32,
  },

  // PLN Logo Wrapper
  navbarPLNLogoWrapper: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  navbarPLNLogo: {
    width: 50,
    height: 50
  },
  navbarPLNText: {
    color: '#00AEEF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4
  },

  // Account Info Wrapper
  accountInfoWrapper: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 15,
    paddingBottom: 10,
    alignItems: 'center',
  },
  profileImageContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#00AEEF',
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    height: '90%',
    width: '90%',
  },
  usernameWrapper: {
    flexDirection: 'column',
    paddingVertical: 5,
    flexGrow: 1
  },
  welcomeText: {
    fontSize: 14,
    color: '#000',
  },
  usernameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  settingsBtn: {
    height: 38,
    width: 38,
    padding: 5,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsBtnIcon: {
    height: '100%',
    width: '100%',
  }

})

const checkoutInfoStyles = StyleSheet.create({
  mainWrapper: {
    padding: 20,
    flexDirection: 'column',
    gap: 20,
    width: '100%',
  },
  checkoutWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 20,
    flex: 1,
    overflow: 'hidden',
  },
  checkoutBtn: {
    width: 120,
    padding: 8,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  btnBg: {
    position: 'absolute',
    left: 0,
    right: '40%',
    top: 0,
    bottom: 0,
    zIndex: -1,
    backgroundColor: '#FFF200',
    borderRadius: 12,
  },
  checkoutIcon: {
    width: 20,
    height: 20,
  },
  checkoutBtnText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
  },
  checkoutInfoMessageWrapper: {
    padding: 0,
    flexShrink: 1,
  },
  checkoutInfoMessage: {
    textAlign: 'right',
    color: '#000',
    lineHeight: 25,
  },

  locationCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFF200',
    gap: 10,
    borderRadius: 12,
  },
  officeIcon: {
    width: 30,
    height: 30,
  },
  locationInfoWrapper: {
    flexDirection: 'column',
    gap: 2,
    flexGrow: 1,
    flexShrink: 1,
  },
  checkinLocationTitle: {
    fontSize: 14,
    color: 'black',
  },
  checkinLocationDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  checkinTimeDesc: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  checkoutCardMessage: {
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  }

})

const hostMenuStyles = StyleSheet.create({
  hostMenuContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonWrapper: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#00aeef',
  },
  buttonIcon: {
    height: 25,
    width: 25,
  },
  buttonText: {
    fontWeight: 600,
    color: 'white',
  }

})

const cardBodyStyles = StyleSheet.create({
  cardBodyWrapper: {
    padding: 20,
    flexDirection: 'column',
    gap: 10,
    backgroundColor: '#F4F7FF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  cardBodyActivityWrapper: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    gap: 10,
    backgroundColor: '#F4F7FF',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  cardMessageContainer: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00AEEF',
  },
  cardMessageText: {
    textAlign: 'center',
    color: 'black',
  },

  // Simulation Card
  simulationCardWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    position: 'relative',
    marginBottom: 10,
  },
  simulationIcon: {
    width: 35,
    height: 35,
  },
  simulationInfoWrapper: {
    flexDirection: 'column',
    gap: 2,
    flexShrink: 1,
    flexGrow: 1,
  },
  simulationNameText: {
    color: 'black',
  },
  simulationLocationText: {
    fontWeight: '600',
    color: 'black',
  },
  simulationJamText: {
    color: 'black',
    fontWeight: 600,
  },

  // Announcement Card Wrapper
  announcementCardWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    gap: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    position: 'relative',
    marginBottom: 10,
  },

  cardSeparatorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  activityHistoryWrapper: {
    width: '100%',
    height: '100%',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    flex: 1,
  },
  activityHistoryCard: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  checkinStatus: {
    fontWeight: 600,
    fontSize: 16,
    color: '#00AEEF', 
  },
  checkoutStatus: {
    fontWeight: 600,
    fontSize: 16,
    color: '#ED1C24', 
  },
  timeRecorded: {
    fontSize: 18,
    fontWeight: 600,
  }

})

const footerStyles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00aeef',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 36,
    position: 'relative',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 3,
    color: 'white',
    paddingHorizontal: 20,
  },
  emergencyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: '#fff200',
    height: 28,
    borderTopLeftRadius: 36,
    borderBottomLeftRadius: 36,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '-90%',
    right: 0,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    // shadowOffset: {12, 12},
  },
  emergencyBtnContainer: {
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
  emergencyText: {
    color: 'black',
    fontWeight: 600,
  },
  emergencyBtn: {
    width: '80%',
    height: '80%',
  }
})


