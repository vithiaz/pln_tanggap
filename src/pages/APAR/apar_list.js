import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { child, onValue, push, ref, set } from 'firebase/database';
import { db } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import backIcon from '../../assets/icon/back.png'
import AparIcon from '../../assets/icon/fire_tools.png';
import ScanIcon from '../../assets/icon/scan.png';


export default function AparList({ route, navigation }) {
  const officeUID = route.params.officeUID
  

  const navigateToRegisterApar = () => {
    navigation.navigate('RegisterApar')
  }

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
            <Text style={styles.appTitleText}>Menu APAR</Text>
            <TouchableOpacity style={styles.pageIconContainer} onPress={navigateToRegisterApar}>
                <Image source={AparIcon} style={styles.pageIcon}/>
                <Text style={styles.pageIconContainerDesc}>Tambah</Text>
            </TouchableOpacity>
          </View>
        </View>
        <PageContentCard
          navigation={navigation}
          officeUID={officeUID}
          />
      </SafeAreaView>
    </ScrollView>
  )
}

const PageContentCard = ({ navigation, officeUID }) => {
  const [aparData, setAparData] = useState({})

  // Listen to Apar tables
  useEffect(() => {
    const AparsRef = ref(db, '/apar/', + officeUID + '/')
    const getAparsData = onValue(AparsRef, (snap) => {
      const newData = []
      snap.forEach((snapchild) => {
        const index = snapchild.key;
        const data = snapchild.val();
        newData[index] = data;
        if (index == officeUID) {
          console.log('\nTracking.. :', newData[index])
          setAparData(newData[index])
        }
      })
    })

    return () => getAparsData()
  }, [])

  const navigateToScanPage = () => {
    navigation.navigate('ScanApar', {aparData: aparData})
  }

  const navigateToAparDetails = (selectedAparData) => {
    navigation.navigate('AparDetails', {aparData: selectedAparData})
  }
    
  return (
      <View style={contentCardStyles.contentCard}>
          <View style={styles.containerFillHeight}>
              <View style={contentCardStyles.cardBody}>
                  <Text style={contentCardStyles.bodyTitle}>Daftar APAR</Text>
                  <View style={contentCardStyles.AparCardWrapper}>
                    {Object.entries(aparData).map(([key, values]) => (
                      <TouchableOpacity key={key} style={contentCardStyles.AparCard} onPress={() => navigateToAparDetails(values)}>
                        <View style={contentCardStyles.AparCardRow}>
                            <Text style={contentCardStyles.AparCardRowTitle}>APAR ID</Text>
                            <Text style={contentCardStyles.AparCardRowDesc}>{values.id}</Text>
                        </View>
                        <View style={contentCardStyles.AparCardRow}>
                            <Text style={contentCardStyles.AparCardRowTitle}>Kondisi</Text>
                            <Text style={contentCardStyles.AparCardRowDesc}>{values.status}</Text>
                        </View>
                        <View style={contentCardStyles.AparCardRow}>
                            <Text style={contentCardStyles.AparCardRowTitle}>Deskripsi</Text>
                            <Text style={contentCardStyles.AparCardRowDesc}>{values.description}</Text>
                        </View>
                      </TouchableOpacity>                  
                    ))}
                  </View>
              </View>
          </View>
          <TouchableOpacity style={contentCardStyles.floatingButton} onPress={navigateToScanPage}>
           <Image source={ScanIcon} style={contentCardStyles.floatingButtonIcon}/>
          </TouchableOpacity>
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

    floatingButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#FFF200',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 4,
      borderColor: 'rgba(0,0,0,0.1)',
      borderWidth: 1,
    },
    floatingButtonIcon: {
      height: 28,
      width: 28,
    },


  
  
  })