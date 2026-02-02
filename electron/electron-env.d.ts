/* eslint-disable @typescript-eslint/no-explicit-any */
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
    login(payload: any): Promise<any>;
    register(payload: any): Promise<any>;
    getMyProfile(): Promise<any>;
    uploadProfileImage(file: File): Promise<any>;
  }
}
