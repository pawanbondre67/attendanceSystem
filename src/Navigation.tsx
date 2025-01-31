import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from './screens/splash/SplashScreen';
import HomeScreen from './screens/home/HomeScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import CameraAuth from './screens/cameraAuth/CameraAuth';
import {
  AttendanceStackParamList,
  RootStackParamList,
  RootTabParamList,
} from './types/types';
import CheckInOut from './screens/CheckInOut';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AttendanceLog from './screens/AttendanceLog';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AttendanceStackNavigator =
  createNativeStackNavigator<AttendanceStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const RootTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({route}) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'home') {
            iconName = 'home';
          } else if (route.name === 'demo') {
            iconName = 'menu';
          }

          return <Icon name={iconName ?? ''} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#bcc4ff',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: '#e53935',
          borderTopWidth: 0,
          elevation: 0,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          textAlign: 'center',
          // textTransform : 'capitalize',
          color: 'white',
        },
      })}>
      <Tab.Screen
        name="home"
        options={{headerShown: false}}
        component={AttendanceStack}
      />

      <Tab.Screen
        name="demo"
        options={{
          title: 'Attendance History',
        }}
        component={AttendanceLog}
      />
    </Tab.Navigator>
  );
};
const AttendanceStack = () => {
  return (
    <AttendanceStackNavigator.Navigator initialRouteName="homeMain">
      <AttendanceStackNavigator.Screen
        name="homeMain"
        options={{headerShown: false}}
        component={HomeScreen}
      />
      <AttendanceStackNavigator.Screen
        name="checkinout"
        options={{title: 'Attendance'}}
        component={CheckInOut}
      />
    </AttendanceStackNavigator.Navigator>
  );
};

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="splash">
      <Stack.Screen
        name="splash"
        options={{
          headerShown: false,
        }}
        component={SplashScreen}
      />
      <Stack.Screen
        name="home"
        component={RootTab}
        options={{headerShown: false}}
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
    </Stack.Navigator>
  );
};

export default RootStack;
