import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import LocationPicker from '../../components/locationPicker';
import DateInputPicker from '../../components/dateInputPicker';
import TimeInputPicker from '../../components/timeInputPicker';

import PLN_logo from '../../assets/image/Logo_PLN_single.png';
import backIcon from '../../assets/icon/back.png'
import bellRingingIcon from '../../assets/icon/bell_ringing.png';
import { child, onValue, push, ref, set } from 'firebase/database';
import { db } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PageContentCard = ({ navigation }) => {
  // Get device token
  const [deviceToken, setDeviceToken] = useState('');
  const getDeviceToken = async () => {
    try {
      const value = await AsyncStorage.getItem('@device_token')
      setDeviceToken(value)
    } catch(e) {
      console.log(e);
    }
  }
  
  const [selectedItem, setSelectedItem] = useState(false);
  const [date, setDate] = useState(null);
  const [inputDate, setInputDate] = useState(false);
  const [inputTime, setInputTime] = useState(false);
  const [inputName, setInputName] = useState('');

  const [office, setOffice] = useState([]);
  // const [itemPicker, setItemPicker] = useState({});

  useEffect( () => {     
    onValue(ref(db, '/offices/'), (snap) => {
      setOffice([])
      const data = snap.val();
      if (data !== null) {
        Object.values(data).map(() => {
          setOffice(data)
        })
      }
    })
  }, [])
    
  const handleSelect = (itemPicker) => {
      setSelectedItem(itemPicker);
  };
  
  const handleDateChange = (date) => {
      setInputDate(date);

    }
    const handleTimeChange = (time) => {
      // console.log(time);
      setInputTime(time);
  };

  const handleSimulationName = (text) => {
    setInputName(text);
  }
  
  const officeSelect = Object.entries(office).map(([key, value]) => ({ key: key, label: value.name }));
  
  function format_datetime(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year.toString()} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const storeSimulation = () => {
    console.log('starting to validate')
    const save_name = inputName;
    const save_location = selectedItem.key;
    const save_location_name = selectedItem.label;

    // Handle Time
    const [hours, minutes] = inputTime.split(':');
    const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    const saved_date = inputDate;
    const dateTimeStr = `${saved_date}T${formattedTime}:00.000Z`;
    const save_datetime = new Date(Date.parse(dateTimeStr));
    const simulation_status = 'pending';

    try {
      const attemptKey = push(child(ref(db), 'simulations')).key;
      set(ref(db, 'simulations/' + attemptKey), {
        name: save_name,
        date_start: format_datetime(save_datetime),
        location: save_location,
        location_name: save_location_name,
        status: simulation_status,
      });
      console.log('storing completed');
      navigation.navigate('Home');
    } catch(e) {
      console.log('Error while storing the data: ', e);
    }
  }

    return (
    <View style={contentCardStyles.contentCard}>
        <View style={styles.containerFillHeight}>
        {/* Card Body */}
        <View style={contentCardStyles.cardBody} >
            <View style={contentCardStyles.formInput}>
                <Text style={contentCardStyles.formInputLabel}>Nama Simulasi</Text>
                <TextInput style={contentCardStyles.formInputText} placeholder='simulasi' onChangeText={handleSimulationName}></TextInput>
            </View>

            <Text style={contentCardStyles.formInputLabel}>Lokasi</Text>
            <LocationPicker items={officeSelect} selectedItem={selectedItem} onSelect={handleSelect} />

            <Text style={contentCardStyles.formInputLabel}>Tanggal dan Waktu</Text>
            {/* Input Date Picker */}
            <View style={contentCardStyles.datetimeForm}>
                <DateInputPicker selectedDate={inputDate} onSelect={handleDateChange} />
                <TimeInputPicker onTimeChange={handleTimeChange}  />
            </View>
            
            {/* Buttons */}
            <TouchableOpacity style={contentCardStyles.SubmitButton} onPress={storeSimulation}>
                <Text style={contentCardStyles.SubmitButtonText}>ATUR SIMULASI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={contentCardStyles.AbortButton}>
                <Text style={contentCardStyles.AbortButtonText}>BATALKAN</Text>
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
  )
}

export default CreateSimulation = ({ navigation }) => {
  // console.log(navigation);
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: 'white', width: '100%', flexDirection: 'column' }}>
      <SafeAreaView style={{ height: '100%', }}>
        <View style={styles.container}>
          <View style={styles.topNavigationWrapper}>
            <TouchableOpacity style={styles.button} onPress={() => {navigation.goBack()}}>
              <Image source={backIcon} style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.pageTitleWrapper}>
            <Text style={styles.appTitleText}>Buat Simulasi Darurat</Text>
            <TouchableOpacity style={styles.pageIconContainer} >
                <Image source={bellRingingIcon} style={styles.pageIcon}/>
            </TouchableOpacity>
          </View>
        </View>
        <PageContentCard navigation={navigation}/>
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