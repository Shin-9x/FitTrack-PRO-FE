import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
//import {fileURLToPath} from 'url';
import { isDev } from './util.js';
import * as keyHelper from './keyHelper.js';
import { getPreloadPath } from './pathResolver.js';

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        title: "FitTracker PRO",
        webPreferences: {
            contextIsolation: true,
            preload: getPreloadPath(),
        },
    });

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }

    // Imposta i listener per il keyHelper
    ipcMain.handle('saveTokens', (_event, accessToken, refreshToken, expiryAccessToken, expiryRefreshToken) =>
        keyHelper.saveTokens(accessToken, refreshToken, expiryAccessToken, expiryRefreshToken)
    );

    ipcMain.handle('saveAccessToken', (_event, token, expiry) =>
        keyHelper.saveAccessToken(token, expiry)
    );

    ipcMain.handle('saveRefreshToken', (_event, token, expiry) =>
        keyHelper.saveRefreshToken(token, expiry)
    );

    ipcMain.handle('getAccessToken', keyHelper.getAccessToken);
    ipcMain.handle('getRefreshToken', keyHelper.getRefreshToken);
    ipcMain.handle('getAccessTokenExpiry', keyHelper.getAccessTokenExpiry);
    ipcMain.handle('getRefreshTokenExpiry', keyHelper.getRefreshTokenExpiry);
    ipcMain.handle('isAccessTokenExpired', keyHelper.isAccessTokenExpired);
    ipcMain.handle('isRefreshTokenExpired', keyHelper.isRefreshTokenExpired);
    ipcMain.handle('clearTokens', keyHelper.clearTokens);
});