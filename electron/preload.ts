/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer, contextBridge } from 'electron'
import { ApiResponse, ILoginPayload, IRegisterPayload, IUserResponse } from './server/types';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  }
});

// --------- Exposing some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electron', {
  login: async (payload: ILoginPayload): Promise<ApiResponse<undefined>> => {
    return ipcRenderer.invoke('login', payload);
  },
  register: async (payload: IRegisterPayload): Promise<ApiResponse<undefined>> => {
    return ipcRenderer.invoke('register', payload);
  },
  getMyProfile: async (): Promise<ApiResponse<IUserResponse>> => {
    return ipcRenderer.invoke('get-my-profile');
  },
  uploadProfileImage: async (file: File): Promise<ApiResponse<{ profile_image: string }>> => {
    const buffer = await file.arrayBuffer();
    return ipcRenderer.invoke('upload-profile-image', {
      name: file.name,
      type: file.type,
      buffer
    });
  },
  setDockProgress: (progress: number): Promise<void> => {
    return ipcRenderer.invoke('set-dock-progress', progress);
  }
});
