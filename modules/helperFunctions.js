const createElement = (elementType, className, parentElement) => {
    const element = document.createElement(elementType);
    element.className = className;
    parentElement.appendChild(element);
    return element;
};

const handleError = (error, message, severity = 'error') => {
    switch (severity) {
      case 'warn':
        console.warn("Warning:", error);
        break;
      case 'info':
        console.info("Info:", error);
        break;
      case 'error':
      default:
        console.error("Error:", error);
        break;
    }
    renderMessage(message, severity);
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
  const loadingElement = createElement('span', 'loading loading-infinity loading-md fade-in', avatarDiv);
  console.log('Loading animation added');
}


const removeLoadingAnimation = (avatarDiv) => {
  const loadingSpan = avatarDiv.querySelector('.loading');
  if (loadingSpan) {
    avatarDiv.removeChild(loadingSpan);
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
