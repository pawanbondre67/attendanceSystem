export interface User {
  id: string;
  name?: string;
  role?: string;
  email?: string;
  password?: string;
}

export type AppStackParamList = {
  splashScreen: undefined;
  mainTabNavigator: {
    screen: keyof MainTabParamList;
  };
  cameraAuthScreen: undefined;
  loginScreen: undefined;
  [key: string]: undefined | object;
};

export type MainTabParamList = {
  homeTab: {
    screen: keyof AttendanceStackParamList;
  };
  attendanceHistoryTab: undefined;
  profileTab : undefined;
};

export type AttendanceStackParamList = {
  homeScreen: undefined;
  checkinout: undefined;
};
