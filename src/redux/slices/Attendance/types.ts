// types.ts
export interface CheckInOutData {
  status: string | null;
}

export interface AttendanceState {
  CheckInOutData: CheckInOutData | null;
}
