const words = [
    "cold", "fish", "jump", "kind", "lamp", 
    "mild", "port", "ring", "sand", "vest"
];

const hints = {
    "cold": "A low temperature, often associated with winter.",
    "fish": "An aquatic animal that swims and breathes through gills.",
    "jump": "To push oneself off the ground into the air.",
    "kind": "Being nice and considerate toward others.",
    "lamp": "A device that produces light, often used in homes.",
    "mild": "Not extreme or severe, often referring to weather or taste.",
    "port": "A place where ships dock to load or unload cargo.",
    "ring": "A circular band, often worn on a finger.",
    "sand": "Tiny grains of rock found on beaches and in deserts.",
    "vest": "A sleeveless garment worn over a shirt or under a jacket."
};

let hiddenWord;
let guessedWord;
let attempts;
const maxAttempts = 10;
let guessedLetters = []; // Stores all guessed letters

const wordDisplay = document.getElementById('word-display');
const guessInput = document.getElementById('guess-input');
const feedback = document.getElementById('feedback');
const attemptsDisplay = document.getElementById('attempts-remaining'); 
const gameOverDisplay = document.getElementById('game-over');
const tryAgainButton = document.getElementById('try-again');
const playAgainButton = document.getElementById('play-again');
const hintDisplay = document.getElementById('hint'); 
const attemptsContainer = document.getElementById('attempts'); // Display guessed letters

// Function to shuffle a word
function shuffleWord(word) {
    const wordArray = word.split('');
    for (let i = wordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]]; 
    }
    return wordArray.join('');
}

// Function to reset the game
function resetGame() {
    let previousWord = hiddenWord;

    // Pick a new word different from the last one
    do {
        hiddenWord = words[Math.floor(Math.random() * words.length)];
    } while (hiddenWord === previousWord);

    guessedWord = Array(hiddenWord.length).fill('_');
    guessedLetters = []; // Reset guessed letters
    attempts = maxAttempts;  // Start with max attempts
    gameOverDisplay.textContent = '';
    feedback.textContent = '';
    hintDisplay.textContent = hints[hiddenWord]; 
    hintDisplay.classList.add('visible');
    updateDisplay();
    updateAttemptsDisplay();
    guessInput.disabled = false;
    tryAgainButton.style.display = 'none';
    playAgainButton.style.display = 'none';
    attemptsContainer.textContent = 'Guessed Letters: ';
}

// Function to update the word display
function updateDisplay() {
    wordDisplay.textContent = guessedWord.join(' ');
}

// Function to update the attempts display
function updateAttemptsDisplay() {
    attemptsDisplay.textContent = `Attempts Available: ${attempts}`;
}

// Function to check the user's guess
function checkGuess(letter) {
    let correctGuess = false;

    // If letter has already been guessed, don't process again
    if (guessedLetters.includes(letter)) {
        feedback.textContent = `You already guessed "${letter}". Try a different letter!`;
        return;
    }

    guessedLetters.push(letter); // Store guessed letter
    attempts--; // Decrease attempts on every guess
    updateAttemptsDisplay();

    // Check if letter exists in the hidden word
    for (let i = 0; i < hiddenWord.length; i++) {
        if (letter === hiddenWord[i]) {
            guessedWord[i] = letter;
            correctGuess = true;
        }
    }

    updateDisplay();
    updateGuessedLetters(); // Update guessed letters display

    if (!correctGuess) {
        feedback.innerHTML = `<span class="incorrect">"${letter}" is not in the word.</span>`;
    } else {
        feedback.innerHTML = `<span class="correct">"${letter}" is correct!</span>`;
    }

    // Check if the player has guessed the full word
    if (!guessedWord.includes('_')) {
        feedback.textContent = `🎉 Congratulations! You guessed the word "${hiddenWord}".`;
        guessInput.disabled = true;
        playAgainButton.style.display = 'inline-block'; 
    } else if (attempts <= 0) {
        gameOverDisplay.textContent = `😞 Game Over! The word was "${hiddenWord}".`;
        guessInput.disabled = true;
        tryAgainButton.style.display = 'inline-block';
    }
}

// Function to update guessed letters display
function updateGuessedLetters() {
    attemptsContainer.textContent = `Guessed Letters: ${guessedLetters.join(', ')}`;
}

// Function to handle user input
function handleInput() {
    const letter = guessInput.value.toLowerCase();
    
    if (letter.match(/[a-z]/) && letter.length === 1 && attempts > 0) {
        checkGuess(letter);
    }

    // Delay clearing input so the user can see the letter briefly
    setTimeout(() => { guessInput.value = ''; }, 500);
}

// Initialize display and set up the game
resetGame();

// Listen for user input
guessInput.addEventListener('input', handleInput);

// Restart game when "Try Again" or "Play Again" is clicked
tryAgainButton.addEventListener('click', resetGame);
playAgainButton.addEventListener('click', resetGame);
