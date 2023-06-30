const { BrowserWindow, nativeTheme } = require('electron');
const path = require('path');
const { getSystemTheme, getCurrentTheme } = require('./darkMode');


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

  // Focus on promptInput when the window is ready to show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.executeJavaScript(`
      const promptInput = document.getElementById('promptInput');
      promptInput.focus();
    `);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('theme-updated', getSystemTheme());
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

  // Send the current theme to the settings window
  const currentTheme = getCurrentTheme();
  settingsWindow.webContents.on('did-finish-load', () => {
    settingsWindow.webContents.send('theme-updated', currentTheme);
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
