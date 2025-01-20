import React, { useEffect, useState } from 'react';
import { View, Button, Text, Modal, StyleSheet } from 'react-native';
import { launchCamera, ImagePickerResponse, Asset, CameraOptions } from 'react-native-image-picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/types';

const CameraAuth = () => {
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const suggestions = [
    'Move your face to the left',
    'Move your face to the right',
    'Look straight ahead',
  ];

  useEffect(() => {
    takePhoto();
    console.log('CameraAuth');
  }, []);

  const takePhoto = () => {
    const options: CameraOptions = {
        mediaType: 'photo',
        // cameraType: 'front',
        maxHeight: 200,
        maxWidth: 200,
        saveToPhotos: false,
      };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.assets) {
        if (response.assets && response.assets.length > 0) {
          setPhotos(prevPhotos => [...prevPhotos, response.assets[0]]);
        }
        setCurrentStep(prevStep => prevStep + 1);
        if (currentStep < 2) {
          setModalVisible(true);
        } else {
          navigation.navigate('home');
        }
      }
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    takePhoto();
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{suggestions[currentStep]}</Text>
          <Button title="OK" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,

    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default CameraAuth;
