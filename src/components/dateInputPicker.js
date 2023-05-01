import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

import CalendarIcon from '../assets/icon/calendar.png';



const dateInputPicker = ({ selectedDate, onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };
  
  const minDate = new Date(); // Today

  function dateChanged(date) {
    onSelect(date.format('YYYY-MM-DD'));
    togglePicker()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePicker} style={styles.contentCard}>
        <Image source={CalendarIcon} style={styles.formIcon}/>
        {selectedDate ? (
            <Text style={styles.formText}>{selectedDate}</Text>
          ) : (
            <Text style={styles.formText}>Pilih Tanggal</Text>
        )}
      </TouchableOpacity>
      <Modal
        visible={showPicker}
        transparent={true}
        animationType={'fade'}
        >
        <TouchableWithoutFeedback onPress={togglePicker}>
          <View style={styles.modalBackground} />
        </TouchableWithoutFeedback>
        <View style={styles.modalBodyContainer}>
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={false}
            minDate={minDate}
            todayBackgroundColor="#222F34"
            selectedDayColor="#00AEEF"
            selectedDayTextColor="#FFFFFF"
            onDateChange={dateChanged}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  contentCard: {
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

  formIcon: {
    height: 25,
    width: 25,
  },
  formText: {
    color: 'black',
    flexGrow: 1,
    flexShrink: 1,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalBodyContainer: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
});

export default dateInputPicker;