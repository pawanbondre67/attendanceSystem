// types.ts
export interface CheckInOutData {
  inTime: string;
  outTime: string;
  status?: string;
}

export interface AttendanceState {
  CheckInOutData: CheckInOutData | null;
}
