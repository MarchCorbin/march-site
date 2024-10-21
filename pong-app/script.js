let gameRunning = false;
let animationFrameId;

const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

// Paddles, Ball, and Score
const player = { x: 10, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 };
const ai = { x: canvas.width - 20, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 7, speed: 5, dx: 5, dy: 5 };

// Toggle Button Visibility
function toggleButtons(startVisible) {
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');

    if (startVisible) {
        startButton.style.display = 'block';
        resetButton.style.display = 'none';
    } else {
        startButton.style.display = 'none';
        resetButton.style.display = 'block';
    }
}

// Start Game Function
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        resetGameState();  // Initialize the game state
        toggleButtons(false); // Hide start button, show reset button
        gameLoop(); // Start the game loop
    }
}

// Game Loop
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    moveBall();  // Move the ball
    moveAI();    // Move the AI paddle
    drawGame();  // Draw paddles, ball, and score

    animationFrameId = requestAnimationFrame(gameLoop); // Continue the game loop
}

// Reset Game Function
function resetGame() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId); // Stop the animation loop
    resetGameState(); // Reset paddles, ball, score
    toggleButtons(true); // Show start button, hide reset button
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas to remove any lingering scores
}

// Reset the ball, paddles, and score
function resetGameState() {
    player.score = 0;
    ai.score = 0;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4;
    ball.dy = 4;
    drawGame(); // Draw initial game state (paddles, ball, score)
}

// Draw Game Elements (Paddles, Ball, and Score)
function drawGame() {
    // Draw player paddle
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw AI paddle
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    // Draw scoreboard
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`${player.score} - ${ai.score}`, canvas.width / 2 - 40, 50);
}

// Ball movement and scoring
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Check for paddle collision and scoring
    if (ball.x - ball.radius < 0) {
        // AI scores
        ai.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        // Player scores
        player.score++;
        resetBall();
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.radius < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) ||
        (ball.x + ball.radius > ai.x && ball.y > ai.y && ball.y < ai.y + ai.height)
    ) {
        ball.dx = -ball.dx;
    }
}

// AI movement
function moveAI() {
    let aiSpeed = 3; // Adjust the speed for more challenging AI

    // Make AI follow the ball with slight randomness
    if (ball.y < ai.y + ai.height / 2) {
        ai.y -= aiSpeed;
    } else if (ball.y > ai.y + ai.height / 2) {
        ai.y += aiSpeed;
    }

    // Ensure AI doesn't go off-screen
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// Reset ball after scoring
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;  // Change direction after scoring
}

// Move Paddle with Mouse
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    player.y = event.clientY - rect.top - player.height / 2;

    // Prevent player paddle from going off-screen
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});
