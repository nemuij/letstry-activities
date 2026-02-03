/* ===== ELEMENTS ===== */
const tokenOverlay = document.getElementById("tokenOverlay");
const tokenMessage = document.getElementById("tokenMessage");
const tokenButtons = document.querySelectorAll(".tokens button");

const game = document.getElementById("game");
const centerCardsEl = document.getElementById("centerCards");

const overlay = document.getElementById("overlay");
const overlayCard = document.getElementById("overlayCard");
const grammarText = document.getElementById("grammarText");
const getBtn = document.getElementById("getBtn");

const p1Name = document.getElementById("p1Name");
const p2Name = document.getElementById("p2Name");

const p1Cards = document.getElementById("player1Cards");
const p2Cards = document.getElementById("player2Cards");

const p1Count = document.getElementById("p1Count");
const p2Count = document.getElementById("p2Count");

const endScreen = document.getElementById("endScreen");
const winnerText = document.getElementById("winnerText");
const playAgainBtn = document.getElementById("playAgainBtn");
const homeBtn = document.getElementById("homeBtn");

/* ===== STATE ===== */
let currentPlayer = 1;
let selectedCard = null;
let locked = false;
let tokenStep = 1;

/* ===== CARD DATA ===== */
const cards = [
  { img: "../school-image/aandc.png", name: "art room" },
  { img: "../school-image/classroom1.png", name: "classroom" },
  { img: "../school-image/cookingroom.png", name: "cooking room" },
  { img: "../school-image/entrance.png", name: "entrance" },
  { img: "../school-image/gym.png", name: "gym" },
  { img: "../school-image/library.png", name: "library" },
  { img: "../school-image/lunchroom.png", name: "lunch room" },
  { img: "../school-image/musicroom.png", name: "music room" },
  { img: "../school-image/nursesoffice.png", name: "nurse's office" },
  { img: "../school-image/playground.png", name: "playground" },
  { img: "../school-image/principalsoffice.png", name: "principal's office" },
  { img: "../school-image/restroom.png", name: "restroom" },
  { img: "../school-image/scienceroom.png", name: "science room" },
  { img: "../school-image/teachersoffice.png", name: "teacher's office" },
  { img: "../school-image/homeecroom.png", name: "home economics room" },
  { img: "../school-image/englishroom.png", name: "English room" },
  { img: "../school-image/broadcastroom.png", name: "broadcasting room" }
];

/* ===== TOKEN SELECTION ===== */
tokenButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (tokenStep === 1) {
      p1Name.textContent = btn.dataset.token;
      tokenMessage.textContent = "Player 2, choose a token";
      btn.disabled = true;
      tokenStep = 2;
    } else if (tokenStep === 2) {
      p2Name.textContent = btn.dataset.token;
      tokenOverlay.classList.remove("show");
      game.classList.remove("hidden");
      startGame();
      tokenStep = 3;
    }
  });
});

/* ===== START GAME ===== */
function startGame() {
  shuffle(cards);
  centerCardsEl.innerHTML = "";

  cards.forEach(card => {
    const img = document.createElement("img");
    img.src = card.img;
    img.className = "card";
    img.dataset.name = card.name;
    img.onclick = () => { if(!locked) openOverlay(img); };
    centerCardsEl.appendChild(img);
  });

  updateTurnUI();
}

/* ===== SHOW OVERLAY ===== */
function openOverlay(card) {
  locked = true;
  selectedCard = card;
  centerCardsEl.classList.add("locked");
  overlayCard.src = card.src;
  grammarText.textContent = `It's the ${card.dataset.name}.`;
  overlay.classList.add("show");
}

/* ===== GET CARD ===== */
getBtn.onclick = () => {
  overlay.classList.remove("show");
  centerCardsEl.classList.remove("locked");

  const target = currentPlayer === 1 ? p1Cards : p2Cards;
  target.appendChild(selectedCard);

  selectedCard.classList.add("brick-animate");
  setTimeout(() => selectedCard.classList.remove("brick-animate"), 350);

  selectedCard = null;
  locked = false;
  updateCounts();

  // Check if game ended
  if(centerCardsEl.children.length === 0){
    endGame();
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateTurnUI();
  }
}

/* ===== TURN UI ===== */
function updateTurnUI(){
  document.getElementById("player1").classList.toggle("active", currentPlayer===1);
  document.getElementById("player2").classList.toggle("active", currentPlayer===2);
}

/* ===== END GAME ===== */
function endGame(){
  winnerText.textContent = (p1Cards.children.length > p2Cards.children.length) ? 
    `${p1Name.textContent} wins!` :
    (p2Cards.children.length > p1Cards.children.length) ? 
    `${p2Name.textContent} wins!` : "It's a tie!";

  endScreen.classList.remove("hidden");
  endScreen.classList.add("show");
}

/* ===== BUTTON ACTIONS ===== */
playAgainBtn.onclick = () => location.reload();
homeBtn.onclick = () => window.location.href = "https://redsrandomproject.my.canva.site/try2unit8"; // Goes back to Unit 8

/* ===== HELPERS ===== */
function updateCounts(){
  p1Count.textContent = p1Cards.children.length;
  p2Count.textContent = p2Cards.children.length;
}

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

/* ===== DISABLE RIGHT-CLICK ===== */
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});


