import { createUser, getUserByEmail } from "../db/queries";
import { setCurrentUser } from "../../main";
import { ILoginPayload, IRegisterPayload } from "../types";

export const loginHandler = (_event: Electron.IpcMainInvokeEvent, payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = getUserByEmail(email);
  if (!user) {
    return {
      success: false,
      message: 'User does not exist'
    };
  } else if (user.password !== password) {
    return {
      success: false,
      message: 'Password does not match'
    };
  }
  setCurrentUser(user.id);
  return {
    success: true,
    message: 'User logged in successfully'
  }
}

export const registerHandler = (_event: Electron.IpcMainInvokeEvent, payload: IRegisterPayload) => {
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
