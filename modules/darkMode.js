const { ipcRenderer } = require('electron');
const domElements = require('./domElements');
const Store = require('electron-store');

// Update the dark mode icon based on the current mode
const updateDarkModeIcon = (shouldUseDarkColors) => {
  if (domElements.lightModeIcon && domElements.darkModeIcon) {
    domElements.lightModeIcon.classList.toggle('hidden', shouldUseDarkColors);
    domElements.darkModeIcon.classList.toggle('hidden', !shouldUseDarkColors);
  }
};

// Toggle dark mode
const toggleDarkMode = () => {
  const shouldUseDarkColors = document.documentElement.classList.toggle('dark');
  updateDarkModeIcon(shouldUseDarkColors);
  store.set('darkMode', shouldUseDarkColors);
};

// Event listener for dark mode toggle
if (domElements.darkModeToggle) {
  domElements.darkModeToggle.addEventListener('click', toggleDarkMode);
}

// Event listener for 'dark-mode' event from main process
ipcRenderer.on('dark-mode', (event, shouldUseDarkColors) => {
  console.log('Received dark-mode event:', shouldUseDarkColors);
  document.documentElement.classList.toggle('dark', shouldUseDarkColors);
  updateDarkModeIcon(shouldUseDarkColors);
});

module.exports = {
  toggleDarkMode,
  updateDarkModeIcon
};
