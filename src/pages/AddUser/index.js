import React, { useEffect, useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { child, onValue, push, ref, set } from 'firebase/database';
import { auth, db, firebaseConfig } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteApp, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import backIcon from '../../assets/icon/back.png'
import UsersIcon from '../../assets/icon/users.png'


export default function AddUser({ route, navigation }) {
    const [officeUID, setOfficeUID] = useState('')
    const [deviceToken, setDeviceToken] = useState('')
    
    useEffect(() => {
        setOfficeUID(route.params.office_UID)
        setDeviceToken(route.params.deviceToken)
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
                        <Text style={styles.appTitleText}>Tambah User</Text>
                        <TouchableOpacity style={styles.pageIconContainer} >
                            <Image source={UsersIcon} style={styles.pageIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <PageContentCard
                    navigation={navigation}
                    officeUID={officeUID}
                    deviceToken={deviceToken}
                    />
            </SafeAreaView>

        </ScrollView>
  )
}

const PageContentCard = (props) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState('');
    const [password, setPassword] = useState('');

    const handleNumberChange = (value, setfunc) => {
      const cleanedValue = value.replace(/[^0-9]/g, '');
      setfunc(cleanedValue);
    }

    const storeUser = () => {

        if (email !== '' && username !== '' && password !== '' && name !== '') {
            const secondaryApp = initializeApp(firebaseConfig, "secondaryApp")
            const secondaryAuth = getAuth(secondaryApp)

            createUserWithEmailAndPassword(secondaryAuth, email, password)
                .then((userCredential) => {
                try {
                    set(ref(db, 'users/' + userCredential.user.uid), {
                        email: userCredential.user.email,
                        name: name,
                        username: username,
                        office_UID: props.officeUID,
                        phone: phone,
                        position: position,
                        user_type: 'guest',
                        device_token : props.deviceToken
                    });

                    setEmail('')
                    setUsername('')
                    setName('')
                    setPassword('')

                    Alert.alert(
                        'Registrasi berhasil',
                        "akun berhasil di daftarkan...",
                        [
                          {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: true }
                    )

                    console.log('Register success with id', userCredential.user.uid);
                }
                catch(e) {
                    Alert.alert(
                        'Registrasi gagal',
                        err.message,
                        [
                          {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        { cancelable: true }
                    )
                }
            }).finally(() => {
                secondaryAuth.signOut().then( () => deleteApp(secondaryApp)); 
            })
        }
    }

    return (
        <View style={contentCardStyles.contentCard}>
            <View style={styles.containerFillHeight}>
                <View style={contentCardStyles.cardBody}>
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Email</Text>
                        <TextInput style={contentCardStyles.formInputText} placeholder='email' value={email} onChangeText={(text) => setEmail(text)}></TextInput>
                    </View>
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Username</Text>
                        <TextInput style={contentCardStyles.formInputText} placeholder='username' value={username} onChangeText={(text) => setUsername(text)}></TextInput>
                    </View>
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Nama</Text>
                        <TextInput style={contentCardStyles.formInputText} placeholder='Nama Lengkap' value={name} onChangeText={(text) => setName(text)}></TextInput>
                    </View>
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Telepon</Text>
                        <TextInput style={contentCardStyles.formInputText} placeholder='Telepon / no.HP' value={phone} keyboardType='numeric' onChangeText={(text) => handleNumberChange(text, setPhone)}></TextInput>
                    </View>
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Posisi</Text>
                        <TextInput style={contentCardStyles.formInputText} placeholder='Posisi' value={position} onChangeText={(text) => setPosition(text)}></TextInput>
                    </View>
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Password</Text>
                        <TextInput secureTextEntry={true} style={contentCardStyles.formInputText} placeholder='password' value={password} onChangeText={(text) => setPassword(text)}></TextInput>
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity style={contentCardStyles.SubmitButton} onPress={storeUser}>
                        <Text style={contentCardStyles.SubmitButtonText}>Tambah User</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={contentCardStyles.cardFooter} >
              <View style={contentCardStyles.footerLogoContainer}>
              <Image source={PLN_logo} style={contentCardStyles.footerLogo} />
              <Text style={contentCardStyles.footerLogoText}>PLN</Text>
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