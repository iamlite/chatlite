const { ipcMain, nativeTheme, clipboard } = require('electron');
const path = require('path');
const { createSettingsWindow, settingsWindow } = require('./windowManager');
const Store = require('electron-store');

const store = new Store();

ipcMain.on('save-settings', (event, settings) => {
  store.set('settings', settings);
  event.reply('save-settings-response', 'success');
});

ipcMain.on('retrieve-settings', (event) => {
  const storedSettings = store.get('settings') || {};
  event.reply('retrieve-settings-response', storedSettings);
});

ipcMain.on('open-settings-window', (event, args) => {
  if (!settingsWindow()) {
    createSettingsWindow();
  }
});

ipcMain.handle('open-settings-window', async (event, args) => {
  if (!settingsWindow()) {
    createSettingsWindow();
  }
  return 'success';
});

ipcMain.on('save-message', (event, message) => {
  const chatHistory = store.get('chatHistory') || [];
  chatHistory.push(message);
  store.set('chatHistory', chatHistory);
});

ipcMain.on('copy-to-clipboard', (event, arg) => {
  clipboard.writeText(arg);
});

module.exports = ipcMain;
