const { nativeTheme } = require('electron');
const Store = require('electron-store');

const store = new Store();

// Get the current system theme
function getSystemTheme() {
  return nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
}

// Get the current theme
function getCurrentTheme() {
  return store.get('theme', getSystemTheme());
}


// Toggle the theme
function toggleTheme() {
  const currentTheme = store.get('theme', getSystemTheme());
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  store.set('theme', newTheme);
  return newTheme;
}

// Update the theme in the Electron Store
function updateThemeInStore(theme) {
  store.set('theme', theme);
}

module.exports = {
  getSystemTheme,
  getCurrentTheme,
  toggleTheme,
  updateThemeInStore,
};
