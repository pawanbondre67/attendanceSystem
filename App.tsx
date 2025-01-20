
import React from 'react';

import {StyleSheet} from 'react-native';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootStack from './src/Navigation';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/context/AuthProvider';
import { ThemeProvider } from './src/theme/ThemeProvider';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider style={styles.backgroundStyle}>
      <ThemeProvider>
      <AuthProvider>
        {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      /> */}

        {/* <GestureHandlerRootView> */}
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
        {/* </GestureHandlerRootView> */}
      </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
});

export default App;
