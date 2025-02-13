import React, {useEffect} from 'react';

import {StatusBar, StyleSheet} from 'react-native';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/context/AuthProvider';
import {ThemeProvider} from './src/theme/ThemeProvider';

import {Alert, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Provider} from 'react-redux';
import {store} from './src/redux/store/store';
import {PaperProvider} from 'react-native-paper';
import SnackBar from './src/components/snackbar';
import AppNavigator from './src/Navigation';

const getDeviceInfo = async () => {
  if (Platform.OS === 'android') {
    // Check if permission is granted
    const permissionStatus = await check(PERMISSIONS.ANDROID.READ_PHONE_STATE);

    if (permissionStatus === RESULTS.GRANTED) {
      // Permission is already granted
      fetchIMEI();
    } else {
      // Request permission
      const requestStatus = await request(PERMISSIONS.ANDROID.READ_PHONE_STATE);
      if (requestStatus === RESULTS.GRANTED) {
        return console.log('Permission Granted');
      } else {
        Alert.alert(
          'Permission Denied',
          'Cannot access IMEI without permission.',
        );
      }
    }
  } else if (Platform.OS === 'ios') {
    // iOS doesn't allow access to IMEI, use a unique identifier
    const uniqueId = DeviceInfo.getUniqueId();
    console.log('Device Identifier', `Unique ID: ${uniqueId}`);
  }
};

const fetchIMEI = async () => {
  try {
    const imei = await DeviceInfo.getDeviceId();
    console.log('Device IMEI', `IMEI: ${imei}`);
  } catch (error) {
    console.error('Failed to get IMEI:', error);
    Alert.alert('Error', 'Failed to retrieve IMEI.');
  }
};

function App(): React.JSX.Element {
  useEffect(() => {
    getDeviceInfo();
  });

  return (
    <SafeAreaProvider style={styles.backgroundStyle}>
      <Provider store={store}>
        <PaperProvider>
          <ThemeProvider>
            <AuthProvider>
              <StatusBar
        backgroundColor= "#000"
      />

              {/* <GestureHandlerRootView> */}
              <NavigationContainer>
              <SnackBar />
                <AppNavigator />
              </NavigationContainer>
              {/* </GestureHandlerRootView> */}
            </AuthProvider>
          </ThemeProvider>
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
});

export default App;
