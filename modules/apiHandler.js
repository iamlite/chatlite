// Import required modules
const { appendMessage, renderMessage } = require("./chatHandler");
const { handleError, removeLoadingAnimation } = require("./helperFunctions");
const domElements = require("./domElements");
const { ipcRenderer } = require("electron");
const MarkdownIt = require('markdown-it');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Create a new JSDOM instance
const window = new JSDOM('').window;
const DOMPurifyInstance = DOMPurify(window);

// Create a new MarkdownIt instance 
const md = new MarkdownIt();

// Function to retrieve chat history from the main process
const getChatHistory = async () => {
  console.log("Sending request to retrieve chat history...");
  ipcRenderer.send("retrieve-chat-history");

  return new Promise((resolve) => {
    // Listen for the response from the main process
    ipcRenderer.once("retrieve-chat-history-response", (event, chatHistory) => {
      console.log("Received chat history:", chatHistory);
      resolve(chatHistory);
    });
  });
};

// Function to retrieve settings from the renderer process
const getSettings = async () => {
  return new Promise((resolve) => {
    // Send request to retrieve settings
    ipcRenderer.send("retrieve-settings");

    // Listen for the response from the renderer process
    ipcRenderer.once("retrieve-settings-response", (event, settings) => {
      resolve(settings);
    });
  });
};

// Function to fetch data from the API
const fetchApi = async (settings, messages, controller) => {
  // Send a POST request to the API endpoint with the provided settings and messages
  console.log(messages);
  const response = await fetch(settings.endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.modelSelection,
      messages: [
        {
          role: "system",
          content: settings.initialPrompt || "You are a helpful assistant.",
        },
        ...messages,
      ],
      max_tokens: parseInt(settings.maxTokens) || 400,
      temperature: parseFloat(settings.temperature) || 0.5,
      stream: true,
    }),
    signal: controller.signal,
  });

  return response;
};

// Process the API response and render AI responses in the chat container
const processAPIResponse = async (response, controller) => {
  if (!response.ok) {
    handleError("API error:", response.statusText);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let lastAIMessageDiv = null;
  let aiResponse = ""; // Initialize the AI's response

  // Render an AI response in the chat container
  const renderAIResponse = (response) => {
    let bubbleDiv;
    if (lastAIMessageDiv) {
      bubbleDiv = lastAIMessageDiv.querySelector(".chat-bubble");
      bubbleDiv.innerHTML += DOMPurifyInstance.sanitize(md.render(response));
    } else {
      lastAIMessageDiv = appendMessage(response, "ai");
      lastAIMessageDiv.id = "replyBubble";
      bubbleDiv = lastAIMessageDiv.querySelector(".chat-bubble");
      bubbleDiv.innerHTML = DOMPurifyInstance.sanitize(md.render(response));
    }

    chatContainer.appendChild(lastAIMessageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    aiResponse += response; // Accumulate the AI's response

    };
    
// Read the data stream and process AI responses
const readStreamData = async () => {
  let aiResponse = ""; // Initialize the AI response variable
  let lastAIMessageDiv = null; // Initialize the last AI message element

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");
    const parsedLines = lines
      .map((line) => line.replace(/^data: /, "").trim())
      .filter((line) => line !== "" && line !== "[DONE]")
      .map((line) => JSON.parse(line)); // Parse the line as JSON

    // handle multiple promises
    const promiseResults = await Promise.allSettled(
      parsedLines.map((parsedLine) => {
        const { choices } = parsedLine;
        const { delta } = choices[0];
        const { content } = delta;
        if (content) {
          aiResponse += content; // Accumulate the AI's response
          if (!lastAIMessageDiv) {
            lastAIMessageDiv = appendMessage(content, "ai");
          } else {
            // Update the existing AI message with the accumulated response
            const bubbleDiv = lastAIMessageDiv.querySelector(".chat-bubble");
            bubbleDiv.innerHTML = DOMPurifyInstance.sanitize(md.render(aiResponse));
          }
        }
      })
    );

    // check for errors and handle them accordingly
    promiseResults.forEach((result, idx) => {
      if (result.status === "rejected") {
        handleError(result.reason, `Error occurred in promise #${idx + 1}`);
      }
    });

    // If the "[DONE]" message is received, render the entire AI response as markdown
    if (lines.includes("[DONE]")) {
      if (lastAIMessageDiv) {
        const bubbleDiv = lastAIMessageDiv.querySelector(".chat-bubble");
        bubbleDiv.innerHTML = DOMPurifyInstance.sanitize(md.render(aiResponse));
      }
      aiResponse = ""; // Reset the AI's response
      lastAIMessageDiv = null; // Reset the last AI message element
    }
  }

    // Update the chat history when the entire AI's response has been read from the stream
    ipcRenderer.send("update-chat-history", {
      role: "assistant",
      content: aiResponse,
    });

    // Reset the AI's response
    aiResponse = "";

    // Remove the loading animation after all data has been read
    removeLoadingAnimation(lastAIMessageDiv.querySelector(".chat-image"));
  };

  // Start reading the data stream
  try {
    await readStreamData();
  } catch (error) {
    if (controller && controller.signal.aborted) {
      const errorMessageDiv = appendMessage("Request aborted.", "error");
      errorMessageDiv.classList.add("chat-bubble", "error");
    } else {
      handleError(error, "Error occurred while generating.");
    }
  } finally {
    domElements.generateBtn.disabled = false;
    domElements.stopBtn.disabled = true;
  }
};

// Send message to OpenAI API
const sendMessageToAPI = async (message) => {
  const settings = await getSettings();
  const chatHistory = await getChatHistory(); // Retrieve the chat history

  console.log('Sending message to API');
  domElements.generateBtn.disabled = true;
  domElements.stopBtn.disabled = false;
  const controller = new AbortController();

  try {
    console.log('Fetching API');
    const response = await fetchApi(settings, chatHistory, controller);
    await processAPIResponse(response, controller);
  } catch (error) {
    console.error('Error occurred while generating:', error);
    handleError(error, "Error occurred while generating.");
  } finally {
    console.log('API request completed');
    domElements.generateBtn.disabled = false;
    domElements.stopBtn.disabled = true;
  }
};

// Export the functions and variables for external usage
module.exports = {
  getSettings,
  fetchApi,
  processAPIResponse,
  sendMessageToAPI,
  getChatHistory,
};
