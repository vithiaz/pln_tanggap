import React, { useEffect, useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { child, off, onValue, push, ref, set } from 'firebase/database';
import { auth, db, firebaseConfig } from '../../config/firebase';
import QRCode from 'react-native-qrcode-svg';

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import backIcon from '../../assets/icon/back.png'
import OfficeIcon from '../../assets/icon/office.png'

export default function AddOfficeForm({ navigation }) {

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
                    // officeUID={officeUID}
                    // deviceToken={deviceToken}
                    />
            </SafeAreaView>
        </ScrollView>
    )
}

const PageContentCard = ({ navigation }) => {
    const [office, setOffice] = useState('');
    const [pin, setPin] = useState('')
    const [policeNum, setPoliceNum] = useState('');
    const [hospitalNum, setHospitalNum] = useState('');
    const [firemanNum, setFiremanNum] = useState('');

    // host acc
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('hostUsername');
    const [name, setName] = useState('host Username');
    const [password, setPassword] = useState('');

    function capitalizeString(str) {
      const words = str.split(' ');
      const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
      return capitalizedWords.join(' ');
    }
    
    function convertToCamelCase(str) {
      const words = str.split(' ');
      const camelCasedWords = words.map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
      return camelCasedWords.join('');
    }
    
    const handleNumberChange = (value, setfunc) => {
      const cleanedValue = value.replace(/[^0-9]/g, '');
      setfunc(cleanedValue);
    }
  

    const confirmForm = () => {
        if (email !== '' && pin !== '' && office !== '' && password !== '') {
          data = {
            office: capitalizeString(office),
            pin: pin,
            policeNum: policeNum,
            hospitalNum: hospitalNum,
            firemanNum: firemanNum,
            email: email,
            username: convertToCamelCase(office) + 'Host',
            hostName: office + ' Host',
            password: password,
          }
          navigation.navigate('addConfirmation', data)
        } else {
          Alert.alert(
            'Peringatan',
            'Nama kantor, dan akun host harus diisi',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: true }
          )
        }
    }

    return (
        <View style={contentCardStyles.contentCard}>
            <View style={styles.containerFillHeight}>
                <View style={contentCardStyles.cardBody}>
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Kantor</Text>
                        <TextInput style={contentCardStyles.formInputText} placeholder='Nama Kantor' value={office} onChangeText={(text) => setOffice(text)}></TextInput>
                    </View>
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>PIN Alarm</Text>
                        <TextInput style={contentCardStyles.formInputText} placeholder='Pin Alarm' value={pin} keyboardType="numeric" onChangeText={(text) => handleNumberChange(text, setPin)}></TextInput>
                    </View>
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Kontak Darurat</Text>
                        <TextInput style={contentCardStyles.formInputText} placeholder='Telepon Kantor Polisi Terdekat' value={policeNum} keyboardType="numeric" onChangeText={(text) => handleNumberChange(text, setPoliceNum)}></TextInput>
                        <TextInput style={contentCardStyles.formInputText} placeholder='Telepon Pusat Kesehatan Terdekat' value={hospitalNum} keyboardType="numeric" onChangeText={(text) => handleNumberChange(text, setHospitalNum)}></TextInput>
                        <TextInput style={contentCardStyles.formInputText} placeholder='Telepon Pemadam Terdekat' value={firemanNum} keyboardType="numeric" onChangeText={(text) => handleNumberChange(text, setFiremanNum)}></TextInput>
                    </View>
                    <View style={contentCardStyles.formInput}>
                        <Text style={contentCardStyles.formInputLabel}>Akun Host</Text>
                        <TextInput style={contentCardStyles.formInputText} placeholder='email' value={email} onChangeText={(text) => setEmail(text)}></TextInput>
                        <TextInput secureTextEntry={true} style={contentCardStyles.formInputText} placeholder='password' value={password} onChangeText={(text) => setPassword(text)}></TextInput>
                    </View>
                    <TouchableOpacity style={contentCardStyles.SubmitButton} onPress={confirmForm}>
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