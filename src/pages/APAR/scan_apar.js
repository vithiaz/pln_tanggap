'use strict';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  LogBox,
  Vibration
} from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { child, onValue, push, ref, set, update } from 'firebase/database';
import { db } from '../../config/firebase';

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import backIcon from '../../assets/icon/back.png'
import AparIcon from '../../assets/icon/fire_tools.png';
import GoodIcon from '../../assets/icon/good.png';
import RepairIcon from '../../assets/icon/repair.png';
import QRCodeScanner from 'react-native-qrcode-scanner';


export default function ScanApar({ route, navigation }) {
    const officeUID = route.params.officeUID
    const aparData = route.params.aparData
    const [aparIds, setAparIds] = useState([])

    // Set Apar Ids
    useEffect(() => {
        setAparIds([])
        Object.entries(aparData).map((data) => {
            setAparIds(prevAparIds => [...prevAparIds, data[0]])
        })
    }, [])

    useEffect(() => {
        console.log('\n\nTracking data: ', aparData)
        console.log('\n\nTracking aparIDs: ', aparIds)
    }, [aparIds])


    
    return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: 'white', width: '100%', flexDirection: 'column' }}>
        <SafeAreaView style={{ height: '100%', }}>
            <View style={styles.container}>
            <View style={styles.topNavigationWrapper}>
                <TouchableOpacity style={styles.button} onPress={() => {navigation.pop()}}>
                <Image source={backIcon} style={styles.buttonIcon} />
                </TouchableOpacity>
                <Text style={styles.appTitleText}>Scan QR APAR</Text>
            </View>
            </View>
            <PageContentCard
            navigation={navigation}
            officeUID={officeUID}
            aparIds={aparIds}
            aparData={aparData}
            />
        </SafeAreaView>
    </ScrollView>
    )
}

const PageContentCard = ({ navigation, officeUID, aparIds, aparData }) => {
    const scanner = useRef(null)
    const [scanState, setScanState] = useState(true)

    const [aparId, setAparId] = useState('')
    const [aparDesc, setAparDesc] = useState('')
    const [Condition, setCondition] = useState('')
    
    const handleScan = (e) => {
        console.log('Scanned data: ', e.data);

        if (aparIds.includes(e.data)) {
            setAparId(aparData[e.data].id)
            setAparDesc(aparData[e.data].description)
            setCondition(aparData[e.data].status)
            setScanState(false)
        }
    }
    
    const handleSelectedConditions = (cond) => {
        try {
            const userUpdateRef = ref(db, 'apar/' + officeUID + '/' + aparId);
            update(userUpdateRef, {
                status: cond,
            })
            setCondition(cond)
        }
        catch (e) {
            Alert.alert(
                'Terjadi Kesalahan',
                'Update Kondisi Apar Gagal',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
            )
        }        
    }

    return (
        <View style={contentCardStyles.contentCard}>
            <View style={styles.containerFillHeight}>
                <View style={contentCardStyles.cardBody}>
                    {scanState ? (
                        <QRCodeScanner
                            onRead={handleScan}
                            ref={scanner}
                            showMarker={true}
                            reactivate={true}
                            permissionDialogTitle={'Permission to use camera'}
                            permissionDialogMessage={'We need your permission to use your camera phone'}
                            markerStyle={styles.marker}
                            cameraStyle={styles.camera}
                        />
                    ) : (
                        <View style={contentCardStyles.cardBodyContent}>
                            <Text style={contentCardStyles.cardBodyContentTitle}>Data APAR</Text>
                            <View style={contentCardStyles.cardBodyRow}>
                                <Text style={contentCardStyles.cardBodyRowTitle}>APAR ID</Text>
                                <Text style={contentCardStyles.cardBodyRowDesc}>{aparId}</Text>
                            </View>
                            <View style={contentCardStyles.cardBodyRow}>
                                <Text style={contentCardStyles.cardBodyRowTitle}>Deskripsi</Text>
                                <Text style={contentCardStyles.cardBodyRowDesc}>{aparDesc}</Text>
                            </View>

                            <Text style={[contentCardStyles.cardBodyContentTitle, {marginTop: 20}]}>Update Kondisi</Text>
                            <TouchableOpacity
                                // key={key}
                                style={(Condition == 'Baik') ? contentCardStyles.optionSelectCardSelected : contentCardStyles.optionSelectCard}
                                onPress={() => handleSelectedConditions('Baik')}
                            >
                                <Image source={GoodIcon} style={contentCardStyles.optionSelectRoleCardIcon}/>
                                <Text style={contentCardStyles.optionSelectRoleCardLabel}>Baik</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                // key={key}
                                style={(Condition == 'Rusak') ? contentCardStyles.optionSelectCardSelected : contentCardStyles.optionSelectCard}
                                onPress={() => handleSelectedConditions('Rusak')}
                            >
                                <Image source={GoodIcon} style={[contentCardStyles.optionSelectRoleCardIcon, {transform: [{ rotate: '180deg'}]}]}/>
                                <Text style={contentCardStyles.optionSelectRoleCardLabel}>Rusak</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                // key={key}
                                style={(Condition == 'Perbaikan') ? contentCardStyles.optionSelectCardSelected : contentCardStyles.optionSelectCard}
                                onPress={() => handleSelectedConditions('Perbaikan')}
                            >
                                <Image source={RepairIcon} style={contentCardStyles.optionSelectRoleCardIcon}/>
                                <Text style={contentCardStyles.optionSelectRoleCardLabel}>Perbaikan</Text>
                            </TouchableOpacity>

                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    marker: {
        borderColor: '#fff',
        borderRadius: 10,
      },
      camera: {
        height: '100%',
        width: '100%',
      },

    topNavigationWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
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

    cardBodyContent: {
      width: '100%',
      flexDirection: 'column',
      gap: 10,
    },
    cardBodyContentTitle: {
      fontWeight: '600',
      color: 'black',
      fontSize: 16,
      marginBottom: 10,
    },
    cardBodyRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: 10,
      rowGap: 5,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardBodyRowTitle: {
      flexBasis: 100,
      flexGrow: 1,
      fontWeight: '600',
      color: 'black',
      flexGrow: 1,
    },
    cardBodyRowDesc: {
    //   textAlign: 'right',
      color: 'black',
    },

    optionSelectCard: {
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
    optionSelectCardSelected: {
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
    optionSelectRoleCardLabel: {
        fontWeight: '600',
        color: '#222F34'
    },
    optionSelectRoleCardIcon: {
        width: 25,
        height: 25,
    }


  
  
  })