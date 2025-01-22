import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './screens/splash/SplashScreen';
import HomeScreen from './screens/home/HomeScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import CameraAuth from './screens/cameraAuth/CameraAuth';
import {RootStackParamList} from './types/types';
import CheckInOut from './screens/CheckInOut';


const Stack = createNativeStackNavigator<RootStackParamList>();
const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen
        name="home"
        options={{
          // header : () => (
          //   <View style={{height: 70, backgroundColor: 'red'}}>
          //     <Text>Header</Text>
          //   </View>

          // ),
          // headerStyle: {
          //   backgroundColor: '#f7f7f7',
          // },
          headerShown: false,
        }}
        component={HomeScreen}
      />
      <Stack.Screen
        name="camera"
        options={{
          headerShown: false,
        }}
        component={CameraAuth}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="checkinout"
        options={{
        title: 'Attendance',
        }}
        component={CheckInOut}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
