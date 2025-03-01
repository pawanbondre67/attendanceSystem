import React from 'react';

import {StatusBar, StyleSheet} from 'react-native';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/context/AuthProvider';
import {ThemeProvider} from './src/theme/ThemeProvider';
import {Provider} from 'react-redux';
import {store} from './src/redux/store/store';
import {PaperProvider} from 'react-native-paper';
import SnackBar from './src/components/snackbar';
import AppNavigator from './src/Navigation';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider style={styles.backgroundStyle}>
      <Provider store={store}>
        <PaperProvider>
          <ThemeProvider>
            <AuthProvider>
              <StatusBar backgroundColor="#000" />

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
