const randomTexts = [
    "The quick brown fox jumps over the lazy dog",
    "JavaScript is an amazing programming language",
    "Frontend development includes HTML, CSS, and JavaScript",
    "Practice makes perfect when learning to code",
    "Typing speed can be improved with regular practice"
];

let timerInterval;
let timeLeft = 60;
let isTestActive = false;
let correctCharacters = 0;
let totalCharactersTyped = 0;
let wordCount = 0;

// Initialize elements
const randomTextElement = document.getElementById("random-text");
const userInputElement = document.getElementById("user-input");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const startTestButton = document.getElementById("start-test-btn");
const submitTestButton = document.getElementById("submit-test-btn");

// Function to start the test
function startTest() {
    resetTest();

    // Get random text
    setNewPrompt();

    // Enable input and submit button
    userInputElement.disabled = false;
    submitTestButton.disabled = false;
    userInputElement.focus();

    // Start timer
    isTestActive = true;
    timerInterval = setInterval(updateTimer, 1000);
}

// Function to set a new random prompt
function setNewPrompt() {
    const randomText = randomTexts[Math.floor(Math.random() * randomTexts.length)];
    randomTextElement.innerHTML = randomText;
    userInputElement.value = ''; // Clear input field
}

// Function to reset the test
function resetTest() {
    timeLeft = 60;
    correctCharacters = 0;
    totalCharactersTyped = 0;
    wordCount = 0;
    userInputElement.value = '';
    wpmElement.innerText = '0';
    accuracyElement.innerText = '100%';
    timerElement.innerText = timeLeft;
    randomTextElement.innerText = '';
    clearInterval(timerInterval);
    isTestActive = false;
    userInputElement.disabled = true;
    submitTestButton.disabled = true;
}

// Function to update the timer
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerElement.innerText = timeLeft;
    } else {
        endTest();
    }
}

// Function to end the test
function endTest() {
    clearInterval(timerInterval);
    isTestActive = false;
    userInputElement.disabled = true;
    submitTestButton.disabled = true;

    // Calculate WPM
    const wpm = Math.round((wordCount / ((60 - timeLeft) / 60)));
    wpmElement.innerText = wpm;

    // Calculate Accuracy
    const accuracy = Math.round((correctCharacters / totalCharactersTyped) * 100);
    accuracyElement.innerText = accuracy + '%';
}

// Function to handle typing
function handleTyping() {
    if (!isTestActive) return;

    const randomText = randomTextElement.innerText;
    const userText = userInputElement.value;

    // Track total typed characters and correct characters
    correctCharacters = 0;
    totalCharactersTyped = userText.length;

    for (let i = 0; i < userText.length; i++) {
        if (userText[i] === randomText[i]) {
            correctCharacters++;
        }
    }
}

// Function to handle submit test
function submitTest() {
    if (isTestActive) {
        // Calculate words typed
        wordCount += userInputElement.value.trim().split(/\s+/).length;

        // Proceed to next prompt
        setNewPrompt();
    }
}

// Event Listeners
startTestButton.addEventListener("click", startTest);
submitTestButton.addEventListener("click", submitTest);
userInputElement.addEventListener("input", handleTyping);

// Event Listener for Enter key to submit current response
userInputElement.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default form behavior on Enter key
        submitTest(); // Submit the test and load the next prompt
    }
});