// Check if SpeechRecognition is supported by the browser
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Set the language for speech recognition (optional, defaults to English)
    recognition.lang = 'en-US';

    // Enable continuous listening
    recognition.continuous = true;

    // When recognition starts
    recognition.onstart = function () {
        console.log("Voice recognition started. Speak now.");
    };

    // When speech is recognized
    recognition.onresult = function (event) {
        let transcript = event.results[event.resultIndex][0].transcript;
        console.log("Recognized: ", transcript);
        processChatInput(transcript);  // Process recognized speech input

        // Automatically stop the recognition after input is received
        recognition.stop();
    };

    // Handle errors
    recognition.onerror = function (event) {
        console.error("Error occurred in recognition: " + event.error);
    };

    // Function to start voice recognition
    function startRecognition() {
        recognition.start();
    }

    // Function to stop voice recognition (for manual stop, if needed)
    function stopRecognition() {
        recognition.stop(); // Stops the speech recognition
        console.log("Voice recognition stopped.");
    }

    // Function to send input to the API and process the output
    async function processChatInput(input) {
        const chatBox = document.getElementById("chat-box");

        // Display user's input in the chat box
        chatBox.innerHTML += `<div class="input"><strong>You:</strong> ${input}</div>`;

        try {
            // Get the response from the API
            const apiResponse = await fetchAPIResponse(input);

            // Speak the API response aloud
            speakResponse(apiResponse);

            // Display the response in the chat box after speaking it
            chatBox.innerHTML += `<div class="responsediv" style="background-color:blue"><strong>Bot:</strong> ${apiResponse}</div>`;
        } catch (error) {
            console.error("Error processing input: ", error);
            const errorMessage = "Sorry, I couldn't understand that.";

            // Speak the error message aloud
            speakResponse(errorMessage);

            // Display the error message in the chat box
            chatBox.innerHTML += `<div class="response" style="background-color:  #2678b3"><strong>Bot:</strong> ${errorMessage}</div>`;
        }

        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to interact with the API (replace with actual API)
    async function fetchAPIResponse(input) {
        const API_KEY = 'AIzaSyC6-9bN1M7dWC0n1E7jaeBpz8KjAm4pgSQ';  // Replace with your actual API key
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const requestBody = {
            contents: [
                {
                    parts: [{ text: input }]
                }
            ]
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        };

        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        return apiResponseText;
    }

    // Function to speak the response using the Web Speech API
    function speakResponse(response) {
        // Cancel any ongoing speech before starting a new one
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(response);
        speech.lang = 'en-US';  // Set the language for the speech
        speech.rate = 1;  // Set the speech rate (1 is normal speed)
        speech.pitch = 1;  // Set the pitch (1 is normal pitch)
        window.speechSynthesis.speak(speech);
    }

    // Start voice recognition when the page loads
    startRecognition();
} else {
    alert("Speech recognition or synthesis is not supported in your browser.");
}
