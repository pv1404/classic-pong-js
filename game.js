const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 18;

let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

let ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    dx: 5 * (Math.random() > 0.5 ? 1 : -1),
    dy: (Math.random() * 4 - 2),
    speed: 5
};

let playerScore = 0;
let aiScore = 0;

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, size = "40px", color = "#fff") {
    ctx.fillStyle = color;
    ctx.font = `${size} Arial`;
    ctx.fillText(text, x, y);
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

function resetBall() {
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = (Math.random() * 4 - 2);
    ball.speed = 5;
}

function updateAI() {
    // Simple AI: moves toward the ball's Y position
    let centerAI = aiY + PADDLE_HEIGHT / 2;
    let centerBall = ball.y + BALL_SIZE / 2;

    if (centerAI < centerBall - 10) {
        aiY += 5;
    } else if (centerAI > centerBall + 10) {
        aiY -= 5;
    }

    aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
}

function draw() {
    // Clear
    drawRect(0, 0, WIDTH, HEIGHT, "#222");

    // Draw net
    for (let i = 0; i < HEIGHT; i += 30) {
        drawRect(WIDTH / 2 - 2, i, 4, 20, '#fff');
    }

    // Draw paddles
    drawRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
    drawRect(WIDTH - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");

    // Draw ball
    drawRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE, "#fff");
}

function update() {
    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision
    if (ball.y <= 0) {
        ball.y = 0;
        ball.dy = -ball.dy;
    }
    if (ball.y + BALL_SIZE >= HEIGHT) {
        ball.y = HEIGHT - BALL_SIZE;
        ball.dy = -ball.dy;
    }

    // Paddle collision (player)
    if (
        ball.x <= PADDLE_WIDTH &&
        ball.y + BALL_SIZE >= playerY &&
        ball.y <= playerY + PADDLE_HEIGHT
    ) {
        ball.x = PADDLE_WIDTH;
        ball.dx = -ball.dx;
        ball.dy += (ball.y + BALL_SIZE / 2 - (playerY + PADDLE_HEIGHT / 2)) * 0.15;
        ball.speed += 0.2;
    }

    // Paddle collision (AI)
    if (
        ball.x + BALL_SIZE >= WIDTH - PADDLE_WIDTH &&
        ball.y + BALL_SIZE >= aiY &&
        ball.y <= aiY + PADDLE_HEIGHT
    ) {
        ball.x = WIDTH - PADDLE_WIDTH - BALL_SIZE;
        ball.dx = -ball.dx;
        ball.dy += (ball.y + BALL_SIZE / 2 - (aiY + PADDLE_HEIGHT / 2)) * 0.15;
        ball.speed += 0.2;
    }

    // Score
    if (ball.x < 0) {
        aiScore++;
        updateScoreboard();
        resetBall();
    }
    if (ball.x > WIDTH) {
        playerScore++;
        updateScoreboard();
        resetBall();
    }

    // AI paddle movement
    updateAI();
}

function updateScoreboard() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('aiScore').textContent = aiScore;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();