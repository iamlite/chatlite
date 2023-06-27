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

// Handle retrieve-chat-history IPC event
ipcMain.on("retrieve-chat-history", (event) => {
  const chatHistory = store.get("chatHistory", []); // Get the chat history from the store
  event.reply("retrieve-chat-history-response", chatHistory); // Send the chat history to the renderer process
});

// Handle update-chat-history IPC event
ipcMain.on("update-chat-history", (event, message) => {
  let chatHistory = store.get("chatHistory", []); // Get the chat history from the store
  chatHistory.push(message); // Add the new message to the chat history
  store.set("chatHistory", chatHistory); // Update the chat history in the store
});

// Handle clear-chat-history IPC event
ipcMain.on("clear-chat-history", () => {
  store.set("chatHistory", []); // Clear the chat history in the store
});


module.exports = ipcMain;
