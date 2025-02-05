export interface employeeState {
  employeeId: string | undefined;
  employeeDetails: {
    CustomerCode: string;
    UserName: string;
    Password: string;
  } | undefined;
}
