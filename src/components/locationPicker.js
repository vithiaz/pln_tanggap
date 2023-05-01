import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';

import OfficeIcon from '../assets/icon/office.png';
import DropdownIcon from '../assets/icon/dropdown.png';


const LocationPicker = ({ items, selectedItem, onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={togglePicker}>
         <View style={styles.selectedItem}>
           <Image source={OfficeIcon} style={styles.selectedItemIcon} />
           <Text style={styles.selectedItemText}>{selectedItem.label}</Text>
           <Image source={DropdownIcon} style={styles.selectedItemIcon} />
         </View>
       </TouchableWithoutFeedback>
      <Modal visible={showPicker} transparent={true}>
        <TouchableWithoutFeedback onPress={togglePicker}>
          <View style={styles.modalBackground} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => {
                onSelect(item);
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
});

export default LocationPicker;
