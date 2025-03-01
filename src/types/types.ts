export interface User {
  id: string;
  name?: string;
  role?: string;
  email?: string;
  password?: string;
}

export  interface EmployeeDetails {
  CustomerCode: string;
  UserName: string;
  Password: string;
}

export interface EmployeeDetailsforlocal {
  CustomerCode: string;
  UserName: string;
  Password: string;
  ProfilePic?: string;
  EmployeeId?: string;
}


export type AppStackParamList = {
  splashScreen: undefined;
  mainTabNavigator: {
    screen: keyof MainTabParamList;
  };
  cameraAuthScreen: undefined;
  loginScreen: undefined;
  checkinout: undefined;
  [key: string]: undefined | object;
};

export type MainTabParamList = {
  homeTab: undefined;
  attendanceHistoryTab: undefined;
  profileTab : undefined;
};
