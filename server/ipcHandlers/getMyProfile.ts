/* eslint-disable @typescript-eslint/no-unused-vars */
import { getUserById } from "../db/queries";
import { getCurrentUser } from "../../electron/main"

export const getMyProfileHandler = (_event: Electron.IpcMainInvokeEvent) => {
  const userId = getCurrentUser();
  if (!userId) {
    return {
      success: false,
      message: 'User not logged in'
    }
  }
  const user = getUserById(userId);
  if (!user) {
    return {
      success: false,
      message: 'User does not exist'
    }
  }
  const profile_image = user.profile_image ? `app://${user.profile_image}` : '';
  return {
    success: true,
    message: 'User profile fetched',
    data: { ...user, profile_image }
  }
}
