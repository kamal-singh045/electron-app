import { getUserByEmail } from "../db/queries";
import { setCurrentUser } from "../../electron/main";
interface IPayload {
  email: string;
  password: string;
}

export const loginHandler = (_event: Electron.IpcMainInvokeEvent, payload: IPayload) => {
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
