const sports = [
  { id: 'soccer', img: 'sports-images/soccer.png', sound: 'sports-audio/soccer.mp3' },
  { id: 'basketball', img: 'sports-images/basketball.png', sound: 'sports-audio/basketball.mp3' },
  { id: 'baseball', img: 'sports-images/baseball.png', sound: 'sports-audio/baseball.mp3' },
  { id: 'tennis', img: 'sports-images/tennis.png', sound: 'sports-audio/tennis.mp3' },
  { id: 'swimming', img: 'sports-images/swimming.png', sound: 'sports-audio/swimming.mp3' },
  { id: 'dodgeball', img: 'sports-images/dodgeball.png', sound: 'sports-audio/dodgeball.mp3' },
  { id: 'skiing', img: 'sports-images/skiing.png', sound: 'sports-audio/skiing.mp3' },
  { id: 'skating', img: 'sports-images/skating.png', sound: 'sports-audio/skating.mp3' },
  { id: 'volleyball', img: 'sports-images/volleyball.png', sound: 'sports-audio/volleyball.mp3' },
  { id: 'tabletennis', img: 'sports-images/tabletennis.png', sound: 'sports-audio/tabletennis.mp3' }
];

const correctSound = new Audio('sounds/correct.mp3');
const tryAgainSound = new Audio('sounds/tryagain.mp3');

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const nextBtn = document.getElementById('nextBtn');
const listenBtn = document.getElementById('listenBtn');

const gameArea = document.getElementById('gameArea');
const optionsDiv = document.getElementById('options');
const endScreen = document.getElementById('endScreen');
const roundInfo = document.getElementById('roundInfo');

let currentAnswer = null;
let currentAudio = null;
let round = 0;
let isLocked = false;
const maxRounds = 5;

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextRound);
listenBtn.addEventListener('click', replaySound);

function startGame() {
  startBtn.classList.add('hidden');
  endScreen.classList.add('hidden');
  gameArea.classList.remove('hidden');

  round = 0;
  nextRound();
}

function nextRound() {
  optionsDiv.innerHTML = '';
  nextBtn.classList.add('hidden');
  listenBtn.classList.add('hidden');
  isLocked = true;

  if (round >= maxRounds) {
    endGame();
    return;
  }

  round++;
  roundInfo.textContent = `Round ${round} of ${maxRounds}`;

  const options = [...sports]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  currentAnswer = options[Math.floor(Math.random() * options.length)];

  options.forEach(item => {
    const card = document.createElement('div');
    card.className = 'option disabled';

    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.id;

    card.appendChild(img);
    card.addEventListener('click', () => handleChoice(card, item.id));
    optionsDiv.appendChild(card);
  });

  playSound(currentAnswer.sound);
}

function handleChoice(card, choice) {
  if (isLocked) return;

  lockOptions();

  if (choice === currentAnswer.id) {
    card.classList.add('correct');
    correctSound.currentTime = 0;
    correctSound.play();
    nextBtn.classList.remove('hidden');
  } else {
    card.classList.add('wrong');
    tryAgainSound.currentTime = 0;
    tryAgainSound.play();
    unlockOptions();
  }
}

function playSound(src) {
  lockOptions();

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(src);
  currentAudio.play().catch(() => {});

  currentAudio.onended = () => {
    unlockOptions();
    listenBtn.classList.remove('hidden');
  };
}

function replaySound() {
  if (currentAnswer) {
    playSound(currentAnswer.sound);
  }
}

function lockOptions() {
  isLocked = true;
  document.querySelectorAll('.option').forEach(card =>
    card.classList.add('disabled')
  );
}

function unlockOptions() {
  isLocked = false;
  document.querySelectorAll('.option').forEach(card =>
    card.classList.remove('disabled')
  );
}

function endGame() {
  gameArea.classList.add('hidden');
  endScreen.classList.remove('hidden');
}

