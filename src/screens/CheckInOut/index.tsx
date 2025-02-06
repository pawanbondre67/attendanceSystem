import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';

import {ActivityIndicator, Button} from 'react-native-paper';
import useCheckInOut from './useCheckInOut';
import {Camera, PhotoFile, useCameraDevice} from 'react-native-vision-camera';
// import {isIos, isAndroid} from '../../helper/utility';
import {PERMISSIONS, request} from 'react-native-permissions';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {isIos} from '../../helper/utility';
import useLocation from '../../helper/location';

type Props = {};
const CheckInOut = (props: Props) => {
  const isHomeScreen = false;
  const {
    getOneTimeLocation,
    currentLatitude,
    currentLongitude,
    isFetchingLocation,
  } = useLocation({isHomeScreen});
  const {
    onSubmit,
    markAttendanceResult,

    onPhotoCapture,
  } = useCheckInOut({currentLatitude, currentLongitude});
  const device = useCameraDevice('front');

  const cameraRef = useRef<Camera>(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
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
        // setCapturedPhoto(photo.path);
        const rotatedImage = await handleRotation(photo);
        setCapturedImage(rotatedImage?.uri);
        onPhotoCapture(isIos ? photo.path : rotatedImage?.path); // Pass captured photo data to parent component
        setShowCamera(false);
      } catch (err) {
        console.warn('Failed to take photo', err);
        // Handle error (e.g., show an error message)
      }
    }
  };
  if (device == null || !isCameraReady) {
    return (
      <View style={styles.container}>
        <Text>Camera not available</Text>
      </View>
    );
  }

  const handleRotation = async (image: PhotoFile) => {
    try {
      const output = await ImageResizer.createResizedImage(
        'file://' + image.path,
        350,
        350,
        'JPEG',
        100,
        image.orientation === 'landscape-left'
          ? 90
          : image.orientation === 'landscape-right'
          ? -90
          : image.orientation === 'portrait-upside-down'
          ? 180
          : 0,
        undefined,
        false,
      );
      return output;
    } catch (err) {
      console.warn('Failed to rotate image', err);
      Alert.alert('Error', 'Failed to rotate image. Please try again.');
    }
  };

  const handleImageClick = () => {
    Alert.alert(
      'Take Photo',
      'Would you like to take a new photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Take Photo',
          onPress: () => {
            setShowCamera(true);
            setCapturedImage(null);
          },
        },
      ],
      {cancelable: true},
    );
  };

  console.log('currentLatitude in checkout page', currentLatitude);

  return (
    // checkInOutData.showCamera ? (
    //   <CaptureImage onPhotoCapture={onPhotoCapture} />
    // ) : (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imagebody} onPress={handleImageClick}>
          {capturedImage ? (
            // <Image source={{uri: capturedImage}} style={styles.image} />
            <Image
              source={{uri: capturedImage}}
              style={styles.faceOutline}
              resizeMethod="auto"
            />
          ) : showCamera ? (
          <>  <Image
          source={require('../../assets/face-outline.png')}
          style={styles.faceOutline}
          resizeMethod="auto"
        />
        <Camera
          style={StyleSheet.absoluteFill}
          ref={cameraRef}
          device={device}
          preview={true}
          isActive={true}
          // isMirrored={true}
          outputOrientation="device"
          photo={true}
        /></>
          ) : (
            <Text style={styles.placeholderText}>Take a photo</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.note}>Make sure to upload a clear face selfie</Text>

        {isFetchingLocation ? (
          <View>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : (
          <View>
            <Text>Latitude: {currentLatitude}</Text>
            <Text>Longitude: {currentLongitude}</Text>

            <Button onPress={getOneTimeLocation}>Refresh Location</Button>
          </View>
        )}
      </View>

      <View style={styles.button}>
        {showCamera ? (
          <Button mode="contained" onPress={takePhoto} style={styles.button}>
            Take A Photo
          </Button>
        ) : markAttendanceResult.isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Button mode="contained" onPress={onSubmit} style={styles.button}>
            Mark Attendance
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  imageContainer: {
    // marginTop: '10%',
    paddingVertical: '20%',
    width: '100%',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  imagebody: {
    width: 300,
    height: 300,
    backgroundColor: '#e0e0e0',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  placeholderText: {
    color: '#757575',
    textAlign: 'center',
  },
  note: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  faceOutline:{
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: '100%',
    padding: 10,
  },
});
export default CheckInOut;
