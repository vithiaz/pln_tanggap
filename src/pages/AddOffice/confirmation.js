import React, { useEffect, useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { child, onValue, push, ref, set } from 'firebase/database';
import { auth, db, firebaseConfig } from '../../config/firebase';

import QRCode from 'react-native-qrcode-svg';

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import backIcon from '../../assets/icon/back.png'
import OfficeIcon from '../../assets/icon/office.png'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { deleteApp, initializeApp } from 'firebase/app';

export default function AddOfficeConfirmation({ route, navigation }) {
    const addOfficeInfo = route.params;
  
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
                    <Text style={styles.appTitleText}>Tambah Kantor</Text>
                    <TouchableOpacity style={styles.pageIconContainer} >
                        <Image source={OfficeIcon} style={styles.pageIcon}/>
                    </TouchableOpacity>
                </View>
            </View>
            <PageContentCard
                navigation={navigation}
                addOfficeInfo={addOfficeInfo}
                // officeUID={officeUID}
                // deviceToken={deviceToken}
                />
        </SafeAreaView>
    </ScrollView>
  )
}

const PageContentCard = ({ navigation, addOfficeInfo }) => {
    const [qrAttemptKey, setQrAttemptKey] = useState('')
    const [QRImage, setQRImage] = useState('')

    const [isStoreSecure, setIsStoreSecure] = useState(true)
    
    useState(() => {
        setQrAttemptKey(push(child(ref(db), 'offices')).key)
    }, [])

    const storeOffice = () => {
        return new Promise((resolve) => {
            try {
                set(ref(db, 'offices/' + qrAttemptKey), {
                    name: addOfficeInfo.office,
                    safe_point_id: qrAttemptKey,
                    policeNum: addOfficeInfo.policeNum,
                    hospitalNum: addOfficeInfo.hospitalNum,
                    firemanNum: addOfficeInfo.firemanNum,
                })
                resolve();
            }
            catch(e) {
                setIsStoreSecure(false)
                console.log('Error: ', e)
            }

          });
    }
    
    const storeHost = () => {
        if (setIsStoreSecure) {
            const secondaryApp = initializeApp(firebaseConfig, "secondaryApp")
            const secondaryAuth = getAuth(secondaryApp)
    
            createUserWithEmailAndPassword(secondaryAuth, addOfficeInfo.email, addOfficeInfo.password)
                .then((userCredential) => {
                try {
                    set(ref(db, 'users/' + userCredential.user.uid), {
                        email: userCredential.user.email,
                        name: addOfficeInfo.hostName,
                        username: addOfficeInfo.username,
                        office_UID: qrAttemptKey,
                        user_type: 'host'
                    });
                    console.log('Register success with id', userCredential.user.uid);
                }
                catch(e) {
                    console.log('Storing user error: ', e)
                    setIsStoreSecure(false)
                }
            }).finally(() => {
                secondaryAuth.signOut().then( () => deleteApp(secondaryApp)); 
            })
        }
    }

    const navigateBackHome = () => {
        navigation.replace('Home');
          navigation.reset({
            index: 0,
            routes: [{
              name: 'Home',
            }]
          });
    }

    const handleAddOffice = async () => {
        await storeOffice();
        storeHost();

        if (isStoreSecure) {
            Alert.alert(
                'Berhasil',
                "Penambahan kantor berhasil",
                [
                  {text: 'OK', onPress: () => navigateBackHome()},
                ],
                { cancelable: false }
            )
        } else {
            Alert.alert(
                'Gagal',
                "Penambahan kantor gagal",
                [
                  {text: 'OK', onPress: () => navigateBackHome()},
                ],
                { cancelable: false }
            )
        }
    }

    const handleQrShare = () => {
        // 
    }
    
    return (
        <View style={contentCardStyles.contentCard}>
            <View style={styles.containerFillHeight}>
                <View style={contentCardStyles.cardBody}>
                    <Text style={contentCardStyles.cardBodyTitle}>Konfirmasi Penambahan Kantor</Text>
                    <View style={contentCardStyles.cardBodyFormWrapper}>
                        <Text style={contentCardStyles.cardBodyFormWrapperTitle}>Informasi Kantor</Text>
                        <View style={contentCardStyles.rowWrapper}>
                            <Text style={contentCardStyles.rowWrapperHead}>Nama</Text>
                            <Text style={contentCardStyles.rowWrapperTail}>{addOfficeInfo.office}</Text>
                        </View>
                        {addOfficeInfo.policeNum && (
                            <View style={contentCardStyles.rowWrapper}>
                                <Text style={contentCardStyles.rowWrapperHead}>No Polisi Terdekat</Text>
                                <Text style={contentCardStyles.rowWrapperTail}>{addOfficeInfo.policeNum}</Text>
                            </View>
                        )}
                        {addOfficeInfo.hospitalNum && (
                            <View style={contentCardStyles.rowWrapper}>
                                <Text style={contentCardStyles.rowWrapperHead}>No Pusat Kesehatan Terdekat</Text>
                                <Text style={contentCardStyles.rowWrapperTail}>{addOfficeInfo.hospitalNum}</Text>
                            </View>
                        )
                        }
                        {addOfficeInfo.firemanNum && (
                            <View style={contentCardStyles.rowWrapper}>
                                <Text style={contentCardStyles.rowWrapperHead}>No Pemadam Terdekat</Text>
                                <Text style={contentCardStyles.rowWrapperTail}>{addOfficeInfo.firemanNum}</Text>
                            </View>
                        )}
                    </View>
                    <View style={contentCardStyles.cardBodyFormWrapper}>
                        <Text style={contentCardStyles.cardBodyFormWrapperTitle}>Akun Host</Text>
                        <View style={contentCardStyles.rowWrapper}>
                            <Text style={contentCardStyles.rowWrapperHead}>Email</Text>
                            <Text style={contentCardStyles.rowWrapperTail}>{addOfficeInfo.email}</Text>
                        </View>
                        <View style={contentCardStyles.rowWrapper}>
                            <Text style={contentCardStyles.rowWrapperHead}>Username</Text>
                            <Text style={contentCardStyles.rowWrapperTail}>{addOfficeInfo.username}</Text>
                        </View>
                        <View style={contentCardStyles.rowWrapper}>
                            <Text style={contentCardStyles.rowWrapperHead}>Nama</Text>
                            <Text style={contentCardStyles.rowWrapperTail}>{addOfficeInfo.hostName}</Text>
                        </View>
                        <View style={contentCardStyles.rowWrapper}>
                            <Text style={contentCardStyles.rowWrapperHead}>Password</Text>
                            <Text style={contentCardStyles.rowWrapperTail}>{addOfficeInfo.password}</Text>
                        </View>
                        <Text style={{ textAlign: 'right' }}>Simpan informasi ini untuk login sebagai akun host pada Kantor yang dibuat</Text>
                    </View>
                    {qrAttemptKey && (
                        <View style={contentCardStyles.cardBodyFormWrapper}>
                            <Text style={contentCardStyles.cardBodyFormWrapperTitle}>QR Titik Kumpul</Text>
                            <View style={contentCardStyles.qrContainer}>
                                <QRCode
                                    value={qrAttemptKey}
                                    getRef={(ref) => setQRImage(ref)}
                                    />
                                <Text style={contentCardStyles.qrDescription}>Download atau bagikan QR ini sebelum menambahkan kantor</Text>
                                <View style={contentCardStyles.qrContainerButtonWrapper}>
                                    <TouchableOpacity style={[contentCardStyles.AbortButton, {width: '70%'}]}>
                                        <Text style={contentCardStyles.AbortButtonText}>Download QR</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[contentCardStyles.AbortButton, {width: '25%'}]} onPress={handleQrShare}>
                                        <Text style={contentCardStyles.AbortButtonText}>Bagikan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    <TouchableOpacity style={contentCardStyles.SubmitButton} onPress={handleAddOffice}>
                        <Text style={contentCardStyles.SubmitButtonText}>Tambahkan Kantor</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
    cardBodyTitle: {
        fontWeight: '600',
        color: 'black',
        fontSize: 16,
        marginBottom: 5
    },
    cardBodyFormWrapper: {
        width: '100%',
        flexDirection: 'column',
        gap: 10,
        paddingVertical: 5
    },
    qrContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        width: '100%',
        flexWrap: 'wrap',
    },
    qrDescription: {
        textAlign: 'right',
        flexShrink: 1,
        flexBasis: 200,
    },
    qrContainerButtonWrapper: {
        width: '100%',
        flexBasis: '100%',
        flexDirection: 'row',
        gap: 10,
    },
    cardBodyFormWrapperTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    rowWrapper: {
        flexDirection: 'row',
        columnGap: 20,
        rowGap: 5,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    rowWrapperHead: {
        fontWeight: '600',
        color: 'black',
        // flexBasis: '50%',
    },
    rowWrapperTail: {
        color: 'black',
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
      backgroundColor: 'white',
      borderRadius: 12,
      paddingHorizontal: 10,
    },
    datetimeForm: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 15,
      marginBottom: 20,
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