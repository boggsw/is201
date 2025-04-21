const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');

const gridSize = 20;
let tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let velocity = { x: 1, y: 0 };
let gameInterval;
let score = 0;
let gameSpeed = 150; // milliseconds per frame

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = 'lime';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function moveSnake() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Prevent food from appearing on the snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    }
}

function checkCollision() {
    const head = snake[0];
    // Hit walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    // Hit itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function gameLoop() {
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert(`Game Over! Your score: ${score}`);
        resetGame();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    moveSnake();
}

function changeDirection(event) {
    if (event.key === 'ArrowUp' && velocity.y === 0) {
        velocity = { x: 0, y: -1 };
    } else if (event.key === 'ArrowDown' && velocity.y === 0) {
        velocity = { x: 0, y: 1 };
    } else if (event.key === 'ArrowLeft' && velocity.x === 0) {
        velocity = { x: -1, y: 0 };
    } else if (event.key === 'ArrowRight' && velocity.x === 0) {
        velocity = { x: 1, y: 0 };
    }
}

function startGame() {
    resetGame();
    gameInterval = setInterval(gameLoop, gameSpeed);
    document.addEventListener('keydown', changeDirection);
    startButton.disabled = true;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    velocity = { x: 1, y: 0 };
    score = 0;
    scoreDisplay.textContent = score;
    clearInterval(gameInterval);
    startButton.disabled = false;
}

startButton.addEventListener('click', startGame);