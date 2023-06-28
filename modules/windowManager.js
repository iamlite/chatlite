const { BrowserWindow, nativeTheme } = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();

let mainWindow = null;
let settingsWindow = null;

function createWindow() {
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    frame: false,
    titleBarStyle: 'hidden',
    opacity: 0.99,
    icon: path.resolve(__dirname, 'resources', 'img', 'icon.icns'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.on('did-finish-load', () => {
    const shouldUseDarkColors = store.get('darkMode', false);
    mainWindow.webContents.send('dark-mode', shouldUseDarkColors);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}


function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 800,
    height: 700,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
    },
    parent: mainWindow,
    modal: true,
    icon: path.resolve(__dirname, 'resources', 'img', 'icon.icns'),
  });

  settingsWindow.loadFile('settings.html');

  settingsWindow.webContents.on('did-finish-load', () => {
    const shouldUseDarkColors = store.get('darkMode', false);
    settingsWindow.webContents.send('dark-mode', shouldUseDarkColors);
  });

  settingsWindow.on('blur', () => {
    settingsWindow.close();
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

module.exports = {
  createWindow,
  createSettingsWindow,
  settingsWindow: () => settingsWindow,
};