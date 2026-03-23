const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = 40;

let highScore = localStorage.getItem("highScore") || 0;

let snake = [{ x: 10, y: 10 }];
let direction = 'RIGHT';
let food = { x: 15, y: 10 };
let score = 0;
let gameSpeed = 400;

function draw() {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width,
    canvas.height);



  drawGrid();
  // Draw Score
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Arial';
  ctx.fillText("Score: " + score, 10, 25);

  // Draw High Score
  ctx.fillText("High: " + highScore, 10, 50);





  // Draw snake (green)
  ctx.fillStyle = '#00FF00';
  snake.forEach(segment => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });

  // Draw food (red)
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );
}






function drawGrid() {
  ctx.strokeStyle = '#333';

  for (let i = 0; i <= tileCount; i++) {
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();

    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
}





function move() {
  // Copy head
  let head = {
    x: snake[0].x,
    y: snake[0].y
  };

  // Move head
  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  // Add new head
  snake.unshift(head);

  // Check if food eaten
  if (head.x === food.x && head.y === food.y) {
    score++;

    //Eat Sound
    const eatSound = new Audio("Snake_Eating_Sound.mp3");
    eatSound.currentTime = 0;
    eatSound.play().catch(() => { }); // avoid errors

    // Increase speed
    if (gameSpeed > 80) {
      gameSpeed -= 10;
    }

    // Update high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    placeFood();
  } else {
    snake.pop(); // normal move
  }
}


document.addEventListener('keydown',
  changeDirection);

function changeDirection(event) {
  const key = event.key;

  // Prevent 180° turns
  if (key === 'ArrowUp' &&
    direction !== 'DOWN')
    direction = 'UP';

  if (key === 'ArrowDown' &&
    direction !== 'UP')
    direction = 'DOWN';

  if (key === 'ArrowLeft' &&
    direction !== 'RIGHT')
    direction = 'LEFT';

  if (key === 'ArrowRight' &&
    direction !== 'LEFT')
    direction = 'RIGHT';
}



function checkCollision() {
  const head = snake[0];

  // Wall collision
  if (head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount)
    return true;

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x &&
      head.y === snake[i].y)
      return true;
  }

  return false;
}

function placeFood() {
  food.x = Math.floor(
    Math.random() * tileCount);
  food.y = Math.floor(
    Math.random() * tileCount);
}


function startGame() {
  gameRunning = true;
  gameSpeed = 400;
  snake = [{ x: 10, y: 10 }];
  direction = 'RIGHT';
  score = 0;

  placeFood();
  gameLoop();
}



function gameLoop() {
  const btn = document.querySelector("button");
  btn.style.display = "none";   // hide
  // Update game state

  move();

  // Check if game over
  if (checkCollision()) {

    // Play sound FIRST
    const gameOverSound = new Audio("./Game_Over_Sound.mp3");
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    // Alert
    setTimeout(() => {
      alert('Game Over! Score: ' + score);

      // Reset game
      snake = [{ x: 10, y: 10 }];
      direction = 'RIGHT';
      score = 0;

      btn.style.display = "block"; // show
      placeFood();

    }, 300);

    return;
  }

  // Draw everything
  draw();

  // Schedule next frame
  setTimeout(gameLoop, gameSpeed);
}

// Start the game!
// placeFood();
// gameLoop();



