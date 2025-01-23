import {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {isIos} from '../helper/utility';
import {useNavigation} from '@react-navigation/native';

const useLocation = () => {
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  let watchID: number = 0;
  const navigation = useNavigation();
  useEffect(() => {
    // Function to request location permission
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        // For iOS, get location and subscribe to location updates
        getOneTimeLocation();
        subscribeLocationLocation();
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
    requestLocationPermission();

    // Cleanup function to clear the location watch when the component unmounts
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const getOneTimeLocation = () => {
    setIsFetchingLocation(true);
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      position => {
        setIsFetchingLocation(false);
        setLocationStatus('You are Here');
        // const currentLongitude = position.coords.longitude;
        // const currentLatitude = position.coords.latitude;
        setCurrentLongitude(position.coords.longitude);
        setCurrentLatitude(position.coords.latitude);
      },
      error => {
        setIsFetchingLocation(false);
        setLocationStatus(error.message);
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
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    setIsFetchingLocation(true);
    watchID = Geolocation.watchPosition(
      position => {
        setIsFetchingLocation(false);
        setLocationStatus('Location Fetched successfully');
        // const currentLongitude = position.coords.longitude;
        // const currentLatitude = position.coords.latitude;
        setCurrentLongitude(position.coords.longitude);
        setCurrentLatitude(position.coords.latitude);
      },
      error => {
        setIsFetchingLocation(false);
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

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
  };
};

export default useLocation;
