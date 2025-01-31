export interface User {
  id: string;
  name?: string;
  role?: string;
  email?: string;
  password?: string;
}

export type RootStackParamList = {
  splash: undefined;
  home: {
    screen: keyof RootTabParamList;
  };
  camera: undefined;
  register: undefined;
  [key: string]: undefined | object;
};

export type RootTabParamList = {
  home: undefined;
  demo: undefined;
};

export type AttendanceStackParamList = {
  homeMain: undefined;
  checkinout: undefined;
};
