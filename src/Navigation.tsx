import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from './screens/splash/SplashScreen';
import HomeScreen from './screens/home/HomeScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import CameraAuth from './screens/cameraAuth/CameraAuth';
import {
  AttendanceStackParamList,
  AppStackParamList,
  MainTabParamList,
} from './types/types';
import CheckInOut from './screens/CheckInOut';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AttendanceLog from './screens/AttendanceLog';

const AppStack = createNativeStackNavigator<AppStackParamList>();
const AttendanceStack = createNativeStackNavigator<AttendanceStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <MainTab.Navigator
      initialRouteName="homeTab"
      screenOptions={({route}) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'homeTab') {
            iconName = 'home';
          } else if (route.name === 'attendanceHistoryTab') {
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
      <MainTab.Screen
        name="homeTab"
        options={{headerShown: false}}
        component={AttendanceStackNavigator}
      />

      <MainTab.Screen
        name="attendanceHistoryTab"
        options={{
          title: 'Attendance History',
        }}
        component={AttendanceLog}
      />
    </MainTab.Navigator>
  );
};

const AttendanceStackNavigator = () => {
  return (
    <AttendanceStack.Navigator initialRouteName="homeScreen">
      <AttendanceStack.Screen
        name="homeScreen"
        options={{headerShown: false}}
        component={HomeScreen}
      />
      <AttendanceStack.Screen
        name="checkinout"
        options={{title: 'Attendance'}}
        component={CheckInOut}
      />
    </AttendanceStack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <AppStack.Navigator initialRouteName="splashScreen">
      <AppStack.Screen
        name="splashScreen"
        options={{
          headerShown: false,
        }}
        component={SplashScreen}
      />
      <AppStack.Screen
        name="mainTabNavigator"
        component={MainTabNavigator}
        options={{headerShown: false}}
      />
      <AppStack.Screen
        name="cameraAuthScreen"
        options={{
          headerShown: false,
        }}
        component={CameraAuth}
      />
      <AppStack.Screen
        name="loginScreen"
        options={{
          headerShown: false,
        }}
        component={LoginScreen}
      />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
