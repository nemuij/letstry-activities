const animals = [
  { id: 'elephant', img: 'animal-images/elephant.png', sound: 'animal-sounds/elephant.mp3' },
  { id: 'tiger', img: 'animal-images/tiger.png', sound: 'animal-sounds/tiger.mp3' },
  { id: 'koala', img: 'animal-images/koala.png', sound: 'animal-sounds/koala.mp3' },
  { id: 'mouse', img: 'animal-images/mouse.png', sound: 'animal-sounds/mouse.mp3' },
  { id: 'giraffe', img: 'animal-images/giraffe.png', sound: 'animal-sounds/giraffe.mp3' }
];

const board = document.getElementById('gameBoard');
const restartBtn = document.getElementById('restartBtn');
const celebration = document.getElementById('celebration');
const celebrationRestartBtn = document.getElementById('celebrationRestartBtn');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;

/* Preload audio */
const audioMap = {};
animals.forEach(animal => {
  const audio = new Audio(animal.sound);
  audio.preload = 'auto';
  audioMap[animal.id] = audio;
});

restartBtn.addEventListener('click', startGame);
celebrationRestartBtn.addEventListener('click', () => {
  celebration.classList.add('hidden');
  startGame();
});

startGame();

function startGame() {
  board.innerHTML = '';
  celebration.classList.add('hidden');
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;

  const selectedAnimals = [...animals]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  totalPairs = selectedAnimals.length;

  const cardsData = [];
  selectedAnimals.forEach(animal => {
    cardsData.push(
      { id: animal.id, type: 'image', src: animal.img },
      { id: animal.id, type: 'sound', src: animal.sound }
    );
  });

  cardsData
    .sort(() => 0.5 - Math.random())
    .forEach(data => board.appendChild(createCard(data)));
}

function createCard(data) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = data.id;
  card.dataset.type = data.type;

  const inner = document.createElement('div');
  inner.className = 'card-inner';

  const front = document.createElement('div');
  front.className = 'card-front';

  const back = document.createElement('div');
  back.className = 'card-back';

  inner.append(front, back);
  card.appendChild(inner);

  card.addEventListener('click', () => flipCard(card, data));
  return card;
}

function flipCard(card, data) {
  if (lockBoard || card.classList.contains('flipped')) return;

  card.classList.add('flipped', 'locked');

  const back = card.querySelector('.card-back');
  back.innerHTML = '';

  if (data.type === 'image') {
    const img = document.createElement('img');
    img.src = data.src;
    back.appendChild(img);
  } else {
    back.textContent = '🔊';
    playSound(data.id);
  }

  if (!firstCard) {
    firstCard = card;
    unlockAfterFlip(card);
    return;
  }

  secondCard = card;
  lockBoard = true;
  checkMatch();
}

function checkMatch() {
  const isMatch =
    firstCard.dataset.id === secondCard.dataset.id &&
    firstCard.dataset.type !== secondCard.dataset.type;

  if (isMatch) {
    matchedPairs++;
    playSound(firstCard.dataset.id); // auto replay on match
    resetTurn(true);

    if (matchedPairs === totalPairs) {
      setTimeout(showCelebration, 600);
    }
  } else {
    setTimeout(() => {
      resetCard(firstCard);
      resetCard(secondCard);
      resetTurn(false);
    }, 1000);
  }
}

function playSound(id) {
  const audio = audioMap[id];
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function resetCard(card) {
  card.classList.remove('flipped');
  card.querySelector('.card-back').innerHTML = '';
}

function resetTurn(keepLocked) {
  if (!keepLocked) {
    unlockAfterFlip(firstCard);
    unlockAfterFlip(secondCard);
  }
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function unlockAfterFlip(card) {
  setTimeout(() => {
    if (card) card.classList.remove('locked');
  }, 800);
}

function showCelebration() {
  celebration.classList.remove('hidden');
  launchConfetti();
}

function launchConfetti() {
  const confetti = document.getElementById('confetti');
  confetti.innerHTML = '';
  const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.animationDuration = Math.random() * 2 + 2 + 's';
    piece.style.animationDelay = Math.random() + 's';
    confetti.appendChild(piece);
  }
}
