// DOM elements
const gameContainer = document.getElementById('gameContainer');
const resetButton = document.getElementById('resetButton');

// Game variables
const symbols = ['🍎', '🍓', '🍇', '🍅', '🥥', '🫐', '🍊', '🥭', '🍑', '🍉'];
let shuffledSymbols = [...symbols, ...symbols].sort(() => 0.5 - Math.random());
let flippedCards = [],
  matchedCards = 0,
  isBoardLocked = false,
  timer = null,
  seconds = 0,
  bestTime = null;
let timerDisplay, bestTimeDisplay;
/*
// Display puzzle answers in the console
const logMatrixFormat = () => {
  console.log("[PUZZLE ANSWERS]");
  const rows = 5, cols = 4;
  for (let i = 0; i < rows; i++) {
    console.log(shuffledSymbols.slice(i * cols, (i + 1) * cols).join(" "));
  }
};
*/
// Display messages
const displayMessage = (message, type = 'success') => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', type);
  messageDiv.textContent = message;
  gameContainer.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 2500);
};

// Create and shuffle board
const createBoard = () => {
  gameContainer.innerHTML = '';
  shuffledSymbols.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    gameContainer.appendChild(card);
  });
};

// Reset game
const resetGame = (showResetMessage = true) => {
  shuffledSymbols = [...symbols, ...symbols].sort(() => 0.5 - Math.random());
  flippedCards = [];
  matchedCards = 0;
  isBoardLocked = false;
  //logMatrixFormat();
  createBoard();

  // Pause the timer immediately on reset
  stopTimer();

  if (showResetMessage) {
    // Display the reset message for 2.5 seconds
    displayMessage('Game Reset! Start Matching!', 'reset');
    // After 2.5 seconds, reset the timer to 0 and start it again
    setTimeout(() => {
      seconds = 0; // Reset timer to 0
      updateTimerDisplay(); // Update the display
      startTimer(); // Restart the timer
    }, 2500); // 2.5 seconds delay before starting the timer again
  } else {
    // If resetMessage flag is false, just start the game without showing a message
    startTimer();
  }
};

// Flip card
const flipCard = (card) => {
  if (isBoardLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  card.textContent = card.dataset.symbol;
  flippedCards.push(card);
  if (flippedCards.length === 2) {
    isBoardLocked = true;
    setTimeout(checkMatch, 500);
  }
};

// Check if cards match
const checkMatch = () => {
  const [card1, card2] = flippedCards;
  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCards += 2;

    if (matchedCards === shuffledSymbols.length) {
      stopTimer(); // Stop the timer immediately when the game is won
      updateBestTimeDisplay();
      // Delay the message and trigger animations/sound at the same time
      setTimeout(() => {
        // Display congratulations message
        displayMessage(`Congratulations! You matched all the cards in ${seconds} seconds!`);
      }, 500); // Optional delay to make sure the message pops up after a brief pause
      // Reset game after 3 seconds (ensuring flowers and sound are done by then)
      setTimeout(() => resetGame(false), 3000); // 3 seconds after the message shows
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.textContent = '';
    card2.textContent = '';
  }

  flippedCards = [];
  isBoardLocked = false;
};

// Timer functions
const startTimer = () => {
  if (timer) clearInterval(timer);
  seconds = 0;
  updateTimerDisplay();
  timer = setInterval(() => {
    seconds++;
    updateTimerDisplay();
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timer);
  timer = null;
};

const updateTimerDisplay = () => {
  if (timerDisplay) timerDisplay.textContent = `Time: ${seconds}s`;
};

const updateBestTimeDisplay = () => {
  if (bestTime === null || seconds < bestTime) {
    bestTime = seconds;
    if (bestTimeDisplay) bestTimeDisplay.textContent = `Best Time: ${bestTime}s`;
  }
};

// Add event listeners
const findCards = () => {
  gameContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('card')) flipCard(e.target);
  });
  resetButton.addEventListener('click', () => resetGame(true));
};

// Create rules popup
const createRulesPopup = () => {
  const rulesPopup = document.createElement('div');
  rulesPopup.classList.add('rules-popup');
  rulesPopup.innerHTML = `
    <div class="rules-content">
      <h2>Disclaimer</h2>
      <p>Welcome to the <span>Match Mania</span>! The goal of the game is to match all the pairs of cards as quickly as possible.</p>
      <h3>Game Instructions:</h3>
      <p>1️⃣ Click on a card to flip it over.</p>
      <p>2️⃣ Try to find a matching pair of cards.</p>
      <p>3️⃣ If the two flipped cards match, they will stay face up.</p>
      <p>4️⃣ If they don’t match, they will flip back over.</p>
      <p>5️⃣ Repeat until all cards are matched.</p>
      <p>6️⃣ The timer starts as soon as you start the game. The goal is to match all the pairs in the shortest amount of time.</p>
      <button class="start-button" id="startGameButton">Start Game</button>
    </div>
  `;
  document.body.prepend(rulesPopup);
  document.getElementById('startGameButton').addEventListener('click', () => {
    rulesPopup.remove();
    startGame();
  });
};



// Start the game
const startGame = () => {
  createBoard();
  findCards();
  startTimer();
  //logMatrixFormat();
  timerDisplay = document.getElementById('timerDisplay');
  bestTimeDisplay = document.getElementById('bestTimeDisplay');
};

// Initialize the game
const initGame = () => createRulesPopup();

initGame(); // Start initialization


// Function to create the footer dynamically
const createFooter = () => {
  const currentYear = new Date().getFullYear(); // Get current year
  const footerContainer = document.getElementById('footer');
  // Define footer content
  const footerContent = `
     <div class="footer-container">
       <div class="brand">
         <img src="/assets/author.png" alt="Brand Logo">
         <div>
           <h2>Sourov Chandra Adikari</h2>
           <p>Creator & Director</p>
         </div>
       </div>
       <div class="social-links">
         <a href="#" aria-label="Facebook">Facebook</a>
         <a href="#" aria-label="Instagram">Instagram</a>
         <a href="#" aria-label="Whatsapp">Whatsapp</a>
       </div>
       </div>
      <div class="copyright">
         &copy; ${currentYear} Match Mania. All rights reserved.
      </div>`;
  // Add the footer content to the page
  footerContainer.innerHTML = footerContent;
};

// Call the function to create the footer
createFooter();