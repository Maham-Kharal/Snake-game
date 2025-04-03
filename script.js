// script.js
const GRID_SIZE = 20;
const CELL_SIZE = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = 'right';
let score = 0;
let gameLoop;

const board = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart');

// Initialize game board
function createGrid() {
    board.innerHTML = '';
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            board.appendChild(cell);
        }
    }
}

function updateGame() {
    const head = { ...snake[0] };
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Collision detection
    if (head.x < 0 || head.x >= GRID_SIZE || 
        head.y < 0 || head.y >= GRID_SIZE ||
        snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver();
        return;
    }

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
    render();
}

function render() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.className = 'cell';
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        if (snake.some(seg => seg.x === x && seg.y === y)) {
            cell.classList.add('snake');
            
            // Add head and eyes
            if (snake[0].x === x && snake[0].y === y) {
                cell.classList.add('snake-head', `dir-${direction}`);
            }
        }

        if (x === food.x && y === food.y) {
            cell.classList.add('food');
        }
    });
}

function spawnFood() {
    do {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(seg => seg.x === food.x && seg.y === food.y));
}

function gameOver() {
    clearInterval(gameLoop);
    alert(`Game Over! Score: ${score}`);
}

document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    
    switch(e.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
});

restartButton.addEventListener('click', () => {
    clearInterval(gameLoop);
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    spawnFood();
    gameLoop = setInterval(updateGame, 200);
});

// Initialize game
createGrid();
spawnFood();
gameLoop = setInterval(updateGame, 200);