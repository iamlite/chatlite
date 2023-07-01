const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openSettingsWindow: () => ipcRenderer.invoke('open-settings-window'),
  saveChatHistory: () => ipcRenderer.invoke('save-chat-history'),
  clearChatHistory: () => ipcRenderer.invoke('clear-chat-history'),
  toggleDarkMode: () => ipcRenderer.invoke('dark-mode:toggle'),
  useSystemTheme: () => ipcRenderer.invoke('dark-mode:system')
});
