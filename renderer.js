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

  // Clear the chat history in the Electron Store
  ipcRenderer.send("clear-chat-history");
});

