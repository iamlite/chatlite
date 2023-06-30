const createElement = (elementType, className, parentElement) => {
    const element = document.createElement(elementType);
    element.className = className;
    parentElement.appendChild(element);
    return element;
};

const handleError = (error, message, severity = 'error') => {
  const logFunction = {
    warn: console.warn,
    info: console.info,
    error: console.error,
  }[severity] || console.error;

  logFunction(`${severity.charAt(0).toUpperCase() + severity.slice(1)}:`, error);
  renderMessage(message, severity);
  alert(`An error occurred: ${message}`);
};

// Helper function to retrieve DOM elements by ID
const getElementById = (id) => document.getElementById(id);

// Function to populate the input fields with the merged settings
const populateSettingsFields = (settings) => {
  const inputFields = [
    { id: 'apiKey', value: settings.apiKey },
    { id: 'endpointUrl', value: settings.endpointUrl },
    { id: 'modelSelection', value: settings.modelSelection },
    { id: 'temperature', value: settings.temperature },
    { id: 'initialPrompt', value: settings.initialPrompt },
    { id: 'maxTokens', value: settings.maxTokens },
  ];

  inputFields.forEach(({ id, value }) => {
    const inputField = getElementById(id);
    if (inputField) {
      inputField.value = value;
    }
  });
};


const addLoadingAnimation = (avatarDiv) => {
  const loadingElement = createElement('span', 'loading loading-infinity loading-md', avatarDiv);
  console.log('Loading animation added');
}


const removeLoadingAnimation = (avatarDiv) => {
  const loadingSpan = avatarDiv.querySelector('.loading');
  if (loadingSpan) {
    loadingSpan.remove();
    console.log('Loading animation removed');
  }
}


module.exports = {
  createElement,
  handleError,
  getElementById,
  populateSettingsFields,
  addLoadingAnimation,
  removeLoadingAnimation
};
