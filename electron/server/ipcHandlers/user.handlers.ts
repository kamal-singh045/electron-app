/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'node:fs';
import path from 'node:path';
import { updateUser } from '../db/queries';
import { app } from 'electron';
import { serverConfig } from '../config/config';
import { getUserById } from "../db/queries";
import { getCurrentUser } from '../../main';
import { ApiResponse, IUploadProfileImagePayload, IUserResponse } from '../types';

export const getMyProfileHandler = (_event: Electron.IpcMainInvokeEvent): ApiResponse<IUserResponse> => {
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

export const uploadProfileImageHandler = async (
  _event: Electron.IpcMainInvokeEvent,
  payload: IUploadProfileImagePayload) => {
  try {
    const userId = getCurrentUser();
    if (!userId) {
      return {
        success: false,
        message: 'User not logged in'
      }
    }
    const { buffer, name } = payload;
    const imagesDir = path.join(app.getPath('userData'), serverConfig.imagesBaseDir);
    fs.mkdirSync(imagesDir, { recursive: true });
    const filename = `${Date.now()}-${name}`;
    const absolutePath = path.join(imagesDir, filename);
    fs.writeFileSync(absolutePath, Buffer.from(buffer));
    const relativePath = `${serverConfig.imagesBaseDir}/${filename}`;

    updateUser(userId, { profile_image: relativePath });
    return {
      success: true,
      message: 'Profile image uploaded',
      data: {
        profile_image: `app://${relativePath}`
      }
    };
  } catch (error) {
    console.log(error);
  }
}
