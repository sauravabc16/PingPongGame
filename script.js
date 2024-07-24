/* Variable index:
a -> left player score
b -> right player score
c -> context
e -> event
i -> counter for dashed line
k -> keycode
m -> left paddle y
n -> right paddle y
p -> left paddle y velocity
q -> right paddle y velocity
s -> is start of game
u -> ball x velocity
v -> ball y velocity
w -> game is waiting (paused)
x -> ball x
y -> ball y
*/


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2; // Reduced ball speed
let dy = 2;

let paddleHeight = 75;
let paddleWidth = 10;
let paddleYRight = (canvas.height - paddleHeight) / 2;
let paddleYLeft = (canvas.height - paddleHeight) / 2;

const paddleSpeed = 5; // Reduced paddle speed
const upArrowPressed = false;
const downArrowPressed = false;
const wKeyPressed = false;
const sKeyPressed = false;

let leftScore = 0;
let rightScore = 0;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        upArrowPressed = true;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        downArrowPressed = true;
    } else if (e.key == "w" || e.key == "W") {
        wKeyPressed = true;
    } else if (e.key == "s" || e.key == "S") {
        sKeyPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        upArrowPressed = false;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        downArrowPressed = false;
    } else if (e.key == "w" || e.key == "W") {
        wKeyPressed = false;
    } else if (e.key == "s" || e.key == "S") {
        sKeyPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddleRight() {
    ctx.beginPath();
    ctx.rect(canvas.width - paddleWidth, paddleYRight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddleLeft() {
    ctx.beginPath();
    ctx.rect(0, paddleYLeft, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddleRight();
    drawPaddleLeft();
    drawScore();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    if (x + dx > canvas.width - paddleWidth - ballRadius) {
        if (y > paddleYRight && y < paddleYRight + paddleHeight) {
            dx = -dx;
        } else {
            leftScore++;
            resetBall();
        }
    } else if (x + dx < paddleWidth + ballRadius) {
        if (y > paddleYLeft && y < paddleYLeft + paddleHeight) {
            dx = -dx;
        } else {
            rightScore++;
            resetBall();
        }
    }

    if (upArrowPressed && paddleYRight > 0) {
        paddleYRight -= paddleSpeed;
    } else if (downArrowPressed && paddleYRight < canvas.height - paddleHeight) {
        paddleYRight += paddleSpeed;
    }

    if (wKeyPressed && paddleYLeft > 0) {
        paddleYLeft -= paddleSpeed;
    } else if (sKeyPressed && paddleYLeft < canvas.height - paddleHeight) {
        paddleYLeft += paddleSpeed;
    }

    x += dx;
    y += dy;
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Left: " + leftScore, 8, 20);
    ctx.fillText("Right: " + rightScore, canvas.width - 65, 20);
}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height / 2;
    dx = 2;
    dy = 2;
}

setInterval(draw, 10);



