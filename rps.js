let gameStats = JSON.parse(localStorage.getItem("gameStats")) || {
  victories: 0,
  defeats: 0,
  draws: 0,
};

document.querySelector(".wins").innerHTML = `Wins ${gameStats.victories}`;
document.querySelector(".ties").innerHTML = `Ties ${gameStats.draws}`;
document.querySelector(".losses").innerHTML = `Losses ${gameStats.defeats}`;

let darkModeEnabled = JSON.parse(localStorage.getItem("darkMode")) || false;
if (darkModeEnabled) {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".icon").src = "./sun2.png";
}

let autoPlayActive = false;
let autoPlayInterval;

const autoPlayBtn = document.querySelector(".js-auto-play-button");
autoPlayBtn.addEventListener("click", toggleAutoPlay);
document.body.addEventListener("keydown", (e) => {
  if (e.key === "a") toggleAutoPlay();
});

function toggleAutoPlay() {
  if (!autoPlayActive) {
    autoPlayActive = true;
    autoPlayInterval = setInterval(() => {
      let move = randomMove();
      executeMove(move);
    }, 1000);
    autoPlayBtn.innerHTML = "Stop Playing";
  } else {
    clearInterval(autoPlayInterval);
    autoPlayActive = false;
    autoPlayBtn.innerHTML = "Autoplay";
  }
}

document
  .querySelector(".js-rock-button")
  .addEventListener("click", () => executeMove("rock"));
document
  .querySelector(".js-paper-button")
  .addEventListener("click", () => executeMove("paper"));
document
  .querySelector(".js-scissors-button")
  .addEventListener("click", () => executeMove("scissors"));

document.body.addEventListener("keydown", (e) => {
  if (e.key === "r") executeMove("rock");
  else if (e.key === "p") executeMove("paper");
  else if (e.key === "s") executeMove("scissors");
});

document.querySelector(".icon").addEventListener("click", toggleDarkMode);

let leaderboardData = JSON.parse(localStorage.getItem("leaderboardData")) || [];
let streakCount = 0;
let streakType = "";
let lastResult = "";

function executeMove(playerMove) {
  let aiMove = randomMove();

  if (playerMove === "scissors") {
    lastResult =
      aiMove === "scissors" ? "Tie" : aiMove === "rock" ? "Lose" : "Win";
  } else if (playerMove === "rock") {
    lastResult =
      aiMove === "rock" ? "Tie" : aiMove === "paper" ? "Lose" : "Win";
  } else {
    lastResult =
      aiMove === "paper" ? "Tie" : aiMove === "scissors" ? "Lose" : "Win";
  }

  if (lastResult === "Win") {
    gameStats.victories++;
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6, x: 0 } });
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6, x: 1 } });
  } else if (lastResult === "Lose") gameStats.defeats++;
  else if (lastResult === "Tie") gameStats.draws++;

  document.querySelector(".wins").innerHTML = `Wins ${gameStats.victories}`;
  document.querySelector(".ties").innerHTML = `Ties ${gameStats.draws}`;
  document.querySelector(".losses").innerHTML = `Losses ${gameStats.defeats}`;

  document.querySelector(".x").innerHTML = "X";
  const announcement = document.querySelector(".announcement");
  announcement.innerHTML =
    lastResult === "Win"
      ? '<p style="color: green; margin:0">You win.</p>'
      : lastResult === "Lose"
      ? '<p style="color: red; margin:0">You lose.</p>'
      : "Tie.";

  const playerImg = document.querySelector(".announcement-img");
  const aiImg = document.querySelector(".announcement-img-2");

  playerImg.src =
    playerMove === "paper"
      ? "pngwing.com (1).png"
      : playerMove === "rock"
      ? "pngwing.com.png"
      : "pngwing.com (2).png";
  aiImg.src =
    aiMove === "paper"
      ? "pngwing.com (1).png"
      : aiMove === "rock"
      ? "pngwing.com.png"
      : "pngwing.com (2).png";

  document.querySelector(".you").innerHTML = "YOU";
  document.querySelector(".computer").innerHTML = "COMPUTER";

  updateStreak(lastResult);
  localStorage.setItem("gameStats", JSON.stringify(gameStats));
  updateLeaderboard();
}

function updateStreak(result) {
  if (result === "Win")
    streakType === "win"
      ? streakCount++
      : ((streakType = "win"), (streakCount = 1));
  else if (result === "Lose")
    streakType === "loss"
      ? streakCount++
      : ((streakType = "loss"), (streakCount = 1));
  else
    streakType === "tie"
      ? streakCount++
      : ((streakType = "tie"), (streakCount = 1));

  const streakEl = document.querySelector(".streak");
  streakEl.innerHTML =
    streakCount > 1
      ? `🔥 ${streakType.toUpperCase()} Streak: ${streakCount}`
      : "";
  streakEl.classList.remove("streak-pop");
  void streakEl.offsetWidth;
  streakEl.classList.add("streak-pop");
}

function randomMove() {
  const rand = Math.random();
  return rand < 1 / 3 ? "rock" : rand < 2 / 3 ? "paper" : "scissors";
}

function toggleDarkMode() {
  const icon = document.querySelector(".icon");
  const filename = icon.src.split("/").pop();

  if (filename === "crescent-black.png") {
    document.body.classList.add("dark-mode");
    icon.src = "./sun2.png";
    darkModeEnabled = true;
  } else {
    document.body.classList.remove("dark-mode");
    icon.src = "./crescent-black.png";
    darkModeEnabled = false;
  }

  icon.classList.add("rotate-icon");
  setTimeout(() => icon.classList.remove("rotate-icon"), 500);
  localStorage.setItem("darkMode", JSON.stringify(darkModeEnabled));
}

function updateLeaderboard() {
  leaderboardData.push({
    wins: gameStats.victories,
    losses: gameStats.defeats,
    draws: gameStats.draws,
    date: new Date().toLocaleString(),
  });
  leaderboardData.sort((a, b) => b.wins - a.wins);
  leaderboardData = leaderboardData.slice(0, 5);
  localStorage.setItem("leaderboardData", JSON.stringify(leaderboardData));
  renderLeaderboard();
}

function renderLeaderboard() {
  const list = document.querySelector(".leaderboard-list");
  list.innerHTML = "";
  leaderboardData.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. Wins: ${entry.wins}, Losses: ${
      entry.losses
    }, Ties: ${entry.draws} (${entry.date})`;
    list.appendChild(li);
  });
}

function resetLeaderboard() {
  leaderboardData = [];
  localStorage.removeItem("leaderboardData");
  renderLeaderboard();
}

let popupVisible = false;
function showPopup() {
  if (!popupVisible) {
    document
      .querySelector(".confirmation-popup")
      .classList.toggle("visibility-popup");
    popupVisible = true;
  }
}

function hidePopup() {
  document
    .querySelector(".confirmation-popup")
    .classList.toggle("visibility-popup");
  popupVisible = false;
}

function resetGame() {
  gameStats.victories = 0;
  gameStats.defeats = 0;
  gameStats.draws = 0;
  localStorage.removeItem("gameStats");
  document.querySelector(".wins").innerHTML = "Wins 0";
  document.querySelector(".ties").innerHTML = "Ties 0";
  document.querySelector(".losses").innerHTML = "Losses 0";
  resetLeaderboard();
}

document.querySelector(".js-reset").addEventListener("click", showPopup);
document.querySelector(".yes-button").addEventListener("click", () => {
  resetGame();
  hidePopup();
});
document.querySelector(".no-button").addEventListener("click", hidePopup);
document.body.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") showPopup();
});

renderLeaderboard();
