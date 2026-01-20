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
  { id: 'a', content: 'alphabets/A1.png' },
  { id: 'a', content: 'alphabets/A2.png' },

  { id: 'b', content: 'alphabets/B1.png' },
  { id: 'b', content: 'alphabets/B2.png' },

  { id: 'c', content: 'alphabets/C1.png' },
  { id: 'c', content: 'alphabets/C2.png' },

  { id: 'd', content: 'alphabets/D1.png' },
  { id: 'd', content: 'alphabets/D2.png' },

  { id: 'e', content: 'alphabets/E1.png' },
  { id: 'e', content: 'alphabets/E2.png' },

  { id: 'f', content: 'alphabets/F1.png' },
  { id: 'f', content: 'alphabets/F2.png' },

  { id: 'g', content: 'alphabets/G1.png' },
  { id: 'g', content: 'alphabets/G2.png' },

  { id: 'h', content: 'alphabets/H1.png' },
  { id: 'h', content: 'alphabets/H2.png' },

  { id: 'i', content: 'alphabets/I1.png' },
  { id: 'i', content: 'alphabets/I2.png' },

  { id: 'j', content: 'alphabets/J1.png' },
  { id: 'j', content: 'alphabets/J2.png' },

  { id: 'k', content: 'alphabets/K1.png' },
  { id: 'k', content: 'alphabets/K2.png' },

  { id: 'l', content: 'alphabets/L1.png' },
  { id: 'l', content: 'alphabets/L2.png' },

  { id: 'm', content: 'alphabets/M1.png' },
  { id: 'm', content: 'alphabets/M2.png' },

  { id: 'n', content: 'alphabets/N1.png' },
  { id: 'n', content: 'alphabets/N2.png' },

  { id: 'o', content: 'alphabets/O1.png' },
  { id: 'o', content: 'alphabets/O2.png' },

  { id: 'p', content: 'alphabets/P1.png' },
  { id: 'p', content: 'alphabets/P2.png' },

  { id: 'q', content: 'alphabets/Q1.png' },
  { id: 'q', content: 'alphabets/Q2.png' },

  { id: 'r', content: 'alphabets/R1.png' },
  { id: 'r', content: 'alphabets/R2.png' },

  { id: 's', content: 'alphabets/S1.png' },
  { id: 's', content: 'alphabets/S2.png' },

  { id: 't', content: 'alphabets/T1.png' },
  { id: 't', content: 'alphabets/T2.png' },

  { id: 'u', content: 'alphabets/U1.png' },
  { id: 'u', content: 'alphabets/U2.png' },

  { id: 'v', content: 'alphabets/V1.png' },
  { id: 'v', content: 'alphabets/V2.png' },

  { id: 'w', content: 'alphabets/W1.png' },
  { id: 'w', content: 'alphabets/W2.png' },

  { id: 'x', content: 'alphabets/X1.png' },
  { id: 'x', content: 'alphabets/X2.png' },

  { id: 'y', content: 'alphabets/Y1.png' },
  { id: 'y', content: 'alphabets/Y2.png' },

  { id: 'z', content: 'alphabets/Z1.png' },
  { id: 'z', content: 'alphabets/Z2.png' },
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
