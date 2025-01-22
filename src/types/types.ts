export interface User {
  id: string;
  name?: string;
  role?: string;
  email?: string;
  password?: string;
}

export interface RootStackParamList {
  splash: undefined;
  home: undefined;
  camera: undefined;
  register: undefined;
  [key: string]: undefined | object;
}
