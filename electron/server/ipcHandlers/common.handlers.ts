import screenshot from 'screenshot-desktop';
import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';
import { serverConfig } from '../config/config';

export function setDockProgressHandler(window: Electron.BrowserWindow | null, progress: number) {
  if (!window) return;
  if (progress < 0) {
    window.setProgressBar(-1); // Reset progress
  } else {
    window.setProgressBar(progress);
  }
}

// Take screenshot and save into the disk and return the path
export async function takeScreenshotHandler() {
  try {
    const img = await screenshot();
    const imagesDir = path.join(app.getPath('userData'), serverConfig.screenshotsDir);
    fs.mkdirSync(imagesDir, { recursive: true });
    const filename = `ss-${Date.now()}.png`;
    const absolutePath = path.join(imagesDir, filename);
    fs.writeFileSync(absolutePath, img);
    const relativePath = `${serverConfig.screenshotsDir}/${filename}`;
    return {
      success: true,
      message: 'Screenshot captured',
      data: {
        screenshot: `app://${relativePath}`
      }
    };
  } catch (error) {
    console.error('Screenshot error:', error);
    return {
      success: false,
      message: 'Failed to capture screenshot'
    };
  }
}
