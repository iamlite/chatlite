const { app, BrowserWindow, ipcMain, nativeTheme, clipboard } = require('electron');
const Store = require('electron-store');
const path = require('path');
const { createWindow, createSettingsWindow } = require('./modules/windowManager');
const ipcEvents = require('./modules/ipcEvents');


const store = new Store();


let mainWindow = null;
let settingsWindow = null; // Reference to the settings window

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

