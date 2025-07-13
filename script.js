const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// DOM elements for score animation and display
const leftScoreEl = document.getElementById("leftScore");
const rightScoreEl = document.getElementById("rightScore");
const scoreAnimationEl = document.getElementById("scoreAnimation");

// Ball properties
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2; // Ball speed on x-axis
let dy = 2; // Ball speed on y-axis
let hue = 0; // Used for ball color animation

// Paddle properties
let paddleHeight = 75;
let paddleWidth = 10;
let paddleYRight = (canvas.height - paddleHeight) / 2;
let paddleYLeft = (canvas.height - paddleHeight) / 2;

// Paddle movement speed
const paddleSpeed = 5;

// Key press states
let upArrowPressed = false;
let downArrowPressed = false;
let wKeyPressed = false;
let sKeyPressed = false;

// Scoring
let leftScore = 0;
let rightScore = 0;

// Initial score display
updateScoreDisplay();

// Update score display and trigger animations
function updateScoreDisplay() {
    leftScoreEl.textContent = "Left: " + leftScore;
    rightScoreEl.textContent = "Right: " + rightScore;
    leftScoreEl.classList.add("score-update");
    rightScoreEl.classList.add("score-update");
    setTimeout(() => {
        leftScoreEl.classList.remove("score-update");
        rightScoreEl.classList.remove("score-update");
    }, 500);
}

// Show temporary score animation in the center
function showScoreAnimation(text) {
    scoreAnimationEl.textContent = text;
    scoreAnimationEl.classList.remove("show");
    void scoreAnimationEl.offsetWidth; // Restart animation
    scoreAnimationEl.classList.add("show");
}

// Event listeners for key presses
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Handle key down events
function keyDownHandler(e) {
    if (e.key == "ArrowUp") {
        upArrowPressed = true;
    } else if (e.key == "ArrowDown") {
        downArrowPressed = true;
    } else if (e.key == "w" || e.key == "W") {
        wKeyPressed = true;
    } else if (e.key == "s" || e.key == "S") {
        sKeyPressed = true;
    }
}

// Handle key up events
function keyUpHandler(e) {
    if (e.key == "ArrowUp") {
        upArrowPressed = false;
    } else if (e.key == "ArrowDown") {
        downArrowPressed = false;
    } else if (e.key == "w" || e.key == "W") {
        wKeyPressed = false;
    } else if (e.key == "s" || e.key == "S") {
        sKeyPressed = false;
    }
}

// Slowly increase ball speed over time
function increaseBallSpeed() {
    const factor = 1.0005; // very slow increase
    dx *= factor;
    dy *= factor;
}

// Draw the ball on the canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fill();
    ctx.closePath();
}

// Draw the right paddle
function drawPaddleRight() {
    ctx.beginPath();
    ctx.rect(canvas.width - paddleWidth, paddleYRight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Draw the left paddle
function drawPaddleLeft() {
    ctx.beginPath();
    ctx.rect(0, paddleYLeft, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Main draw function to render the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    hue = (hue + 1) % 360; // Update ball color
    drawBall(); // Draw the ball
    drawPaddleRight(); // Draw the right paddle
    drawPaddleLeft(); // Draw the left paddle
    drawScore(); // Display the score

    // Ball collision with walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    // Ball collision with paddles
    if (x + dx > canvas.width - paddleWidth - ballRadius) {
        if (y > paddleYRight && y < paddleYRight + paddleHeight) {
            dx = -dx;
        } else {
            leftScore++; // Increment left player's score
            updateScoreDisplay();
            showScoreAnimation(`Left Scores! ${leftScore} - ${rightScore}`);
            resetBall(); // Reset the ball
        }
    } else if (x + dx < paddleWidth + ballRadius) {
        if (y > paddleYLeft && y < paddleYLeft + paddleHeight) {
            dx = -dx;
        } else {
            rightScore++; // Increment right player's score
            updateScoreDisplay();
            showScoreAnimation(`Right Scores! ${leftScore} - ${rightScore}`);
            resetBall(); // Reset the ball
        }
    }

    // Move right paddle
    if (upArrowPressed && paddleYRight > 0) {
        paddleYRight -= paddleSpeed;
    } else if (downArrowPressed && paddleYRight < canvas.height - paddleHeight) {
        paddleYRight += paddleSpeed;
    }

    // Move left paddle
    if (wKeyPressed && paddleYLeft > 0) {
        paddleYLeft -= paddleSpeed;
    } else if (sKeyPressed && paddleYLeft < canvas.height - paddleHeight) {
        paddleYLeft += paddleSpeed;
    }

    x += dx; // Update ball position on x-axis
    y += dy; // Update ball position on y-axis

    // Gradually increase ball speed
    increaseBallSpeed();
}

// Draw the score on the canvas
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Left: " + leftScore, 8, 20);
    ctx.fillText("Right: " + rightScore, canvas.width - 65, 20);
}

// Reset the ball to the center and reset its speed
function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 2;
    dy = 2;
}

// Call the draw function every 10 milliseconds
setInterval(draw, 10);
