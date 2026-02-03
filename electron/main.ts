import { app, BrowserWindow, ipcMain, protocol, Tray, Menu } from 'electron'
import path from 'node:path'
import { startServer } from './server/server';
import { setupPermissions } from './permissions'
import {
  loginHandler,
  registerHandler,
  uploadProfileImageHandler,
  getMyProfileHandler
} from './server/ipcHandlers';
import fs from 'node:fs/promises';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
// For development, use process.cwd(), for production use app.getAppPath()
const isDev = !app.isPackaged;
process.env.APP_ROOT = isDev ? process.cwd() : app.getAppPath();

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

const VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null;
let tray;
let currentUserId: number | null = null;
let isQuitting = false;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(MAIN_DIST, 'preload.mjs'),
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      win?.hide();
    }
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Register file protocol
function registerFileProtocol() {
  protocol.handle('app', async (request) => {
    const url = request.url.replace('app://', ''); // Remove the 'app://' prefix if present
    const filePath = path.join(app.getPath('userData'), url);
    const data = await fs.readFile(filePath);
    return new Response(data);
  });
}

// Setup Tray
function setupTray() {
  const iconPath = path.join(VITE_PUBLIC, 'tray-icon.png');
  tray = new Tray(iconPath);
  tray.setToolTip('ElectronApp');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        if (win) {
          win.show();
          win.focus();
        } else {
          createWindow();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    },
  ]);
  tray.setContextMenu(contextMenu);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // Do NOTHING here
  // Keep app alive for tray (Windows + macOS + Linux)
  // if (process.platform !== 'darwin') {
  //   app.quit()
  //   win = null
  // }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

app.whenReady().then(async () => {
  // Setup tray
  setupTray();

  // Setup permissions for camera and file access
  setupPermissions();

  // Start Express server before creating window
  await startServer();

  // Register file protocol: which will serve static files
  registerFileProtocol();

  // Setup IPC handlers
  setupIpcHandlers();

  // Create window
  createWindow();
});

// IPC Handlers
function setupIpcHandlers() {
  // Handle profile image upload
  ipcMain.handle('get-my-profile', getMyProfileHandler);
  ipcMain.handle('upload-profile-image', uploadProfileImageHandler);
  ipcMain.handle('login', loginHandler);
  ipcMain.handle('register', registerHandler);
}

// Helper functions
export const setCurrentUser = (userId: number) => {
  currentUserId = userId;
};
export const getCurrentUser = () => {
  return currentUserId;
};
