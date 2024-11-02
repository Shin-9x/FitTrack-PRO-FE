import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    saveTokens: (accessToken: string, refreshToken: string, expiryAccessToken: number, expiryRefreshToken: number) => ipcRenderer.invoke('saveTokens', accessToken, refreshToken, expiryAccessToken, expiryRefreshToken),
    saveAccessToken: (token: string, expiresAt: number) => ipcRenderer.invoke('saveAccessToken', token, expiresAt),
    saveRefreshToken: (token: string, expiresAt: number) => ipcRenderer.invoke('saveRefreshToken', token, expiresAt),
    getAccessToken: () => ipcRenderer.invoke('getAccessToken'),
    getRefreshToken: () => ipcRenderer.invoke('getRefreshToken'),
    getAccessTokenExpiry: () => ipcRenderer.invoke('getAccessTokenExpiry'),
    getRefreshTokenExpiry: () => ipcRenderer.invoke('getRefreshTokenExpiry'),
    isAccessTokenExpired: () => ipcRenderer.invoke('isAccessTokenExpired'),
    isRefreshTokenExpired: () => ipcRenderer.invoke('isRefreshTokenExpired'),
    clearTokens: () => ipcRenderer.invoke('clearTokens'),
});