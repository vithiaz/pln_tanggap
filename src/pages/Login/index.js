import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebase.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import backIcon from '../../assets/icon/back.png'
import { child, push, ref, set, update } from 'firebase/database';
import Loader from '../../components/loader.js';

const PageContentCard = (props) => {
  const [deviceToken, setDeviceToken] = useState('');
  const getDeviceToken = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('@device_token'));
      setDeviceToken(value)
    } catch(e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getDeviceToken()
  })

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateDeviceToken = () => {
    // const newPostKey = push(child(ref(db), 'users/' + auth.currentUser.uid)).key;
    const updates = {};
    updates['/users/' + auth.currentUser.uid + '/device_token'] = deviceToken;
    update(ref(db), updates)
  }
  
  const onHandleLogin = async () => {
    if (email !== "" && password !== "")
    {
      setIsLoading(true)
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setIsLoading(false)
          console.log("Login Success");
          updateDeviceToken();
          props.redirect();
          // navigation.goBack()
        })
        .catch((err) => {
          setIsLoading(false)
          Alert.alert(
            'Login gagal',
            err.message,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: true }
          )
        })
    }

  }

  return (
    <>
      {isLoading ? (<Loader/>) : null}
      <View style={contentCardStyles.contentCard}>
        <View style={styles.containerFillHeight}>
          {/* Card Body */}
          <View style={contentCardStyles.cardBody} >
            <Text style={{ fontWeight: 700, fontSize: 22, color: 'black', letterSpacing: 2, marginBottom: 10, }}>Login</Text>
            <View style={contentCardStyles.formInput}>
              <Text style={contentCardStyles.formInputLabel}>Email</Text>
              <TextInput
                style={contentCardStyles.formInputText}
                placeholder='user email'
                onChangeText={(text) => setEmail(text)}
              ></TextInput>
            </View>
            <View style={contentCardStyles.formInput}>
              <Text style={contentCardStyles.formInputLabel}>Password</Text>
              <TextInput
                secureTextEntry={true}
                style={contentCardStyles.formInputText}
                placeholder='password'
                onChangeText={(text) => setPassword(text)}
              ></TextInput>
            </View>
            <TouchableOpacity style={contentCardStyles.LoginButton} onPress={() => onHandleLogin()}>
              <Text style={contentCardStyles.LoginButtonText}>LOGIN</Text>
            </TouchableOpacity>
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
    </>
  )
}



export default Login = ({ navigation }) => {
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: '#00AEEF', width: '100%', flexDirection: 'column' }}>
      <SafeAreaView style={{ height: '100%', }}>
        <View style={styles.container}>
          <View style={styles.topNavigationWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {navigation.goBack()}}>
              <Image source={backIcon} style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.logoWrapper}>
            <Text style={styles.appLogoText}>PLN Tanggap</Text>
          </View>
        </View>
        <PageContentCard redirect={() => navigation.navigate('Home')}/>
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
    position: 'relative'
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
  formIcon: {
    position: 'absolute',
    bottom: '20',
    left: 20,
    width: 20,
    height: 20
  },

  LoginButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#FFF200',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  LoginButtonText: {
    color: 'black',
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