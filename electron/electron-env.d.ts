/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LoginPayload,
  RegisterPayload,
  ApiResponse,
  IUserResponse,
  ICreateTodoPayload,
  ITodoResponse,
  IUpdateTodoPayload
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
  takeScreenshot(): Promise<ApiResponse<{ screenshot: string }>>;

  // Todos
  createTodo(payload: ICreateTodoPayload): Promise<ApiResponse<undefined>>;
  getAllTodos(): Promise<ApiResponse<ITodoResponse[]>>;
  updateTodo(payload: Partial<IUpdateTodoPayload>): Promise<ApiResponse<undefined>>;
  deleteTodo(id: number): Promise<ApiResponse<undefined>>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
