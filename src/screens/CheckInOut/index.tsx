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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useAppDispatch} from '../../redux/hook/hook';
import {setSnackMessage} from '../../redux/slices/snackbarSlice';
type Props = {};
const CheckInOut = ({navigation}: Props) => {
  const {
    currentLatitude,
    currentLongitude,
    isFetchingLocation,
    getOneTimeLocation,
  } = useLocation();

  useEffect(() => {
    // Set header options
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () =>
        isFetchingLocation ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <FontAwesome6
            name="location-crosshairs"
            size={22}
            color="#fff"
            onPress={getOneTimeLocation}
          />
        ),
    });
  }, [navigation, isFetchingLocation]);

  const {onSubmit, markAttendanceResult, checkOutResult, onPhotoCapture} =
    useCheckInOut({currentLatitude, currentLongitude});
  const device = useCameraDevice('front');

  const cameraRef = useRef<Camera>(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    capturedImage &&
      setTimeout(async () => {
        await onSubmit();
      }, 100);
  }, [capturedImage]);

  useEffect(() => {
    // Check and request camera permissions when component mounts
    checkCameraPermission();
  }, []);

  const dispatch = useAppDispatch();

  const checkCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await request(PERMISSIONS.ANDROID.CAMERA);
        if (granted === 'granted') {
          console.log('Camera permission granted');
          setIsCameraReady(true); // Update state to indicate camera is ready
        } else {
          console.log('Camera permission denied');
          dispatch(
            setSnackMessage({
              message: 'Camera permission denied',
              severity: 'error',
            }),
          );
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
          // console.log('Camera permission denied');
          dispatch(
            setSnackMessage({
              message: 'Camera permission denied',
              severity: 'error',
            }),
          );
          // Handle permission denial (e.g., show a message or disable camera features)
        }
      } catch (err) {
        dispatch(
          setSnackMessage({
            message: 'Failed to request camera permission',
            severity: 'error',
          }),
        );
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

  return (
    <View style={styles.container}>
      {isFetchingLocation && (
        <View
          style={{
            zIndex: 99,
            position: 'absolute',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#F5F5F5',
            opacity: 0.7,
          }}>
          <ActivityIndicator style={{flex: 1}} size="large" color="#578FCA" />
        </View>
      )}
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imagebody} onPress={handleImageClick}>
          <Image
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
            outputOrientation="device"
            photo={true}
          />
        </TouchableOpacity>
        <Text style={styles.note}>Make sure to upload a clear face selfie</Text>
      </View>

      <View style={{width: '100%', marginTop: 50}}>
        {showCamera ? (
          <Button
            mode="outlined"
            textColor="#fff"
            disabled={isFetchingLocation}
            onPress={takePhoto}
            style={styles.button}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Mark Attendance</Text>
              {/* {(markAttendanceResult.isLoading || checkOutResult.isLoading) && (
                <ActivityIndicator size="small" color="#fff" />
              )} */}
            </View>
          </Button>
        ) : (
          <Button
            mode="outlined"
            onPress={onSubmit}
            disabled={isFetchingLocation}
            textColor="#fff"
            style={styles.button}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Mark Attendance</Text>
              {(markAttendanceResult.isLoading || checkOutResult.isLoading) && (
                <ActivityIndicator size="small" color="#fff" />
              )}
            </View>
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
    justifyContent: 'center',
  },
  imageContainer: {
    // marginTop: '10%',
    // paddingVertical: '20%',
    paddingVertical: 20,
    width: '100%',
    // backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  imagebody: {
    width: 340,
    height: 350,
    // backgroundColor: '#e0e0e0',
    // borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    // borderColor: '#00BFA6',
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
    // borderRadius: 100,
  },
  faceOutline: {
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
    backgroundColor: '#578FCA',
    width: '100%',
    padding: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  buttonText: {
    color: '#fff',
    marginRight: 8, // Add some space between the text and the loader
  },
});
export default CheckInOut;
