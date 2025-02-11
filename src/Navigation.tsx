import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
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
import ProfileScreen from './screens/profile/ProfileScreen';

const AppStack = createNativeStackNavigator<AppStackParamList>();
const AttendanceStack = createNativeStackNavigator<AttendanceStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <MainTab.Navigator
      initialRouteName="homeTab"
      screenOptions={({route}) => {
        // Get the currently focused route name
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'homeScreen';

        // Hide the tab bar if the focused route is 'checkinout'
        const isCheckInOutScreen = routeName === 'checkinout';

        return {
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color, size}) => {
            let iconName;

            if (route.name === 'homeTab') {
              iconName = 'home';
            } else if (route.name === 'attendanceHistoryTab') {
              iconName = 'menu';
            } else if (route.name === 'profileTab') {
              iconName = 'person';
            }

            return <Icon name={iconName ?? ''} color={color} size={size} />;
          },
          tabBarActiveTintColor: '#F8FAFC',
          tabBarInactiveTintColor: '#D8D2C2',

          tabBarStyle: {
            backgroundColor: '#578FCA',
            borderTopWidth: 0,
            elevation: 0,
            height: 70,
            display: isCheckInOutScreen ? 'none' : 'flex', // Hide tab bar for CheckInOut screen
          },
          tabBarLabelStyle: {
            fontSize: 12,
            textAlign: 'center',
          },
        };
      }}>
      <MainTab.Screen
        name="homeTab"
        options={{
          headerShown: false,
          animation: 'shift',
          tabBarLabel: 'Home',
        }}
        component={AttendanceStackNavigator}
      />

      <MainTab.Screen
        name="attendanceHistoryTab"
        options={{
          headerShown: false,
          animation: 'shift',
          tabBarLabel: 'Attendance History',
        }}
        component={AttendanceLog}
      />
      <MainTab.Screen
        name="profileTab"
        options={{
          headerShown: false,
          // title: 'Profile',
          animation: 'shift',
          tabBarLabel: 'Profile',
        }}
        component={ProfileScreen}
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
        options={{
          title: 'Attendance',
          headerStyle: {
            backgroundColor: '#578FCA',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
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
