const os = require('os')
const { clipboard } = require('electron')
const domElements = require('./domElements')
const { createElement, handleError,addLoadingAnimation,removeLoadingAnimation } = require('./helperFunctions')
const MarkdownIt = require('markdown-it');

const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurifyInstance = DOMPurify(window);

const md = new MarkdownIt();



// Render a message in the chat container
const renderMessage = (content, sender, isLoadingFromHistory = false, chatContainer) => {
  const messageDiv = appendMessage(content, sender, isLoadingFromHistory)
  messageDiv.classList.add('fade-in')
  chatContainer.appendChild(messageDiv)
  chatContainer.scrollTop = chatContainer.scrollHeight
}

// Append a chat message to the chat container
const appendMessage = (message, sender, isLoadingFromHistory = false) => {
  const bubbleDiv = createElement('div', `chat chat-${sender === 'ai' ? 'start' : 'end'} relative`, domElements.chatContainer)

  // Add image
  const avatarDiv = createElement('div', 'chat-image avatar relative', bubbleDiv)
  const avatarImgDiv = createElement('div', 'w-10 h-10 rounded-full overflow-hidden', avatarDiv)
  avatarImgDiv.style.width = '40px'
  avatarImgDiv.style.height = '40px'
  const avatarImg = createElement('img', 'object-cover w-full h-full', avatarImgDiv)
  avatarImg.src = sender === 'ai' ? 'Resources/img/sysavatar.png' : 'resources/img/useravatar.png'

  // Add header
  const headerDiv = createElement('div', 'chat-header', bubbleDiv)
  headerDiv.textContent = `${sender === 'ai' ? 'OpenAI' : os.userInfo().username} - `
  const headerTime = createElement('time', 'text-xs opacity-50', headerDiv)
  headerTime.textContent = new Date().toLocaleTimeString()

  // Add chat bubble

  const textDiv = createElement('div', `chat-bubble ${sender === 'ai' ? 'chat-bubble-secondary' : 'chat-bubble-primary'} markdown-body`, bubbleDiv);

  // Parse the message as markdown, sanitize it, and set it as the innerHTML of the textDiv
  const sanitizedHTML = DOMPurifyInstance.sanitize(md.render(message));
  textDiv.innerHTML = sanitizedHTML;

  // Add this line to apply PrismJS highlighting to the newly added content
  Prism.highlightAllUnder(textDiv);


  if (sender === 'ai' && !isLoadingFromHistory && message !== "Request aborted.") {
    addLoadingAnimation(avatarDiv);
  }

  // Add footer
  const footerDiv = createElement('div', 'chat-footer pt-2 opacity-50', bubbleDiv)
  if (sender === 'ai') {
    const copyButton = createElement('button', 'btn btn-xs', footerDiv)
    copyButton.textContent = 'Copy'
    copyButton.addEventListener('click', () => {
      clipboard.writeText(textDiv.innerText)
    })
  }
  
  // After appending a new message, adjust the scroll position
  domElements.chatContainer.scrollTop = domElements.chatContainer.scrollHeight - domElements.chatContainer.clientHeight;

  return bubbleDiv
}


// Stop the chat generation process
const stop = () => {
  if (domElements.controller) {
    domElements.controller.abort()
    domElements.controller = null

    // Select the avatar div with the loading animation
    const avatarDivWithLoadingAnimation = document.querySelector(".chat-image.avatar .loading.loading-infinity.loading-md").parentNode;

    // Remove the loading animation from the avatar div
    removeLoadingAnimation(avatarDivWithLoadingAnimation);
  }
}

// Generate the chat response
const generate = async () => {
  if (!domElements.promptInput.value) {
    alert('Please enter a prompt.')
    return
  }

  const userMessage = { role: 'user', content: domElements.promptInput.value }
  renderMessage(userMessage.content, 'user')
  domElements.promptInput.value = ''

  // Update the chat history
  ipcRenderer.send("save-or-update-chat-history", userMessage);

  try {
    // Import sendMessageToAPI from its module
    const { sendMessageToAPI } = require('./apiHandler')
    await sendMessageToAPI(userMessage)
  } catch (error) {
    handleError(error, "Error occurred while generating response.")
  }
}


module.exports = {
  renderMessage,
  appendMessage,
  stop,
  generate
}
