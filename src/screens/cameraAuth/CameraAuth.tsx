import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import LottieView from 'lottie-react-native';
import {ProgressBar} from 'react-native-paper';
import AnimatedArrowButton from '../../components/AnimatedArrowButton';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Alert} from 'react-native';
import {Platform} from 'react-native';
import useCameraAuth from './useCameraAuth';
const CameraAuth = () => {
  const {onsubmit, images, setImages ,isLoading} = useCameraAuth();
  const {height, width} = Dimensions.get('window');

  const device = useCameraDevice('front');
  const camera = useRef(null);
  // const [photos, setPhotos] = useState({
  //   left: null,
  //   right: null,
  //   straight: null,
  // });
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [verificationProgress, setVerificationProgress] = useState(0);

  const steps = ['straight', 'left', 'right', 'InPhoneImage'];

  useEffect(() => {
    const checkCameraPermission = async () => {
      let result;
      if (Platform.OS === 'ios') {
        result = await check(PERMISSIONS.IOS.CAMERA);
      } else if (Platform.OS === 'android') {
        result = await check(PERMISSIONS.ANDROID.CAMERA);
      }

      if (result === RESULTS.DENIED) {
        let requestResult;
        if (Platform.OS === 'ios') {
          requestResult = await request(PERMISSIONS.IOS.CAMERA);
        } else if (Platform.OS === 'android') {
          requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
        }

        if (requestResult !== RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Camera permission is required to take photos.',
          );
        }
      } else if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to take photos.',
        );
      }
    };

    checkCameraPermission();
  }, []);

  console.log('Photos no :', step, images);

  const capturePhoto = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      console.log('Capturing Photo No :', step, photo.path);
      setImages(prevPhotos => ({
        ...prevPhotos,
        [steps[step]]: photo.path,
      }));

      setProgress((step + 1) / 4); // Update the progress bar
      if (step < 3) {
        setStep(step + 1);
      } else {
        setStep(step + 1);
        console.log('Captured Photos:', {...images, [steps[step]]: photo.path});
        simulateVerification();
      }
    }
  };

  const simulateVerification = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setVerificationProgress(progress);
      if (progress >= 100) {
        // Set done to true once verification is complete

        clearInterval(interval);
      }
    }, 200);
  };

  if (!device) {
    console.log('No Camera Found');
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Face Verification</Text>
        <Text style={styles.subheading}>No Camera Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Face Verification</Text>
      <Text style={styles.subheading}>
        Please{' '}
        {step === 0
          ? 'look straight'
          : step === 3
          ? 'set a profile picture'
          : `turn your face to the ${steps[step]} side`}
      </Text>
      <View style={[styles.cameraContainer, {height: height * 0.4}]}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
          ref={camera}
        />
        {/* <LottieView
          source={require('../../assets/face.json')} // Path to Lottie file
          autoPlay
          loop
          style={styles.lottie}
        /> */}
      </View>
      <View style={styles.verificationContainer}>
        {step < 4 ? (
          <>
            <Text style={styles.imageCount}>Image {step} of 4</Text>
            <ProgressBar
              progress={progress}
              style={styles.progressBar}
              color="white"
            />
          </>
        ) : step === 4 && verificationProgress < 100 ? (
          <>
            <Text style={styles.progress}>{verificationProgress}%</Text>
            <Text style={styles.verifyingText}>Verifying Your Face</Text>
          </>
        ) : (
          <>
            <LottieView
              source={require('../../assets/done.json')} // Path to Done Lottie file
              autoPlay
              loop
              style={styles.CompleteLogo}
            />
          </>
        )}
      </View>

      {step === 4 && verificationProgress === 100 ? (
        <AnimatedArrowButton submit={onsubmit} isloading={isLoading} routeName="home" />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            disabled={step === 4}
            onPress={capturePhoto}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1822',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30,
    marginTop: 20,
  },
  cameraContainer: {
    width: '90%',

    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#00BFA6',
    position: 'relative', // Make sure the container is positioned relatively
    marginVertical: 20,
  },
  camera: {
    flex: 1,
  },
  lottie: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  CompleteLogo: {
    width: 200,
    height: 200,
  },
  imageCount: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BFA6', // Color from the image
    paddingVertical: 10,
    width: '90%',
    gap: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
  verificationContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 40,
    height: 100,
    justifyContent: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  progress: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  verifyingText: {
    fontSize: 14,
    color: '#aaa',
  },
  progressBar: {
    width: 200,
    height: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  doneButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
});

export default CameraAuth;
