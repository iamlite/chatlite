window.addEventListener('DOMContentLoaded', () => {
  const { os, createElement, renderMessage, appendMessage, generate, stop, getSettings, fetchApi, processAPIResponse, sendMessageToAPI, getChatHistory } = window.electron;

  // Get the DOM elements
  const domElements = {
    promptInput: document.getElementById('promptInput'),
    generateBtn: document.getElementById('generateBtn'),
    stopBtn: document.getElementById('stopBtn'),
    chatContainer: document.getElementById('chatContainer'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    lightModeIcon: document.getElementById('lightModeIcon'),
    darkModeIcon: document.getElementById('darkModeIcon'),
    clearButton: document.getElementById('clearButton'),
    settingsButton: document.getElementById('settingsButton')
  };

  // Chat messages and controller
  let messages = []
  let controller = null

  // Retrieve and render chat history
  retrieveAndRenderChatHistory();

  async function retrieveAndRenderChatHistory() {
    const chatHistory = await getChatHistory();
    chatHistory.forEach(message => {
      const { role, content } = message;
      renderMessage(content, role === 'assistant' ? 'ai' : 'user', true, domElements.chatContainer);
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

  domElements.generateBtn.addEventListener('click', () => sendMessageToAPI(domElements.promptInput.value, domElements.chatContainer));
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
      document.documentElement.className = 'dark';
    } else {
      document.documentElement.className = 'light';
    }
  });

  if (window.electron.useSystemTheme()) {
    document.documentElement.className = 'dark';
  } else {
    document.documentElement.className = 'light';
  }
});
