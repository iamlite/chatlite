const Electron = require("electron");
const Store = require("electron-store");
const { handleError, getElementById, populateSettingsFields } = require('./modules/helperFunctions');
const fs = require('fs');
const path = require('path');

let ipcRenderer, store;

// Initialize ipcRenderer and store
ipcRenderer = Electron.ipcRenderer;
store = new Store();

// Check the dark mode setting and apply it
const shouldUseDarkColors = store.get('darkMode', false);
document.documentElement.classList.toggle('dark', shouldUseDarkColors);

// Send a request to retrieve the stored settings from the main process
ipcRenderer.send('retrieve-settings');

// Listen for the retrieved settings
ipcRenderer.on('retrieve-settings-response', (event, settings) => {
  // Default settings
  const defaultSettings = {
    apiKey: 'sk-youropenaiapikeygoeshere',
    endpointUrl: 'https://api.openai.com/v1/chat/completions',
    modelSelection: 'gpt-3.5-turbo',
    temperature: '0.5',
    initialPrompt: 'You are a helpful assistant.',
    maxTokens: '400',
  };

  // Merge the default settings with the retrieved settings
  const mergedSettings = { ...defaultSettings, ...settings };

  // Populate the input fields with the merged settings
  populateSettingsFields(mergedSettings);
});

// Save the settings when the Save button is clicked
const saveButton = getElementById('saveButton');
if (saveButton) {
  saveButton.addEventListener('click', () => {
    // Retrieve the input values
    const inputFields = [
      'apiKey',
      'endpointUrl',
      'modelSelection',
      'temperature',
      'initialPrompt',
      'maxTokens',
    ];

    const settings = inputFields.reduce((acc, id) => {
      const inputField = getElementById(id);
      if (inputField) {
        acc[id] = inputField.value;
      }
      return acc;
    }, {});

    // Send the settings to the main process for storage
    ipcRenderer.send('save-settings', settings);
  });
}

const promptsPath = path.join(__dirname, './resources/prompts.json');
const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

const promptsSelect = getElementById('premadePrompts');
prompts.forEach(prompt => {
  const option = document.createElement('option');
  option.value = prompt.content;
  option.text = prompt.title;
  promptsSelect.appendChild(option);
});

promptsSelect.addEventListener('change', () => {
  const initialPromptTextarea = getElementById('initialPrompt');
  initialPromptTextarea.value = promptsSelect.value;
});

module.exports = {
  saveButton,
  promptsSelect,
};
