// Required modules
const os = require('os')
const { ipcRenderer, clipboard } = require('electron')

// Custom modules
const domElements = require('./modules/domElements')
const darkMode = require('./modules/darkMode')
const createElement = require('./modules/helperFunctions')
const { renderMessage, appendMessage, generate, stop } = require('./modules/chatHandler')
const { getSettings, fetchApi, processAPIResponse, sendMessageToAPI } = require('./modules/apiHandler')

// Chat messages and controller
let messages = []
let controller = null

// Event listeners
domElements.promptInput.addEventListener('keyup', event => { if (event.key === 'Enter') { generate() } })
domElements.generateBtn.addEventListener('click', generate)
domElements.stopBtn.addEventListener('click', stop)
domElements.settingsButton.addEventListener('click', () => ipcRenderer.invoke('open-settings-window') )
domElements.clearButton.addEventListener('click', () => {
  domElements.chatContainer.innerHTML = '';
  messages = [];

  document.addEventListener('DOMContentLoaded', (event) => {
    // Load the chat history when the application starts
    loadChatHistory();
});

// Load the chat history from the Electron Store and render it in the chat container
const loadChatHistory = () => {
  const chatHistory = store.get('chatHistory', []);
  chatHistory.forEach(message => {
    const { role, content } = message;
    appendMessage(content, role);
  });
};


  // Clear the chat history in the Electron Store
  ipcRenderer.send("clear-chat-history");
});

