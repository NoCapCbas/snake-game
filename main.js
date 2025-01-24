const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = canvas.width / GRID_SIZE;
const INITIAL_SPEED = 150;

// Game state
let snake = [{ x: 5, y: 5 }];
let food = { x: 10, y: 5 };
let direction = 'right';
let gameOver = false;
let score = 0;

// Generate new food position
function generateFood() {
    while (true) {
        const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        // Check if food spawns on snake
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            return newFood;
        }
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * CELL_SIZE,
            segment.y * CELL_SIZE,
            CELL_SIZE - 1,
            CELL_SIZE - 1
        );
    });

    // Draw food
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE/2,
        food.y * CELL_SIZE + CELL_SIZE/2,
        CELL_SIZE/2 - 1,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Draw game over text
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
        ctx.font = '24px Arial';
        ctx.fillText('Press Space to restart', canvas.width/2, canvas.height/2 + 40);
    }

    // Update score
    scoreElement.textContent = `Score: ${score}`;
}

// Update game state
function update() {
    if (gameOver) return;

    // Calculate new head position
    const head = { ...snake[0] };
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Check for collisions
    if (head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        score++;
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (gameOver && event.code === 'Space') {
        // Reset game
        snake = [{ x: 5, y: 5 }];
        direction = 'right';
        food = generateFood();
        gameOver = false;
        score = 0;
        return;
    }

    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Game loop
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, INITIAL_SPEED);
}

// Start the game
gameLoop();