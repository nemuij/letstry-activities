// Elements
const gameBoard = document.getElementById('gameBoard');
const resetBtn = document.getElementById('resetBtn');
const winMessage = document.getElementById('winMessage');

// Game state
let flippedCards = [];
let lockBoard = false;
const TOTAL_PAIRS = 6; // Number of pairs per game

// 26 total images
const cardsData = [
  { id: 'a', content: 'images/A1.png' },
  { id: 'a', content: 'images/A2.png' },

  { id: 'b', content: 'images/B1.png' },
  { id: 'b', content: 'images/B2.png' },

  { id: 'c', content: 'images/C1.png' },
  { id: 'c', content: 'images/C2.png' },

  { id: 'd', content: 'images/D1.png' },
  { id: 'd', content: 'images/D2.png' },

  { id: 'e', content: 'images/E1.png' },
  { id: 'e', content: 'images/E2.png' },

  { id: 'f', content: 'images/F1.png' },
  { id: 'f', content: 'images/F2.png' },

  { id: 'g', content: 'images/G1.png' },
  { id: 'g', content: 'images/G2.png' },

  { id: 'h', content: 'images/H1.png' },
  { id: 'h', content: 'images/H2.png' },

  { id: 'i', content: 'images/I1.png' },
  { id: 'i', content: 'images/I2.png' },

  { id: 'j', content: 'images/J1.png' },
  { id: 'j', content: 'images/J2.png' },

  { id: 'k', content: 'images/K1.png' },
  { id: 'k', content: 'images/K2.png' },

  { id: 'l', content: 'images/L1.png' },
  { id: 'l', content: 'images/L2.png' },

  { id: 'm', content: 'images/M1.png' },
  { id: 'm', content: 'images/M2.png' },

  { id: 'n', content: 'images/N1.png' },
  { id: 'n', content: 'images/N2.png' },

  { id: 'o', content: 'images/O1.png' },
  { id: 'o', content: 'images/O2.png' },

  { id: 'p', content: 'images/P1.png' },
  { id: 'p', content: 'images/P2.png' },

  { id: 'q', content: 'images/Q1.png' },
  { id: 'q', content: 'images/Q2.png' },

  { id: 'r', content: 'images/R1.png' },
  { id: 'r', content: 'images/R2.png' },

  { id: 's', content: 'images/S1.png' },
  { id: 's', content: 'images/S2.png' },

  { id: 't', content: 'images/T1.png' },
  { id: 't', content: 'images/T2.png' },

  { id: 'u', content: 'images/U1.png' },
  { id: 'u', content: 'images/U2.png' },

  { id: 'v', content: 'images/V1.png' },
  { id: 'v', content: 'images/V2.png' },

  { id: 'w', content: 'images/W1.png' },
  { id: 'w', content: 'images/W2.png' },

  { id: 'x', content: 'images/X1.png' },
  { id: 'x', content: 'images/X2.png' },

  { id: 'y', content: 'images/Y1.png' },
  { id: 'y', content: 'images/Y2.png' },

  { id: 'z', content: 'images/Z1.png' },
  { id: 'z', content: 'images/Z2.png' },
];

// Initialize game
initGame();
resetBtn.addEventListener('click', initGame);

// --- Functions ---
function initGame() {
  gameBoard.innerHTML = '';
  flippedCards = [];
  lockBoard = false;
  winMessage.classList.add('hidden');

  // Extract unique ids
  const uniqueIds = [...new Set(cardsData.map(c => c.id))];

  // Pick random pairs
  const selectedIds = shuffle(uniqueIds).slice(0, TOTAL_PAIRS);

  // Get all cards for selected ids (each id appears twice)
  const gameCards = cardsData.filter(c => selectedIds.includes(c.id));

  // Shuffle the 12 cards
  const shuffledGameCards = shuffle(gameCards);

  // Render
  shuffledGameCards.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = item.id;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <img src="${item.content}" alt="${item.id}">
        </div>
      </div>
    `;

    card.addEventListener('click', () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
  lockBoard = true;
  const [card1, card2] = flippedCards;

  if (card1.dataset.id === card2.dataset.id) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    resetTurn();
    checkWin();
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  flippedCards = [];
  lockBoard = false;
}

function checkWin() {
  const matchedCards = document.querySelectorAll('.card.matched');
  if (matchedCards.length === TOTAL_PAIRS * 2) {
    winMessage.classList.remove('hidden');
    launchConfetti();
  }
}

// Shuffle helper
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// --- Confetti ---
function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

