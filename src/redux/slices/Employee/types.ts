export interface employeeState {
  employeeId: number | string| null;
  employeeDetailsState: {
    CustomerCode: string;
    UserName: string;
    Password: string;
  } | null;
}
