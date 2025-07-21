const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const API_KEY =""//Your api key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};

// Helper function to create message elements in the chat
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Function to generate the bot response using the Gemini API
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  // Prepare the body for the API request
  const requestBody = {
    contents: [
      {
        parts: [
          { text: userData.message },
          ...userData.file.data
            ? [{ inline_data: { data: userData.file.data, mime_type: userData.file.mime_type } }]
            : [],
        ],
      },
    ],
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();
    messageElement.innerText = apiResponseText;

    // Speak the response
    speakResponse(apiResponseText);
  } catch (error) {
    console.error(error);
    messageElement.innerText = error.message;
    messageElement.style.color = "#ff0000";
  } finally {
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// Function to speak the response aloud
const speakResponse = (text) => {
  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US"; // Set language, can be changed if needed
  speech.rate = 1; // Set the speech rate (1 is normal speed)
  speech.pitch = 1; // Set the pitch (1 is normal pitch)
  window.speechSynthesis.speak(speech); // Speak the text
};

// Handle outgoing user messages
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim().toLowerCase(); // Convert to lowercase for comparison
  const userMessage = userData.message;

  messageInput.value = ""; // Clear the input field after capturing the message

  // Check for special cases like "hi" or "hello"
  if (userMessage === "hello") {
    const messageContent = `<div class="message-text">${userMessage}</div>`;
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    // Create and display bot's response for "hi" or "hello"
    const botMessageContent = `<div class="message-text">Hello!</div>`; // Custom response
    const incomingMessageDiv = createMessageElement(botMessageContent, "bot-message");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    // Speak the response
    speakResponse("Hello!");

    return; // Stop the regular bot processing
  }
  if (userMessage === "hi") {
    // Create and display the user message
    const messageContent = `<div class="message-text">${userMessage}</div>`;
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    // Create and display bot's response for "hi" or "hello"
    const botMessageContent = `<div class="message-text">Hi!</div>`; // Custom response
    const incomingMessageDiv = createMessageElement(botMessageContent, "bot-message");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    // Speak the response
    speakResponse("Hi!");

    return; // Stop the regular bot processing
  }
  if(userMessage==="what is your name"||userMessage==="tell me your name"||userMessage==="tell me about yourself"
    ||userMessage==="who are you"||userMessage==="about yourself"||userMessage==="who created you"){
      const messageContent = `<div class="message-text">${userMessage}</div>`;
      const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
      chatBody.appendChild(outgoingMessageDiv);
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  
      // Create and display bot's response for "hi" or "hello"
      const botMessageContent = `<div class="message-text">I'm Jacks Bot,your personalized AI asssistent developed by Puppala Madhuvenu and group 1.Archana 2.Sravani 3.Ashish 4.Akash</div>`; // Custom response
      const incomingMessageDiv = createMessageElement(botMessageContent, "bot-message");
      chatBody.appendChild(incomingMessageDiv);
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

      // Speak the response
      speakResponse("I'm Jacks Bot, your personalized AI assistant developed by Puppala Madhuvenu and group 1. Archana, 2. Sravani, 3. Ashish, 4. Akash");

      return; // Stop the regular bot processing
  }

  // If it's not "hi" or "hello", proceed with normal message processing
  // Create and display the user message
  const messageContent = `<div class="message-text"></div>
                          ${
                            userData.file.data
                              ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`
                              : ""
                          }`;
  const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
  outgoingMessageDiv.querySelector(".message-text").textContent = userMessage;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  // Simulate bot response with thinking indicator after a delay
  setTimeout(() => {
    const messageContent = `
      <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
        <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
      </svg>
      <div class="message-text">
        <div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>`;
    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotResponse(incomingMessageDiv);
  }, 600);
};

// Handle Enter key press for sending messages
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage) {
    handleOutgoingMessage(e);
  }
});

// Handle file input change
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64String = e.target.result.split(",")[1];

    // Store file data in userData
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };

    fileInput.value = "";
  };

  reader.readAsDataURL(file);
});

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
