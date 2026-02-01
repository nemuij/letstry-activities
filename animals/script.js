const animals = [
  { id: 'elephant', name: 'ELEPHANT', img: 'animal-images/elephant.png', sound: 'animal-sounds/elephant.mp3' },
  { id: 'tiger', name: 'TIGER', img: 'animal-images/tiger.png', sound: 'animal-sounds/tiger.mp3' },
  { id: 'koala', name: 'KOALA', img: 'animal-images/koala.png', sound: 'animal-sounds/koala.mp3' },
  { id: 'mouse', name: 'MOUSE', img: 'animal-images/mouse.png', sound: 'animal-sounds/mouse.mp3' },
  { id: 'giraffe', name: 'GIRAFFE', img: 'animal-images/giraffe.png', sound: 'animal-sounds/giraffe.mp3' }
];

const board = document.getElementById('gameBoard');
const restartBtn = document.getElementById('restartBtn');
const celebration = document.getElementById('celebration');
const celebrationRestartBtn = document.getElementById('celebrationRestartBtn');
const closeCelebration = document.getElementById('closeCelebration');
const timerDisplay = document.getElementById('timer');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;

let timerInterval = null;
let elapsedSeconds = 0;
let timerStarted = false;

/* Preload audio */
const audioMap = {};
animals.forEach(a => audioMap[a.id] = new Audio(a.sound));

restartBtn.addEventListener('click', startGame);
celebrationRestartBtn.addEventListener('click', startGame);
closeCelebration.addEventListener('click', () => celebration.classList.add('hidden'));

startGame();

function startGame() {
  board.innerHTML = '';
  celebration.classList.add('hidden');

  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  timerStarted = false;

  stopTimer();
  elapsedSeconds = 0;
  updateTimer();

  const selected = shuffle([...animals]).slice(0, 4);
  totalPairs = selected.length;

  const cards = [];
  selected.forEach(a => {
    cards.push(
      { id: a.id, type: 'image', src: a.img },
      { id: a.id, type: 'sound', name: a.name }
    );
  });

  shuffle(cards).forEach(data => board.appendChild(createCard(data)));
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

  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  card.classList.add('flipped', 'locked');
  const back = card.querySelector('.card-back');
  back.innerHTML = '';

  if (data.type === 'image') {
    const img = document.createElement('img');
    img.src = data.src;
    back.appendChild(img);
  } else {
    back.textContent = data.name;
    back.classList.add('sound-text');
    playSound(data.id, back);
  }

  if (!firstCard) {
    firstCard = card;
    unlock(card);
    return;
  }

  secondCard = card;
  lockBoard = true;
  checkMatch();
}

function checkMatch() {
  const match =
    firstCard.dataset.id === secondCard.dataset.id &&
    firstCard.dataset.type !== secondCard.dataset.type;

  if (match) {
    matchedPairs++;
    playSound(firstCard.dataset.id);
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

function playSound(id, textEl = null) {
  const audio = audioMap[id];
  audio.currentTime = 0;
  audio.play().catch(() => {});

  if (textEl) {
    audio.onended = () => textEl.classList.remove('sound-text');
  }
}

function resetCard(card) {
  card.classList.remove('flipped');
  const back = card.querySelector('.card-back');
  back.innerHTML = '';
  back.classList.remove('sound-text');
}

function resetTurn(keepLocked) {
  if (!keepLocked) {
    unlock(firstCard);
    unlock(secondCard);
  }
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function unlock(card) {
  setTimeout(() => card && card.classList.remove('locked'), 800);
}

/* Timer */
function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimer() {
  const m = Math.floor(elapsedSeconds / 60);
  const s = elapsedSeconds % 60;
  timerDisplay.textContent = `⏱️ ${m}:${s.toString().padStart(2, '0')}`;
}

function showCelebration() {
  stopTimer();
  celebration.classList.remove('hidden');
  launchConfetti();
}

/* Confetti */
function launchConfetti() {
  const confetti = document.getElementById('confetti');
  confetti.innerHTML = '';
  const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.animationDuration = Math.random() * 2 + 2 + 's';
    piece.style.animationDelay = Math.random() + 's';
    confetti.appendChild(piece);
  }
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
