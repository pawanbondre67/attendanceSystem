export interface employeeState {
  employeeId: string | undefined;
  employeeDetailsState: {
    CustomerCode: string;
    UserName: string;
    Password: string;
  } | undefined;
}
