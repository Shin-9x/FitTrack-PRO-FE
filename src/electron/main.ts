import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './util.js';

//type test = string;

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        title: "Nuovo Nome della tua App", // Cambia il titolo qui
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if(isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }
});