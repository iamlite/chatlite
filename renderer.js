// Required modules
const os = require('os')
const ipcRenderer = window.electron;

// Custom modules
const domElements = require('./modules/domElements')
const createElement = require('./modules/helperFunctions')
const { renderMessage, appendMessage, generate, stop } = require('./modules/chatHandler')
const { getSettings, fetchApi, processAPIResponse, sendMessageToAPI } = require('./modules/apiHandler')

// Chat messages and controller
let messages = []
let controller = null

// Retrieve and render chat history
retrieveAndRenderChatHistory();

async function retrieveAndRenderChatHistory() {
  const { getChatHistory } = require('./modules/apiHandler');
  const chatHistory = await getChatHistory();
  chatHistory.forEach(message => {
    const { role, content } = message;
    renderMessage(content, role === 'assistant' ? 'ai' : 'user', true);
  });
}

document.getElementById('saveChatButton').addEventListener('click', () => {
  ipcRenderer.send('save-chat-history');
});

// Event listeners
domElements.promptInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Prevent the default Enter behavior (submitting a form or creating a new line)
    generate();
  }
});

domElements.generateBtn.addEventListener('click', generate)
domElements.stopBtn.addEventListener('click', stop)
domElements.settingsButton.addEventListener('click', () => window.electron.openSettingsWindow());
domElements.clearButton.addEventListener('click', () => {
  domElements.chatContainer.innerHTML = '';
  messages = [];

  // Clear the chat history in the Electron Store
  ipcRenderer.send("clear-chat-history");
});

document.getElementById('darkModeToggle').addEventListener('click', () => {
  const darkModeOn = window.electron.toggleDarkMode();
  if (darkModeOn) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  if (window.electron.useSystemTheme()) {
    document.documentElement.className = 'dark';
  } else {
    document.documentElement.className = 'light';
  }
});
