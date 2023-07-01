const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');
const domElements = require('./modules/domElements');
const createElement = require('./modules/helperFunctions');
const { renderMessage, appendMessage, generate, stop } = require('./modules/chatHandler');
const { getSettings, fetchApi, processAPIResponse, sendMessageToAPI, getChatHistory } = require('./modules/apiHandler');

contextBridge.exposeInMainWorld('electron', {
  openSettingsWindow: () => ipcRenderer.invoke('open-settings-window'),
  saveChatHistory: () => ipcRenderer.invoke('save-chat-history'),
  clearChatHistory: () => ipcRenderer.invoke('clear-chat-history'),
  toggleDarkMode: () => ipcRenderer.invoke('dark-mode:toggle'),
  useSystemTheme: () => ipcRenderer.invoke('dark-mode:system'),
  os,
  domElements,
  createElement,
  renderMessage,
  appendMessage,
  generate,
  stop,
  getSettings,
  fetchApi,
  processAPIResponse,
  sendMessageToAPI,
  getChatHistory
});
