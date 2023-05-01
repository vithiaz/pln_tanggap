import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TouchableWithoutFeedback, TouchableHighlight, ScrollView } from 'react-native';

import TimeIcon from '../assets/icon/clock.png';

const TimeInputPicker = ({ onTimeChange }) => {
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleHourChange = (value) => {
    const hourValue = parseInt(value, 10);
    if (hourValue < 0) {
      setHour('00');
    } else if (hourValue > 23) {
      setHour('23');
    } else if (isNaN(hourValue)) {
      setHour(null)
    } else if (value.length === 1) {
      setHour(`0${value}`);
    } else {
      setHour(value);
    }
  };

  const handleMinuteChange = (value) => {
    const minuteValue = parseInt(value, 10);
    if (minuteValue < 0) {
      setMinute('00');
    } else if (minuteValue > 59) {
      setMinute('59');
    } else if (isNaN(minuteValue)) {
      setMinute(null);
    } else if (value.length === 1) {
      setMinute(`0${value}`);
    } else {
      setMinute(value);
    }
  };

  const handlePickerConfirm = () => {
    setShowPicker(false);
    onTimeChange(`${hour}:${minute}`);
  };

  const handlePickerCancel = () => {
    setShowPicker(false);
    setHour(null);
    setMinute(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.containerCard} onPress={() => setShowPicker(true)}>
        <Image source={TimeIcon} style={{ width: 25, height: 25 }} />
        <Text style={styles.inputText}>{hour || '--'}:{minute || '--'}</Text>
      </TouchableOpacity>
        <Modal
          visible={showPicker}
          transparent={true}
          animationType={'fade'}
          >
          <TouchableOpacity style={styles.modalBackdrop} onPress={handlePickerConfirm} ></TouchableOpacity>
          <View style={styles.modalScrollViewWrapper}>
            <ScrollView contentContainerStyle={styles.modalBodyContainer}  style={styles.modalBody}>
            {[...Array(24)].map((_, i) => (
              <TouchableOpacity style={styles.modalScrollItem} key={`hour-${i}`} onPress={() => handleHourChange(i)}>
                <Text style={[styles.pickerOption, hour == `${i}` && styles.pickerOptionSelected]}>{`${i}`.padStart(2, '0')}</Text>
              </TouchableOpacity>
            ))}
            </ScrollView>
            <ScrollView contentContainerStyle={styles.modalBodyContainer}  style={styles.modalBody}>
            {[...Array(60)].map((_, i) => (
              <TouchableOpacity key={`minute-${i}`} onPress={() => handleMinuteChange(i)}>
                <Text style={[styles.pickerOption, minute == `${i}` && styles.pickerOptionSelected]}>{`${i}`.padStart(2, '0')}</Text>
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    },
    containerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 12,
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    label: {
      marginRight: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
    input: {
      paddingHorizontal: 10,
      flexDirection: 'row',
      gap: 10,
    },
    inputText: {
      color: 'black',
      flexGrow: 1,
    },
    pickerContainer: {
      backgroundColor: '#fff',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    modalBackdrop: {
      position:'absolute',
      zIndex :99,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      flexDirection: 'column',
    },
    modalScrollViewWrapper: {
      position: 'relative',
      zIndex: 100,
      width: '100%',
      top: '20%',
      height: 200,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    modalBody: {
      width: '100%',
    },
    modalBodyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    // modalScrollItem: {
    //   backgroundColor: 'rgba(0,0,0,0)',
    // },
    pickerOption: {
      fontSize: 24,
      padding: 10,
      textAlign: 'center',
      color: 'white',
      width: '100%',
    },
    pickerOptionSelected: {
      color: '#00AEEF',
      fontWeight: 'bold',
    },
  });
  

export default TimeInputPicker;