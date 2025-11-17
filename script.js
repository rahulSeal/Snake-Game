const board = document.querySelector(".board");
const blockHeight = 50;
const blockWidth = 50;
const modal = document.querySelector(".modal");
const startGame = document.querySelector(".startGame");
const btnStart = document.querySelector(".btnStart");
const restartGame = document.querySelector(".restartGame");
const btnRestart = document.querySelector(".btnRestart");

const highestScoreElement = document.querySelector("#hsc");
const scoreElement = document.querySelector("#sc");
const timeElement = document.querySelector("#time");

let highestScore = localStorage.getItem("highestScore") || 0;
let score = 0;
let time = `00:00`;

highestScoreElement.innerText = highestScore;

const rows = Math.floor(board.clientHeight / blockHeight);
const cols = Math.floor(board.clientWidth / blockWidth);

const blocks = [];
let snake = [
  {
    x: 1,
    y: 3,
  },
];
let intervalId = null;
let timeIntervalId = null;

let direction = "right";
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText = `${row}-${col}`;
    blocks[`${row}-${col}`] = block;
  }
}

function renderAll() {
  let head = null;

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    // alert("Game Over");
    clearInterval(intervalId);

    modal.style.display = "flex";
    startGame.style.display = "none";
    restartGame.style.display = "flex";

    return;
  }

  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);

    score += 10;
    scoreElement.innerText = score;

    if (score > highestScore) {
      highestScore = score;
      highestScoreElement.innerText = highestScore;
      localStorage.setItem("highestScore", highestScore.toString());
    }
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

btnStart.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    renderAll();
  }, 300);

  timeIntervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);

    if (sec === 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }

    time = `${min}:${sec}`;
    timeElement.innerText = time;
  }, 1000);
});

btnRestart.addEventListener("click", gameRestart);

function gameRestart() {
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  highestScoreElement.innerText = highestScore;
  score = 0;
  scoreElement.innerText = score;
  time = `00:00`;
  timeElement.innerText = time;
  modal.style.display = "none";
  direction = "down";
  snake = [
    {
      x: 1,
      y: 3,
    },
  ];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  intervalId = setInterval(() => {
    renderAll();
  }, 300);
}

addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") direction = "up";
  else if (event.key === "ArrowDown") direction = "down";
  else if (event.key === "ArrowRight") direction = "right";
  else if (event.key === "ArrowLeft") direction = "left";
});
