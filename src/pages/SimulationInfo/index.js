import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Dimensions, Platform, PermissionsAndroid } from 'react-native'
import axios from 'axios';

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import backIcon from '../../assets/icon/back.png'
import bellRingingIcon from '../../assets/icon/bell_ringing.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { push, child, ref, set, update, onValue } from 'firebase/database';
import { db, messagingApiUrl, messagingServerKey } from '../../config/firebase';
import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';
import RNHTMLtoPDF from 'react-native-html-to-pdf';


import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob'


import CheckInOutIcon from '../../assets/icon/check_in_out.png';
import SecurityIcon from '../../assets/icon/guard.png';
import PemadamIcon from '../../assets/icon/fireman.png';
import EvakuasiIcon from '../../assets/icon/evacuator.png';
import DokumenIcon from '../../assets/icon/document_guard.png';
import MedicIcon from '../../assets/icon/medic.png';
import GuestIcon from '../../assets/icon/guest.png';
import Loader from '../../components/loader';
import { Alert } from 'native-base';

export default SimulationInfo = ({route, navigation}) => {
    const simulationId = route.params.simulationId;
    const simulationData = route.params.data;
    const checkinName = route.params.checkinName;
    const userInfo = route.params.userInfo;
    const [isRegister, setIsRegister] = useState(false);
    const [isHost, setIsHost] = useState(false)
    const [notificationIds, setNotificationIds] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [teamInput, setTeamInput] = useState('guest');
    const [isLoading, setIsLoading] = useState(false);

    const formAnimatedHeight = new Animated.Value(0);
    const heightPercentage = formAnimatedHeight.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp',
    });

    // Handle Select Team
    const handleSelectedTeam = (teamKey) => {
      setTeamInput(teamKey);
    }
  
    // Handle Toggle Form
    const toggleForm = async () => {
      setShowForm(!showForm);
    }
    useEffect(() => {
      if (showForm) {
         Animated.timing(formAnimatedHeight, {
            toValue: 100,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
        Animated.timing(formAnimatedHeight, {
           toValue: 0,
           duration: 200,
           useNativeDriver: false,
         }).start();
      }
    }, [showForm]);

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
        console.log('\ncheckinName :\n', checkinName, '\n\n')
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
        if (checkinName) {
          set(ref(db, 'simulations/' + simulationId + '/members/' + deviceToken), {
              device_token: deviceToken,
              checkin_name: checkinName,
              group: teamInput,
              secure_state: false,
          });
        } else {
          set(ref(db, 'simulations/' + simulationId + '/members/' + deviceToken), {
              device_token: deviceToken,
              checkin_name: nameInput,
              group: teamInput,
              secure_state: false,
          });
        }
          setIsRegister(true)
          console.log('Simulation registration success');
          toggleForm();
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

      const notificationAwaker = {
        registration_ids: notificationIds,
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

        navigation.pop();
      }, 7000)


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

    const testExportIds = async () => {
      try {
        const membersData = []
        onValue(ref(db, '/simulations/' + simulationId + '/members'), (snap) => {
          snap.forEach((snapchild) => {
            membersData.push(snapchild.val())
          })
        }, {onlyOnce: true})

        downloadExcelFile(membersData)
  
        
        // let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        // console.log('perm: ', isPermitedExternalStorage)
        
        // if (!isPermitedExternalStorage) {

        //   // Ask for permission
        //   const granted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //     {
        //       title: "Storage permission needed",
        //       buttonNeutral: "Ask Me Later",
        //       buttonNegative: "Cancel",
        //       buttonPositive: "OK"
        //     }
        //   );

        //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //     // Permission Granted (calling our exportDataToExcel function)
        //     downloadExcelFile(membersData)
        //     console.log("Permission granted");
        //   } else {
        //     // Permission denied
        //     console.log("Permission denied");
        //   }

        // } else {
        //   downloadExcelFile(membersData)
        // }

        // console.log(membersData);
      }
      catch (e) {
        console.log('Error: ', e)
      }

    }

    // Export Marker / Checkpoint
    const downloadExcelFile = async (data) => {
      const orderLines = [
        {
          id: 1,
          product: 'Product 1',
          quantity: 1,
          price: '$10.00',
        },
        {
          id: 2,
          product: 'Product 2',
          quantity: 2,
          price: '$20.00',
        },
        {
          id: 3,
          product: 'Product 3',
          quantity: 3,
          price: '$30.00',
        },
      ];

      
      try {
        const html = `
          <html>
            <head>
              <style>
                body {
                  font-family: 'Helvetica';
                  font-size: 12px;
                }
                header, footer {
                  height: 50px;
                  background-color: #fff;
                  color: #000;
                  display: flex;
                  justify-content: center;
                  padding: 0 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th, td {
                  border: 1px solid #000;
                  padding: 5px;
                }
                th {
                  background-color: #ccc;
                }
              </style>
            </head>
            <body>
              <header>
                <h1>Invoice for Order #</h1>
              </header>
              <h1>Order Details</h1>
              <table>
                <tr>
                  <th>Order ID</th>
                  <td></td> 
                </tr>
                <tr>
                  <th>Order Date</th>
                  <td>29-Jul-2022</td>
                </tr>
                <tr>
                  <th>Order Status</th>
                  <td>Completed</td>
                </tr>
                <tr>
                  <th>Order Total</th>
                  <td>$13232</td>
                </tr>
              </table>
              <h1>Order Lines</h1>
              <table>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Product Qty</th>
                  <th>Product Price</th>
                </tr>
                ${orderLines
                  .map(
                    line => `
                  <tr>
                    <td>${line.id}</td>
                    <td>${line.product}</td>
                    <td>${line.quantity}</td>
                    <td>${line.price}</td>
                  </tr>
                `,
                  )
                  .join('')}
              </table>
              <footer>
                <p>Thank you for your business!</p>
              </footer>
            </body>
          </html>
        `;
        // const options = {
        //   html,
        //   fileName: 'data_' + Math.floor(date.getTime() + date.getSeconds() / 2),
        //   directory: 'tempExport',
        // };

        let date = new Date();
        const options = {
          html,
          fileName: 'data_' + Math.floor(date.getTime() + date.getSeconds() / 2),
          directory: 'tempExport',
        };  
        const file = await RNHTMLtoPDF.convert(options);
        console.log('Success', `PDF saved to ${file.filePath}`);
      
      } catch (e) {
        console.log(e)
      }
  

    }

    // const downloadExcelFile = async (data) => {     
    //   jsonData = [{id: '1', name: 'First User'},{ id: '2', name: 'Second User'}]
      
    //   let wb = XLSX.utils.book_new();
    //   let ws = XLSX.utils.json_to_sheet(jsonData) 
    //   XLSX.utils.book_append_sheet(wb,ws,"Users")
    //   const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"})

    //   let date = new Date();
    //   const { fs } = RNFetchBlob;

    //   let filename = '/data_' + Math.floor(date.getTime() + date.getSeconds() / 2) + '.xlsx';
    //   const filePath = fs.dirs.DownloadDir + filename;
    //   // const filePath = `${RNFS.DocumentDirectoryPath}/data.xlsx`;
      
    //   fs.writeFile(filePath, wbout, 'base64')
    //     .then(() => {
    //         RNFetchBlob.android.addCompleteDownload({
    //             title: 'TestDataExcel',
    //             useDownloadManager: true,
    //             showNotification: true,
    //             notification: true,
    //             path: filePath,
    //             mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //             description: 'ExcelFile',
    //           });
    //     })
    //     .catch((err) => {console.log('ERR: ', err)})      
    // }
   

    return (
      <>
        {isLoading ? (<Loader/>) : null}
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
                      {isHost ? (
                        <>
                          <TouchableOpacity style={contentCardStyles.DangerButton} onPress={handleCancelSimulation}>
                              <Text style={contentCardStyles.DangerButtonText}>BATALKAN SIMULASI</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={contentCardStyles.SubmitButton} onPress={handleStartSimulation}>
                              <Text style={contentCardStyles.SubmitButtonText}>MULAI SIMULASI</Text>
                          </TouchableOpacity>
                          {/* <TouchableOpacity style={contentCardStyles.SubmitButton} onPress={testExportIds}>
                              <Text style={contentCardStyles.SubmitButtonText}>Check Download</Text>
                          </TouchableOpacity> */}
                        </>
                      ) : (
                        <>
                          {(isRegister == false) ? (
                              <>
                                <Animated.View
                                    style={{ 
                                      flexDirection: 'column',
                                      gap: 10,
                                      width: '100%',
                                      maxHeight: heightPercentage,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <View style={{ 
                                      flexDirection: 'row',
                                      gap: 10,
                                      flexWrap: 'wrap',
                                    }}>
                                      <Text>Pilihan regu</Text>
                                      {Object.entries({
                                        'guest': ['Karyawan / Tamu', GuestIcon],
                                        'security': ['Regu Pengamanan Area', SecurityIcon],
                                        'pemadam': ['Regu Pemadam Kebakaran', PemadamIcon],
                                        'evakuasi': ['Regu Evakuasi', EvakuasiIcon],
                                        'dokumen': ['Regu Penyelaman Dokumen', DokumenIcon],
                                        'p3k': ['Regu P3K', MedicIcon],
                                      }).map(([key, value]) => (
                                        <TouchableOpacity
                                          key={key}
                                          style={(key == teamInput) ? contentCardStyles.simulationRoleCardSelected : contentCardStyles.simulationRoleCard}
                                          onPress={() => handleSelectedTeam(key)}
                                        >
                                          <Image source={value[1]} style={contentCardStyles.simulationRoleCardIcon}/>
                                          <Text style={contentCardStyles.simulationRoleCardLabel}>{value[0]}</Text>
                                        </TouchableOpacity>
                                      ))}
                                    </View>
                                    {(checkinName === false) ? (
                                      <View style={{
                                        flexDirection: 'row',
                                        gap: 10,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: 'white',
                                        paddingHorizontal: 10,
                                        borderRadius: 12
                                      }}>
                                        <TextInput
                                          style={contentCardStyles.formInputText}
                                          placeholder='Nama Lengkap...'
                                          onChangeText={(text) => setNameInput(text)}
                                        ></TextInput>
                                        <TouchableOpacity style={contentCardStyles.formBtn} onPress={handleRegisterSimulation}>
                                            <Image source={CheckInOutIcon} style={contentCardStyles.formBtnIcon} />
                                        </TouchableOpacity>
                                      </View>
                                    ) : '' }
                                </Animated.View>
                                {showForm ? (
                                  <TouchableOpacity style={contentCardStyles.AbortButton} onPress={handleRegisterSimulation}>
                                      <Text style={contentCardStyles.AbortButtonText}>Ikuti Simulasi</Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity style={contentCardStyles.AbortButton} onPress={toggleForm}>
                                      <Text style={contentCardStyles.AbortButtonText}>Ikuti Simulasi</Text>
                                  </TouchableOpacity>
                                )}
                              </>
                          ) : (
                              <>
                                  <Text>Anda telah terdaftar untuk simulasi ini</Text>
                                  <TouchableOpacity style={contentCardStyles.AbortButton} onPress={handleCancelRegisterSimulation}>
                                      <Text style={contentCardStyles.AbortButtonText}>Batalkan Pendaftaran</Text>
                                  </TouchableOpacity>
                              </>
                          )}
                        </>
                      )}
                          
                        {/* {isHost && (
                            <>
                                <TouchableOpacity style={contentCardStyles.DangerButton} onPress={handleCancelSimulation}>
                                    <Text style={contentCardStyles.DangerButtonText}>BATALKAN SIMULASI</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={contentCardStyles.SubmitButton} onPress={handleStartSimulation}>
                                    <Text style={contentCardStyles.SubmitButtonText}>MULAI SIMULASI</Text>
                                </TouchableOpacity>
                            </>
                        )} */}
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
      </>
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
    },
    formInputText: {
      flexGrow: 1,
    },
    formBtn: {
      width: 42,
      height: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFF200',
      borderRadius: 21
    },
    formBtnIcon: {
      width: 20,
      height: 20,
    },

    simulationRoleCard: {
      paddingVertical: 12,
      paddingLeft: 12,
      paddingRight: 20,
      flexBasis: 280,
      flexGrow: 1,
      borderRadius: 12,
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    simulationRoleCardSelected: {
      paddingVertical: 12,
      paddingLeft: 12,
      paddingRight: 20,
      flexBasis: 280,
      flexGrow: 1,
      borderRadius: 12,
      backgroundColor: '#FFF200',
      // borderColor: '#222F34',
      // borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    simulationRoleCardLabel: {
      fontWeight: '600',
      color: '#222F34'
    },
    simulationRoleCardIcon: {
      width: 25,
      height: 25,
    }

    
})