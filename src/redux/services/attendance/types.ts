export interface CheckInPayload {
  mid: string;
  mip: string;
  outLat: number;
  outLong: number;
  outDate: string;
  outTime: string;
  outImage: string;
  status: string;
  employeeMaster_Fid: string;
  [key: string]: any; // Index signature allowing arbitrary string keys
}

export interface CheckOutPayload {
  mid: string;
  mip: string;
  inLat: number;
  inLong: number;
  inDate: string;
  inTime: string;
  outImage: string;
  status: string;
  employeeMaster_Fid: string;
  [key: string]: any; // Index signature allowing arbitrary string keys
}

export interface registerPayload {
  mid: string;
  mip: string;
  EmployeeMaster_Fid: string;
  IMEINumber: string;
  AppImage_I: {
    uri: string;
    name: string;
    filename: string;
    type: string;
  };
  AppImage_II: {
    uri: string;
    name: string;
    filename: string;
    type: string;
  };
  AppImage_III: {
    uri: string;
    name: string;
    filename: string;
    type: string;
  };
  InPhoneImage: {
    uri?: string;
    name?: string;
    filename?: string;
    type?: string;
  };
  [key: string]: any;
}
// Define the updated AttendanceLogData type (alternative if list is used)
// export interface AttendanceLogData {
//   list: AttendanceLogItem[];
// }
