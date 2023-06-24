import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { child, onValue, push, ref, set } from 'firebase/database';
import { db } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share'
import RNFetchBlob from 'rn-fetch-blob'

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import backIcon from '../../assets/icon/back.png'
import AparIcon from '../../assets/icon/fire_tools.png';


export default function RegisterApar({ route, navigation }) {
  const officeUID = route.params.officeUID
  // const [isLoading, setIsLoading] = useState(false)

  const attemptKey = push(child(ref(db), 'APAR/' + officeUID)).key;

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
            <Text style={styles.appTitleText}>Register APAR</Text>
            <TouchableOpacity style={styles.pageIconContainer} >
                <Image source={AparIcon} style={styles.pageIcon}/>
            </TouchableOpacity>
          </View>
        </View>
        <PageContentCard
          navigation={navigation}
          officeUID={officeUID}
          attemptKey={attemptKey}
          />
      </SafeAreaView>
    </ScrollView>
  )
}

const PageContentCard = ({ navigation, officeUID, attemptKey }) => {
  const [desc, setDesc] = useState('')
  const [QRImage, setQRImage] = useState('')

  function createSlug(string) {
    const slug = string
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9-]/g, '');
  
    return slug;
  }
  
  const handleQrDownload = () => {
    QRImage.toDataURL(async(data) => {
      const shareImageBase64 = {
          title: "QR Registrasi Apar",
          message: "Apar ID " + attemptKey,
          url: `data:image/jpeg;base64,${data}`
      };
      setQRImage(String(shareImageBase64.url))

      if (Platform.OS === 'ios') {
          saveImage(String(shareImageBase64.url));
      } else {
          try {
              saveImage(String(shareImageBase64.url));
          } catch (err) {
              console.log(err)
              // setIsLoading(false)
          }
      }
  });
  }
  const handleQrShare = () => {
    QRImage.toDataURL((data) => {
      const shareImageBase64 = {
          title: "QR Registrasi APAR",
          message: "Apar ID " + attemptKey,
          url: `data:image/jpeg;base64,${data}`
      };
      setQRImage(String(shareImageBase64.url));
      Share.open(shareImageBase64);
    })
  }

  const saveImage = (qr) => {
    // setIsLoading(false)

    qr = qr.split('data:image/jpeg;base64,')[1]
    
    let date = new Date();
    const { fs } = RNFetchBlob;
    let filename = '/QR_APAR_' + attemptKey + '_' + Math.floor(date.getTime() + date.getSeconds() / 2) + '.jpeg';
    let PictureDir = fs.dirs.DownloadDir + filename;

    fs.writeFile(PictureDir, qr, 'base64')
    .then(() => {
        RNFetchBlob.android.addCompleteDownload({
            title: 'APAR QR Code id ' + attemptKey,
            useDownloadManager: true,
            showNotification: true,
            notification: true,
            path: PictureDir,
            mime: 'image/jpeg',
            description: 'Image',
        });
    })
    .catch((err) => {console.log('ERR: ', err)})
  }

  const handleRegisterApar = () => {
    try {
      set(ref(db, 'apar/' + officeUID + '/' + attemptKey), {
        id: attemptKey,
        description: desc,
        status: 'Baik',
      })
      navigation.pop()
      
    } catch (e) {
      console.log(e)
    }
  }
    
  return (
      <View style={contentCardStyles.contentCard}>
          <View style={styles.containerFillHeight}>
              <View style={contentCardStyles.cardBody}>
                <View style={contentCardStyles.formInput}>
                  <Text style={contentCardStyles.formInputLabel}>Deskripsi</Text>
                  <TextInput
                    style={contentCardStyles.formInputDesc}
                    multiline
                    numberOfLines={4}
                    placeholder='Deskripsi APAR, lokasi penempatan, dsb.'
                    onChangeText={(text) => setDesc(text)}></TextInput>
                </View>
                <View style={contentCardStyles.QrRowWrapper}>
                  <View style={{
                    flexBasis: 120,
                    flexGrow: 1,
                    flexDirection: 'column',
                    gap: 5,
                   }}>
                    <Text style={contentCardStyles.formInputLabel}>APAR QR</Text>
                    <Text >Download atau bagikan QR ini sebelum melakukan registrasi APAR</Text>
                  </View>
                  <QRCode
                    value={attemptKey}
                    getRef={(ref) => setQRImage(ref)}
                  />
                </View>
                <View style={contentCardStyles.qrContainerButtonWrapper}>
                  <TouchableOpacity style={[contentCardStyles.AbortButton, {width: '70%'}]} onPress={handleQrDownload}>
                      <Text style={contentCardStyles.AbortButtonText}>Download QR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[contentCardStyles.AbortButton, {width: '25%'}]} onPress={handleQrShare}>
                      <Text style={contentCardStyles.AbortButtonText}>Bagikan</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={contentCardStyles.SubmitButton} onPress={handleRegisterApar}>
                  <Text style={contentCardStyles.SubmitButtonText}>Registrasi APAR</Text>
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
      position: 'relative'
    },
    pageIcon: {
      width: '80%',
      height: '80%',
    },
    pageIconContainerDesc: {
        position: 'absolute',
        bottom: -25,
        width: 70,
        textAlign: 'center',
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
    bodyTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
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
    },

    AparCardWrapper: {
        width: '100%',
        flexDirection: 'column',
        gap: 10,
    },
    AparCard: {
        borderRadius: 12,
        padding: 10,
        gap: 10,
        backgroundColor: 'white',
    },
    AparCardRow: {
        flexDirection: 'row',
        columnGap: 10,
        rowGap: 3,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    AparCardRowTitle: {
        fontWeight: '600',
        flexBasis: 90,
        color: 'black',
    },
    AparCardRowDesc: {
        flexGrow: 1,
        color: 'black',
    },

    formInputDesc: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      borderRadius: 12,
      padding: 10,
      backgroundColor: 'white',
    },

    QrRowWrapper: {
      width: '100%',
      flexDirection: 'row',
      columnGap: 10,
      rowGap: 3,
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    qrContainerButtonWrapper: {
      width: '100%',
      flexBasis: '100%',
      flexDirection: 'row',
      gap: 10,
      paddingVertical: 10,
    },


  
  
  })