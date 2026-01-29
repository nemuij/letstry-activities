const gridSize = 10;

/* ---------- FRUIT POOL ---------- */
const fruitPool = [
  { word: "APPLE", emoji: "🍎" },
  { word: "BANANA", emoji: "🍌" },
  { word: "PEACH", emoji: "🍑" },
  { word: "STRAWBERRY", emoji: "🍓" },
  { word: "KIWIFRUIT", emoji: "🥝" },
  { word: "MELON", emoji: "🍈" },
  { word: "GRAPE", emoji: "🍇" },
  { word: "LEMON", emoji: "🍋" },
  { word: "ORANGE", emoji: "🍊" },
  { word: "WATERMELON", emoji: "🍉" },
  { word: "PINEAPPLE", emoji: "🍍" },
  { word: "PEAR", emoji: "🍐" },
  { word: "CHERRY", emoji: "🍒" },
  { word: "MANGO", emoji: "🥭" },
  { word: "COCONUT", emoji: "🥥" },
  { word: "BLUEBERRY", emoji: "🫐" }

];

let activeFruits = [];
let grid = [];
let selectedCells = [];
let timer = 0;
let interval = null;
let timerStarted = false;

/* ---------- START GAME ---------- */

function startGame() {
  closeOverlay();
  resetTimer();

  activeFruits = shuffle([...fruitPool]).slice(0, 8);
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

  placeWords();
  fillRandomLetters();
  renderGrid();
  renderWordList();
}

document.getElementById("resetBtn").addEventListener("click", startGame);

/* ---------- TIMER ---------- */

function resetTimer() {
  clearInterval(interval);
  timer = 0;
  timerStarted = false;
  document.getElementById("timer").textContent = "TIME: READY";
}

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = `TIME: ${timer}S`;
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

/* ---------- GRID SETUP ---------- */

function placeWords() {
  activeFruits.forEach(obj => {
    let placed = false;

    while (!placed) {
      const direction = Math.random() < 0.5 ? "ACROSS" : "DOWN";

      if (direction === "ACROSS") {
        const r = Math.floor(Math.random() * gridSize);
        const c = Math.floor(Math.random() * (gridSize - obj.word.length + 1));

        const fits = obj.word.split("").every((ch, i) =>
          grid[r][c + i] === "" || grid[r][c + i] === ch
        );

        if (fits) {
          obj.word.split("").forEach((ch, i) => {
            grid[r][c + i] = ch;
          });
          placed = true;
        }

      } else {
        // DOWN
        const r = Math.floor(Math.random() * (gridSize - obj.word.length + 1));
        const c = Math.floor(Math.random() * gridSize);

        const fits = obj.word.split("").every((ch, i) =>
          grid[r + i][c] === "" || grid[r + i][c] === ch
        );

        if (fits) {
          obj.word.split("").forEach((ch, i) => {
            grid[r + i][c] = ch;
          });
          placed = true;
        }
      }
    }
  });
}

function fillRandomLetters() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (!cell) {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    })
  );
}

/* ---------- RENDER ---------- */

function renderGrid() {
  const gridEl = document.getElementById("grid");
  gridEl.innerHTML = "";

  grid.flat().forEach(letter => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = letter;

    cell.onclick = () => handleTap(cell);
    gridEl.appendChild(cell);
  });
}

function renderWordList() {
  const ul = document.getElementById("wordList");
  ul.innerHTML = "";

  activeFruits.forEach(obj => {
    const li = document.createElement("li");
    li.id = `word-${obj.word}`;
    li.textContent = `${obj.emoji} ${obj.word}`;
    ul.appendChild(li);
  });
}

/* ---------- TAP-ONLY LOGIC ---------- */

function handleTap(cell) {
  if (cell.classList.contains("found")) return;

  // ⏱ Start timer on first tap
  startTimer();

  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    selectedCells = selectedCells.filter(c => c !== cell);
    return;
  }

  cell.classList.add("selected");
  selectedCells.push(cell);
  checkSelection();
}

function checkSelection() {
  const text = selectedCells.map(c => c.textContent).join("");
  const reverse = text.split("").reverse().join("");

  const match = activeFruits.find(f =>
    f.word === text || f.word === reverse
  );

  if (match) {
    selectedCells.forEach(c => {
      c.classList.remove("selected");
      c.classList.add("found");
    });

    document
      .getElementById(`word-${match.word}`)
      .classList.add("found");

    selectedCells = [];
    checkAllClear();

  } else {
    const maxLen = Math.max(...activeFruits.map(f => f.word.length));
    if (text.length >= maxLen) markWrong();
  }
}

function markWrong() {
  selectedCells.forEach(c => c.classList.add("wrong"));

  setTimeout(() => {
    selectedCells.forEach(c => {
      c.classList.remove("wrong", "selected");
    });
    selectedCells = [];
  }, 600);
}

/* ---------- FINISH ---------- */

function checkAllClear() {
  if (
    activeFruits.every(f =>
      document.getElementById(`word-${f.word}`).classList.contains("found")
    )
  ) {
    stopTimer();
    document.getElementById("finalTime").textContent =
      `TIME: ${timer} SECONDS`;
    document.getElementById("allClearScreen").classList.remove("hidden");
  }
}

function closeOverlay() {
  document.getElementById("allClearScreen").classList.add("hidden");
}

/* ---------- UTIL ---------- */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ---------- INIT ---------- */
startGame();
