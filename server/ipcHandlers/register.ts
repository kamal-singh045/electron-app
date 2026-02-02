import { getUserByEmail, createUser } from "../db/queries";
interface IPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const registerHandler = (_event: Electron.IpcMainInvokeEvent, payload: IPayload) => {
  const { email } = payload;
  const user = getUserByEmail(email);
  if (user) {
    return {
      success: false,
      message: 'User already exist, Please login'
    };
  }
  createUser(payload);
  return {
    success: true,
    message: 'User registered successfully'
  }
}
