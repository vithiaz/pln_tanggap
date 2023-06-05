import React, { useEffect, useState } from 'react';
import {
  View,
  Switch,
  Text,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';

import CheckInOutIcon from '../assets/icon/check_in_out.png';
import { TextInput } from 'react-native-gesture-handler';

const CheckinLocationPicker = ({ user, items, onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const formAnimatedHeight = new Animated.Value(0);
  const [nameInput, setNameInput] = useState('');

  const togglePicker = () => {
      setShowPicker(!showPicker);
  };
  
  const toggleForm = async () => {
    setShowForm(!showForm);
  }

  useEffect(() => {
    if (showForm) {
       Animated.timing(formAnimatedHeight, {
          toValue: 50,
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

  const handleCheckinPress = () => {
    if (user) {
      togglePicker();
    } else {
      toggleForm();
    }
  }

  return (
    <View style={checkoutInfoStyles.columnWrapper}>
      <View style={checkoutInfoStyles.checkoutWrapper}>
          <TouchableOpacity style={checkoutInfoStyles.checkoutBtn} onPress={() => handleCheckinPress()}>
              <View style={checkoutInfoStyles.btnBg} />
              <Image source={CheckInOutIcon} style={checkoutInfoStyles.checkoutIcon} />
              <Text style={checkoutInfoStyles.checkoutBtnText}>
                  Check-in
              </Text>
          </TouchableOpacity>
            
        {/* Checkin Modal */}
        <Modal visible={showPicker} transparent={true}>
            <TouchableWithoutFeedback onPress={togglePicker}>
                <View style={styles.modalBackground} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
                <FlatList
                data={items}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={() => {
                    onSelect(item, nameInput);
                    togglePicker();
                    }}>
                    <View style={styles.pickerItem}>
                        <Text style={styles.pickerItemText}>{item.label}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
                />
            </View>
        </Modal>
        {/* End Checkin Modal */}

        <View style={checkoutInfoStyles.checkoutInfoMessageWrapper}>
          <Text style={checkoutInfoStyles.checkoutInfoMessage}>
              Silahkan <Text style={{ fontWeight: 600 }}>Check-in</Text>, setelah memasuki area kantor
          </Text>
        </View>
      </View>

      <Animated.View
        // style={checkoutInfoStyles.formWrapper}
        style={{ 
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f4f7ff',
          paddingHorizontal: 10,
          borderRadius: 18,
          overflow: 'hidden',
          height: formAnimatedHeight
          // height: 20
         }}
        >
          {/* <TextInput onLayout={handleFormToggleLayout} style={checkoutInfoStyles.formInputText} placeholder='Nama Lengkap...'></TextInput> */}
          <TextInput
            style={checkoutInfoStyles.formInputText}
            placeholder='Nama Lengkap...'
            onChangeText={(text) => setNameInput(text)}
            ></TextInput>
          <TouchableOpacity style={checkoutInfoStyles.formBtn} onPress={togglePicker}>
              {/* <View style={checkoutInfoStyles.btnBg} /> */}
              <Image source={CheckInOutIcon} style={checkoutInfoStyles.formBtnIcon} />
          </TouchableOpacity>
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  appView: {
    // backgroundColor: Colors.white,
    backgroundColor: '#fff',
    height: '100%'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  selectedItem: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedItemIcon: {
    width: 25,
    height: 25,
  },
  selectedItemText: {
    color: 'black',
    flexGrow: 1,
    flexShrink: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pickerItemText: {
    fontSize: 16,
    color: 'black',
  },
})

const checkoutInfoStyles = StyleSheet.create({
    mainWrapper: {
      padding: 20,
      flexDirection: 'column',
      gap: 20,
      width: '100%',
    },
    columnWrapper: {
      flexDirection: 'column',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkoutWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 20,
      flex: 1,
      overflow: 'hidden',
    },
    checkoutBtn: {
      width: 120,
      padding: 8,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    btnBg: {
      position: 'absolute',
      left: 0,
      right: '40%',
      top: 0,
      bottom: 0,
      zIndex: -1,
      backgroundColor: '#FFF200',
      borderRadius: 12,
    },
    checkoutIcon: {
      width: 20,
      height: 20,
    },
    checkoutBtnText: {
      color: '#000',
      fontWeight: '600',
      fontSize: 16,
      letterSpacing: 1,
    },
    checkoutInfoMessageWrapper: {
      padding: 0,
      flexShrink: 1,
    },
    checkoutInfoMessage: {
      textAlign: 'right',
      color: '#000',
      lineHeight: 25,
    },
  
    locationCardWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#FFF200',
      gap: 10,
      borderRadius: 12,
    },
    officeIcon: {
      width: 30,
      height: 30,
    },
    locationInfoWrapper: {
      flexDirection: 'column',
      gap: 2,
      flexGrow: 1,
      flexShrink: 1,
    },
    checkinLocationTitle: {
      fontSize: 14,
      color: 'black',
    },
    checkinLocationDesc: {
      fontSize: 16,
      fontWeight: '600',
      color: 'black',
    },
    checkinTimeDesc: {
      fontSize: 18,
      fontWeight: '600',
      color: 'black',
    },
    checkoutCardMessage: {
      color: 'black',
      fontSize: 14,
      textAlign: 'center',
    },

    formWrapper: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f4f7ff',
      paddingHorizontal: 10,
      borderRadius: 18,
      overflow: 'hidden',
      // maxHeight: '100%',
      // paddingVertical: 5,
      maxHeight: '0%',
      paddingVertical: 0,
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
    }
  
  })
  

export default CheckinLocationPicker;
