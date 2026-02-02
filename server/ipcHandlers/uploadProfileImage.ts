import fs from 'node:fs';
import path from 'node:path';
import { updateUser } from '../db/queries';
import { app } from 'electron';
import { serverConfig } from '../config/config';
import { getCurrentUser } from '../../electron/main';

interface IPayload {
  buffer: Buffer,
  name: string,
  type: string,
}
export const uploadProfileImageHandler = async (_event: Electron.IpcMainInvokeEvent, payload: IPayload) => {
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
