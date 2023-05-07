import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import axios from 'axios';

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import backIcon from '../../assets/icon/back.png'
import bellRingingIcon from '../../assets/icon/bell_ringing.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { push, child, ref, set, update, onValue } from 'firebase/database';
import { db, messagingApiUrl, messagingServerKey } from '../../config/firebase';
import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';

export default SimulationInfo = ({route, navigation}) => {
    const simulationId = route.params.simulationId;
    const simulationData = route.params.data;
    const userInfo = route.params.userInfo;
    const [isRegister, setIsRegister] = useState(false);
    const [isHost, setIsHost] = useState(false)
    const [notificationIds, setNotificationIds] = useState([]);

    // Get device token
    const [deviceToken, setDeviceToken] = useState('');
    const getDeviceToken = async () => {
        try {
            const value = await AsyncStorage.getItem('@device_token')
            setDeviceToken(JSON.parse(value))
        } catch(e) {
            console.log(e);
        }
    }
    
    // Handle if user already register based on device token
    useEffect(() => {
        getDeviceToken();
        if (simulationData.hasOwnProperty('members')) {
            Object.entries(simulationData.members).map(([token, data]) => {
                if (data.device_token == deviceToken) {
                    setIsRegister(true);
                }
            })
        }
    }, [deviceToken])
    
    // Handle if host
    useEffect(() => {
        if (userInfo) {
            if (userInfo.user_type == 'host') {
                setIsHost(true);
            }
        }
    }, [userInfo])

    // Register Simulation
    const handleRegisterSimulation = () => {
        try {
            set(ref(db, 'simulations/' + simulationId + '/members/' + deviceToken), {
                device_token: deviceToken,
                secure_state: false,
            });
            setIsRegister(true)
            console.log('Simulation registration success');
        } catch (e) {
            console.log('Error: ', e);
        }
    }
    // Cancel Register Simulation
    const handleCancelRegisterSimulation = () => {
        try {
            const updates = {}
            updates['/simulations/' + simulationId + '/members/' + deviceToken] = null;
            update(ref(db), updates);
            setIsRegister(false)
            console.log('Simulation registration canceled');
        } catch (e) {
            console.log('Error: ', e);
        }
    }

    // Cancel Simulation
    const handleCancelSimulation = () => {
        try {
            const updates = {}
            updates['/simulations/' + simulationId] = null;
            update(ref(db), updates);
            setIsRegister(false)
            navigation.pop();
            console.log('Simulation canceled');
        } catch (e) {
            console.log('Error: ', e);
        }
    }

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

    // Start Simulation
    const handleStartSimulation = () => {
      update(ref(db, 'simulations/' + simulationId), {
        status: 'active',
      })

      if (!notificationIds.includes(deviceToken)) {
        notificationIds.push(deviceToken);
      }

      const notificationData = {
        registration_ids: notificationIds,
        priority: "high",
        notification: {
          title: simulationData.name,
          body: "Simulasi keadaan darurat " + simulationData.location_name,
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
          simulation: true,
          alarmKey: simulationId,
          // trigerred_token: deviceToken,
        }
      }
      console.log(notificationData)
      sendPushNotification(notificationData);
      navigation.pop();
    }

    // Getting simulations members to notify
    useEffect(() => {
      const unsubscribe = () => {
        onValue(ref(db, '/simulations/' + simulationId + '/members'), (snap) => {
        setNotificationIds([]);
        const data_ids = [];
        snap.forEach((snapchild) => {
          const token = snapchild.val().device_token;
          data_ids.push(token)
        })
        console.log('getting ids: ', data_ids)
        setNotificationIds(data_ids);
      })
    }
    return unsubscribe();
    }, [])

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: 'white', width: '100%', flexDirection: 'column' }}>
            <SafeAreaView style={{ height: '100%', }}>
            <View style={styles.container}>
                <View style={styles.topNavigationWrapper}>
                <TouchableOpacity style={styles.button} onPress={() => {navigation.pop()}}>
                    <Image source={backIcon} style={styles.buttonIcon} />
                </TouchableOpacity>
                </View>
                <View style={styles.pageTitleWrapper}>
                <Text style={styles.appTitleText}>Informasi Simulasi</Text>
                <TouchableOpacity style={styles.pageIconContainer} >
                    <Image source={bellRingingIcon} style={styles.pageIcon}/>
                </TouchableOpacity>
                </View>
            </View>
            
            <View style={contentCardStyles.contentCard}>
                <View style={styles.containerFillHeight}>
                {/* Card Body */}
                <View style={contentCardStyles.cardBody} >
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Nama Simulasi</Text>
                        <Text style={contentCardStyles.formInputText}>{simulationData.name}</Text>
                        {/* <TextInput style={contentCardStyles.formInputText} placeholder='simulasi' onChangeText={handleSimulationName}></TextInput> */}
                    </View>
        
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Lokasi</Text>
                        <Text style={contentCardStyles.formInputText}>{simulationData.location_name}</Text>
                    </View>
                    
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Tanggal dan Waktu</Text>
                        <Text style={contentCardStyles.formInputText}>{simulationData.date_start}</Text>
                    </View>
                    
                    {/* Buttons */}
                    <View style={contentCardStyles.buttonWrapper}>
                        {(isRegister == false) ? (
                            <TouchableOpacity style={contentCardStyles.AbortButton} onPress={handleRegisterSimulation}>
                                <Text style={contentCardStyles.AbortButtonText}>Ikuti Simulasi</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <Text>Anda telah terdaftar untuk simulasi ini</Text>
                                <TouchableOpacity style={contentCardStyles.AbortButton} onPress={handleCancelRegisterSimulation}>
                                    <Text style={contentCardStyles.AbortButtonText}>Batalkan Pendaftaran</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        {isHost && (
                            <>
                                <TouchableOpacity style={contentCardStyles.DangerButton} onPress={handleCancelSimulation}>
                                    <Text style={contentCardStyles.DangerButtonText}>BATALKAN SIMULASI</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={contentCardStyles.SubmitButton} onPress={handleStartSimulation}>
                                    <Text style={contentCardStyles.SubmitButtonText}>MULAI SIMULASI</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
                {/* Card Footer */}
                <View style={contentCardStyles.cardFooter} >
                    <View style={contentCardStyles.footerLogoContainer}>
                    <Image source={PLN_logo} style={contentCardStyles.footerLogo} />
                    <Text style={contentCardStyles.footerLogoText}>PLN</Text>
                    </View>
                </View>
                </View>
            </View>


            </SafeAreaView>
        </ScrollView>
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