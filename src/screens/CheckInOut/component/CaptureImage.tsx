import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Platform} from 'react-native';
import {Camera, TakePhotoOptions, useCameraDevice} from 'react-native-vision-camera';
// import {isIos, isAndroid} from '../../helper/utility';
import {PERMISSIONS, request} from 'react-native-permissions';

const CaptureImage = ({
  onPhotoCapture,
}: {
  onPhotoCapture: (photoUri: string) => void;
}) => {
  const device = useCameraDevice('front');

  const cameraRef = useRef<Camera>(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    // Check and request camera permissions when component mounts
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await request(PERMISSIONS.ANDROID.CAMERA);
        if (granted === 'granted') {
          console.log('Camera permission granted');
          setIsCameraReady(true); // Update state to indicate camera is ready
        } else {
          console.log('Camera permission denied');
          // Handle permission denial (e.g., show a message or disable camera features)
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      try {
        const status = await request(PERMISSIONS.IOS.CAMERA);
        if (status === 'granted') {
          console.log('Camera permission granted');
          setIsCameraReady(true); // Update state to indicate camera is ready
        } else {
          console.log('Camera permission denied');
          // Handle permission denial (e.g., show a message or disable camera features)
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const takePhoto = async () => {


    if (cameraRef.current) {
      
      try {

        const photo = await cameraRef.current.takePhoto();
        console.log('Photo captured:', photo);
        setCapturedPhoto(photo.path);
        onPhotoCapture( 'file://' + photo.path); // Pass captured photo data to parent component
      } catch (err) {
        console.warn('Failed to take photo', err);
        // Handle error (e.g., show an error message)
      }
    }
  };

  if (device == null || !isCameraReady) return null;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        ref={cameraRef}
        device={device}
        isActive={true}
        photo={true}
      />
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default CaptureImage;