# ChatLite

dev

## About

Electron app for chatting with the OpenAI API.

Back-and-forth conversation interface.

UI designed with Tailwind CSS and DaisyUI.

Data stored using Electron Store.

## Technologies Used

Electron, Javascript, HTML, Tailwind CSS, DaisyUI, OpenAI API, Electron Store

## Application Structure

```css
chatLite/
├── resources/
│   ├── img/
│   │   ├── sysavatar.png
│   │   └── useravatar.png
│   └── css/
│       └── output.css
└── modules/
    ├── ipcEvents.js // handles all IPC events
    ├── windowManager.js // createWindow, createSettingsWindow
    ├── darkMode.js // toggleDarkMode, updateDarkModeIcon
    ├── settings.js // saveButton + relevant IPCrenderer listeners
    ├── domElements.js // domElements
    ├── helperFunctions.js // createElement, handleError, getElementById, populateSettingsFields
    ├── chatHandler.js // stop, generate, renderMessage, appendMessage
    └── apiHandler.js // getSettings, fetchApi, processAPIResponse, sendMessageToAPI
├── index.html
├── settings.html
├── main.js
├── renderer.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── yarn.lock
```

## Planned Features

prompt library

File upload functionality.

Integration with DALL-E for image generation.
