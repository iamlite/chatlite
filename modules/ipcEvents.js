const { ipcMain, nativeTheme, clipboard, app, dialog, } = require('electron');
const path = require('path');
const { createSettingsWindow, settingsWindow } = require('./windowManager');
const Store = require('electron-store');
const fs = require('fs');

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

ipcMain.on('copy-to-clipboard', (event, arg) => {
  clipboard.writeText(arg);
});

// Handle retrieve-chat-history IPC event
ipcMain.on("retrieve-chat-history", (event) => {
  const chatHistory = store.get("chatHistory", []); // Get the chat history from the store
  event.reply("retrieve-chat-history-response", chatHistory); // Send the chat history to the renderer process
});

ipcMain.on("save-or-update-chat-history", (event, message) => {
  console.log("Received message:", message);

  let chatHistory = store.get("chatHistory", []); // Get the chat history from the store
  console.log("Current chat history:", chatHistory);

  chatHistory.push(message); // Add the new message to the chat history
  console.log("Updated chat history:", chatHistory);

  store.set("chatHistory", chatHistory); // Update the chat history in the store
  console.log("Chat history saved in the store");
});


// Handle clear-chat-history IPC event
ipcMain.on("clear-chat-history", () => {
  store.set("chatHistory", []); // Clear the chat history in the store
});
ipcMain.on('save-chat-history', async (event) => {
  console.log('Saving chat history...');

  let chatHistory = store.get('chatHistory', []); // Get the chat history from the store
  console.log('Retrieved chat history:', chatHistory);

  let chatHistoryStr = chatHistory.map(message => `${message.role}: ${message.content}`).join('\n'); // Convert the chat history to a string
  console.log('Converted chat history to string:', chatHistoryStr);

  // Open a save dialog and get the chosen file path
  let { filePath } = await dialog.showSaveDialog({
    defaultPath: path.join(app.getPath('desktop'), 'chatHistory.txt'),
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });
  console.log('Chosen file path:', filePath);

  // If the user didn't cancel the dialog, save the chat history to the chosen file
  if (filePath) {
    fs.writeFile(filePath, chatHistoryStr, (err) => {
      if (err) {
        console.error('Failed to save chat history:', err);
      } else {
        console.log('Chat history saved successfully');
      }
    });
  } else {
    console.log('Save dialog cancelled by the user');
  }
  
});
ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system';
});


module.exports = ipcMain;
