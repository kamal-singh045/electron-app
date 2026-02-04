/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LoginPayload,
  RegisterPayload,
  ApiResponse,
  IUserResponse
} from './server/types';

/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: {
    on(...args: Parameters<import('electron').IpcRenderer['on']>): import('electron').IpcRenderer;
    off(...args: Parameters<import('electron').IpcRenderer['off']>): import('electron').IpcRenderer;
    send(...args: Parameters<import('electron').IpcRenderer['send']>): void;
    invoke(...args: Parameters<import('electron').IpcRenderer['invoke']>): Promise<any>;

    // Custom APIs
  }
}

export interface ElectronAPI {
  login(payload: LoginPayload): Promise<ApiResponse<undefined>>;
  register(payload: RegisterPayload): Promise<ApiResponse<undefined>>;
  getMyProfile(): Promise<ApiResponse<IUserResponse>>;
  uploadProfileImage(file: File): Promise<ApiResponse<{ profile_image: string }>>;
  setDockProgress(progress: number): Promise<void>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
