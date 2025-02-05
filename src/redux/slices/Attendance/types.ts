// types.ts
export interface CheckInOutData {
  status: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  date?: string | null;
}

export interface AttendanceState {
  CheckInOutData: CheckInOutData | null;
}
