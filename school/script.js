/* ===== ROOM DATA ===== */
const rooms = [
  { name: "START", image: "start.png" },
  { name: "entrance", image: "entrance.png" },
  { name: "classroom 1", image: "classroom1.png", text: "classroom" },
  { name: "classroom 2", image: "classroom2.png" },
  { name: "nurse's office", image: "nursesoffice.png" },
  { name: "teachers' office", image: "teachersoffice.png" },
  { name: "principal's office", image: "principalsoffice.png" },
  { name: "cooking room", image: "cookingroom.png" },
  { name: "library", image: "library.png" },
  { name: "classroom 3", image: "classroom3.png" },
  { name: "lunch room", image: "lunchroom.png" },
  { name: "restroom", image: "restroom.png" },
  { name: "playground", image: "playground.png" },
  { name: "classroom 4", image: "classroom4.png" },
  { name: "music room", image: "musicroom.png" },
  { name: "arts and crafts room", image: "aandc.png" },
  { name: "science room", image: "scienceroom.png" },
  { name: "gym", image: "gym.png" },
  { name: "GOAL", image: "goal.png" }
];

/* ===== ELEMENTS ===== */
const board = document.getElementById("board");
const rollBtn = document.getElementById("rollBtn");
const dice = document.getElementById("dice");

const overlay = document.getElementById("overlay");
const tokenSelect = document.getElementById("tokenSelect");

const overlayPlayer = document.getElementById("overlayPlayer");
const overlayImage = document.getElementById("overlayImage");
const overlayRoom = document.getElementById("overlayRoom");
const overlaySentence = document.getElementById("overlaySentence");
const goalMessage = document.getElementById("goalMessage");

const nextBtn = document.getElementById("nextBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const closeBtn = document.getElementById("closeBtn");

/* ===== GAME STATE ===== */
let position = 0;
let isMoving = false;
let playerToken = "🐢";

/* ===== BOARD SETUP ===== */
rooms.forEach(room => {
  const cell = document.createElement("div");
  cell.className = "cell";

  if (room.image) {
    const img = document.createElement("img");
    img.src = `school-image/${room.image}`;
    img.className = "room-image";
    img.onerror = () => img.remove();
    cell.appendChild(img);
  }

  const label = document.createElement("span");
  label.textContent = room.name;
  cell.appendChild(label);

  board.appendChild(cell);
});

/* ===== TOKEN ===== */
function renderToken() {
  document.querySelectorAll(".token").forEach(t => t.remove());
  const token = document.createElement("div");
  token.className = "token";
  token.textContent = playerToken;
  board.children[position].appendChild(token);
}

/* ===== OVERLAY ===== */
function showOverlay(isGoal = false) {
  const room = rooms[position];
  overlay.classList.add("show");

  overlayPlayer.textContent = playerToken;
  overlayRoom.textContent = room.name;
  overlaySentence.textContent = isGoal ? "" : `It's the ${room.name}.`;

  if (room.image) {
    overlayImage.style.animation = "none";
    overlayImage.offsetHeight;
    overlayImage.style.animation = "";
    overlayImage.src = `school-image/${room.image}`;
    overlayImage.style.display = "block";
  } else {
    overlayImage.style.display = "none";
  }

  goalMessage.style.display = isGoal ? "block" : "none";
  nextBtn.style.display = isGoal ? "none" : "inline-block";
  playAgainBtn.style.display = isGoal ? "inline-block" : "none";
  closeBtn.style.display = isGoal ? "inline-block" : "none";

  if (isGoal) rollBtn.disabled = true;
}

function hideOverlay() {
  overlay.classList.remove("show");
}

/* ===== MOVEMENT ===== */
function clearHighlights() {
  document.querySelectorAll(".cell").forEach(c => c.classList.remove("moving"));
}

function moveStepByStep(steps) {
  isMoving = true;
  rollBtn.disabled = true;
  let moved = 0;

  const timer = setInterval(() => {
    clearHighlights();

    if (moved >= steps) {
      clearInterval(timer);
      isMoving = false;
      showOverlay(position === rooms.length - 1);
      return;
    }

    position = Math.min(position + 1, rooms.length - 1);
    board.children[position].classList.add("moving");
    renderToken();
    moved++;
  }, 400);
}

/* ===== CONTROLS ===== */
rollBtn.addEventListener("click", () => {
  if (isMoving) return;

  rollBtn.disabled = true;
  dice.classList.add("shake");

  setTimeout(() => {
    dice.classList.remove("shake");
    const roll = Math.floor(Math.random() * 3) + 1;
    dice.textContent = roll;
    hideOverlay();
    moveStepByStep(roll);
  }, 400);
});

nextBtn.addEventListener("click", () => {
  hideOverlay();
  rollBtn.disabled = false;
});

playAgainBtn.addEventListener("click", resetGame);
closeBtn.addEventListener("click", hideOverlay);

/* ===== TOKEN SELECT ===== */
document.querySelectorAll(".token-options button").forEach(btn => {
  btn.addEventListener("click", () => {
    playerToken = btn.dataset.token;
    tokenSelect.classList.remove("show");
    renderToken();
  });
});

/* ===== RESET ===== */
function resetGame() {
  position = 0;
  isMoving = false;
  dice.textContent = "?";
  rollBtn.disabled = false;
  overlay.classList.remove("show");
  tokenSelect.classList.add("show");
  clearHighlights();
  renderToken();
}

/* ===== INIT ===== */
renderToken();


