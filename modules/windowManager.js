const { BrowserWindow, nativeTheme } = require('electron');
const path = require('path');



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
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, '..', 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  // Focus on promptInput when the window is ready to show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.executeJavaScript(`
      const promptInput = document.getElementById('promptInput');
      promptInput.focus();
    `);
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
