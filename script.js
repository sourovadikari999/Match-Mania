// DOM elements
const gameContainer = document.getElementById('gameContainer');
const resetButton = document.getElementById('resetButton');

// Game variables
const symbols = ['🍎', '🍓', '🍇', '🍅', '🥥', '🫐', '🍊', '🥭', '🍑', '🍉'];
let shuffledSymbols = [...symbols, ...symbols].sort(() => 0.5 - Math.random());
let flippedCards = [];
const gameState = {
  matchedCards: 0,
  boardLocked: false,
  showingMessage: false,
  timer: null,
  seconds: 0,
  bestTime: null,
  timerDisplay: null,
  bestTimeDisplay: null,
};

// Display messages
const displayMessage = (message, type = 'success', duration = 2500) => {
  gameState.showingMessage = true;
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', type);
  messageDiv.textContent = message;
  gameContainer.appendChild(messageDiv);

  // Disable reset button while the message is displayed
  resetButton.disabled = true;

  // Remove the message after the specified duration
  setTimeout(() => {
    messageDiv.remove();
    gameState.showingMessage = false;

    // Re-enable reset button after the message is gone
    resetButton.disabled = false;
  }, duration);
};

// Create and shuffle board
const createBoard = () => {
  gameContainer.innerHTML = '';
  shuffledSymbols.forEach((symbol) => {
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
  gameState.matchedCards = 0;
  gameState.boardLocked = false;

  createBoard();
  stopTimer();

  if (showResetMessage) {
    displayMessage('Game Reset! Start Matching!', 'reset', 3000); // 3-second reset message
    setTimeout(() => {
      gameState.seconds = 0;
      updateTimerDisplay();
      startTimer();
    }, 3000);
  } else {
    startTimer();
  }
};

// Flip card
const flipCard = (card) => {
  if (gameState.boardLocked || gameState.showingMessage || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  card.textContent = card.dataset.symbol;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    gameState.boardLocked = true;
    setTimeout(checkMatch, 500); // 0.5-second delay for match checking
  }
};

// Check if cards match
const checkMatch = () => {
  const [card1, card2] = flippedCards;
  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    gameState.matchedCards += 2;

    if (gameState.matchedCards === shuffledSymbols.length) {
      stopTimer();
      updateBestTimeDisplay();
      setTimeout(() => {
        displayMessage(`Congratulations! You matched all the cards in ${gameState.seconds} seconds!`, 'success', 5000); // 5-second success message
      }, 500);
      setTimeout(() => resetGame(false), 5000); // 5 seconds after message for reset
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.textContent = '';
    card2.textContent = '';
  }

  flippedCards = [];
  gameState.boardLocked = false;
};

// Timer functions
const startTimer = () => {
  if (gameState.timer) clearInterval(gameState.timer);
  gameState.seconds = 0;
  updateTimerDisplay();
  gameState.timer = setInterval(() => {
    gameState.seconds++;
    updateTimerDisplay();
  }, 1000);
};

const stopTimer = () => {
  clearInterval(gameState.timer);
  gameState.timer = null;
};

const updateTimerDisplay = () => {
  if (gameState.timerDisplay) gameState.timerDisplay.textContent = `Time: ${gameState.seconds}s`;
};

const updateBestTimeDisplay = () => {
  if (gameState.bestTime === null || gameState.seconds < gameState.bestTime) {
    gameState.bestTime = gameState.seconds;
    if (gameState.bestTimeDisplay) gameState.bestTimeDisplay.textContent = `Best Time: ${gameState.bestTime}s`;
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
    initGame();
  });
};

// Create footer dynamically
const createFooter = () => {
  const currentYear = new Date().getFullYear();
  const footerContainer = document.getElementById('footer');
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
  footerContainer.innerHTML = footerContent;
};

// Initialize the game
const initGame = () => {
  createBoard();
  findCards();
  startTimer();
  gameState.timerDisplay = document.getElementById('timerDisplay');
  gameState.bestTimeDisplay = document.getElementById('bestTimeDisplay');
};

// Start the app
const startApp = () => {
  createRulesPopup();
  createFooter();
};

startApp(); // Run the app

