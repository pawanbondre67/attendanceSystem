import {useEffect, useRef, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {isIos} from '../helper/utility';
import {useNavigation} from '@react-navigation/native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const useLocation = () => {
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const locationUpdated = useRef(false); // Flag to track if location has been updated

  // let watchID: number = 0;
  const navigation = useNavigation();
  useEffect(() => {
    // Function to request location permission
    const requestLocationPermission = async () => {
 
      if (Platform.OS === 'ios') {
        // For iOS, request location permission
        const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (result === RESULTS.GRANTED) {
          // If permission is granted, get location and subscribe to location updates
          getOneTimeLocation();
          // subscribeLocationLocation();
        } else {
          // If permission is denied, set status and prompt user to enable location settings
          setLocationStatus('Permission Denied');
          // Alert.alert('Location Permission', 'Please enable location services in settings.');
        }
      } else {
        try {
          // For Android, request location permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
              buttonPositive: 'OK',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // If permission is granted, check GPS status
            checkGPSStatus();
          } else {
            // If permission is denied, set status and prompt user to enable location settings
            setLocationStatus('Permission Denied');
            openLocationSettings();
          }
        } catch (err) {
          // Log any errors that occur during the permission request
          console.warn(err);
        }
      }
    };

    // Call the function to request location permission
    if (!locationUpdated.current) {
      requestLocationPermission();
    }
  }, []);// Empty dependency array ensures this runs only once when the component mounts



  const getOneTimeLocation = () => {
    setIsFetchingLocation(true);
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      position => {
        setIsFetchingLocation(false);
        setLocationStatus('You are Here');
        locationUpdated.current = true; // Set flag to true after updating location
        setCurrentLongitude(position.coords.longitude);
        setCurrentLatitude(position.coords.latitude);
      },
      error => {
        setIsFetchingLocation(false);
        setLocationStatus(error.message);
        console.warn('one time',error.message);
        if (error.code === 2) {
          // GPS is off, prompt user to turn it on
          Alert.alert(
            'Turn On GPS',
            'Please turn on GPS to fetch your location',
            [{text: 'OK', onPress: openLocationSettings}],
            {cancelable: false},
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 40000,
        maximumAge: 1000,
      },
    );
  };

  // const subscribeLocationLocation = () => {
  //   setIsFetchingLocation(true);
  //   watchID = Geolocation.watchPosition(
  //     position => {
  //       setIsFetchingLocation(false);
  //       setLocationStatus('Location Fetched successfully');
  //       console.warn('Location Fetched successfully');
  //       setCurrentLongitude(position.coords.longitude);
  //       setCurrentLatitude(position.coords.latitude);
  //     },
  //     error => {
  //       setIsFetchingLocation(false);
  //       console.error(error.message);
  //       setLocationStatus(error.message);
  //     },
  //     {
  //       enableHighAccuracy: false,
  //       distanceFilter: 10, // fetch location updates if device has moved at least 10 meters
  //       maximumAge: 1000,
  //     },
  //   );
  // };

  const openLocationSettings = () => {
    if (isIos) {
      Alert.alert(
        'Turn On GPS',
        'Please enable Location Services in your device settings to fetch your location. Go to Settings > Privacy > Location Services and turn it on.',
        [{text: 'OK'}],
        {cancelable: false},
      );
    } else {
      Alert.alert(
        'Turn On GPS',
        'Please enable Location in your device settings to fetch your location. Go to Settings > Location and turn it on.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  const checkGPSStatus = () => {
    Geolocation.getCurrentPosition(
      () => {
        getOneTimeLocation(); // If GPS is enabled, fetch the location
      },
      error => {
        if (error.code === 2) {
          // GPS is off, prompt user to turn it on
          openLocationSettings();
        } else {
          // Other location errors
          setLocationStatus(error.message);
        }
      },
    );
  };

  return {
    currentLatitude,
    currentLongitude,
    locationStatus,
    isFetchingLocation,
    getOneTimeLocation,
  };
};

export default useLocation;

