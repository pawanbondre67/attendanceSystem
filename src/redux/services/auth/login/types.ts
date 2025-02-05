interface LoginResponse {
  message: string;
  status: number | string;
  data: {
    employeeId: string | number;
    isAppRegisterMandatory: boolean;
  };
}

interface LoginApiArgs {
  CustomerCode: string;
  UserName: string;
  Password: string;
}
interface FCMArgs {
  fcmToken: string;
}

export type {LoginResponse, LoginApiArgs, FCMArgs};
