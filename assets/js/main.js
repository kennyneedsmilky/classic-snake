/* ケンミル */ /* 神様最高 */ "use strict"; console.log(new Date(), Date.now());

/** DOM */
const body = document.querySelector(".body"); // Body
const headerTitle = document.querySelector(".header__title"); // Header Title
const mainNewGameBtn = document.querySelector(".main__new-game-btn"); // Main New Game Button
const scoreLabel = document.querySelector(".score-label"); // Score Label
const gameCanvas01 = document.querySelector(".game-canvas-01"); // Game Canvas 01
const gameCanvas01_ctx = gameCanvas01.getContext("2d"); // Game Canvas 01 ctx
const controller = document.querySelector(".controller"); // Controller
const controllerBtns = document.querySelectorAll(".controller__btn"); // Controller Buttons

// We want the canvas to have a width of 500px and a height of 500px.

let speed = 1;

// Grid
const grid = {
    w: 50, h: 50
}

//  Score 
let score = 0;

// Snake
const snake = {
    body: [ 
        {x: 10 * grid.w, y: 10 * grid.h },
        {x: 9 * grid.w, y: 10 * grid.h }, 
    ],
    dx: 50,
    dy: 0,
    headFill: "green",
    headStroke: "gray",
    fill: "white",
    stroke: "gray"
}

// Apple
const apple = {
    x: Math.floor(Math.random() * 20) *  grid.w,
    y: Math.floor(Math.random() * 20) *  grid.h,
    dx: 0, 
    dy: 0, 
    w: 50, 
    h: 50, 
    fill: "red", 
    stroke: "white"
}

/** Event Handlers */

// Init
animate();

// Change Direction
document.addEventListener("keydown", e => changeDirection(e));

controllerBtns.forEach(btn => {
    btn.addEventListener("click", e => changeDirection(e.target));
})

// Main New Game Button
mainNewGameBtn.addEventListener("click", () => reset());


/** Functions */

// Main
function animate() {
    if(winner()) {
        headerTitle.innerText = "Forever Winner!";
        mainNewGameBtn.classList.remove("hidden");
        controller.classList.add("hidden");
        return;
    }
    if (gameOver()) {
        gameCanvas01_ctx.fillStyle = "red";
        gameCanvas01_ctx.font = "100px Arial";
        gameCanvas01_ctx.textAlign = "center";
        gameCanvas01_ctx.textAlign = "middle";
        gameCanvas01_ctx.fillText("Game Over", 500, 500);
        mainNewGameBtn.classList.remove("hidden");
        controller.classList.add("hidden");
        return;
    }
    setTimeout(() => {
        clearGameCanvas();
        moveSnake();
        drawSnake();
        if ( ateApple()) {
            score += 5;
            updateScore();
        };
        drawApple();
        animate();
    }, 500 / speed);
}

// Clear Game Canvas
function clearGameCanvas() {
    // Pick the fill color for covering the canvas.
    gameCanvas01_ctx.fillStyle = "black";
    // Draw a filled rectangle to cover the canvas.
    gameCanvas01_ctx.fillRect( 0, 0, gameCanvas01.width, gameCanvas01.height );
} 

// Move the Snake
function moveSnake() {
    const head = { x: snake.body[0].x + snake.dx, y: snake.body[0].y + snake.dy};
    snake.body.unshift( head ); // Add to the body.
    snake.body.pop(); // Take off the body.
}

// Draw Snake
function drawSnake() {
    for(let i = 0; i < snake.body.length; i++) {
        if (i === 0) {
            drawSnakePart(0, snake.body[i]);
        } else {
            drawSnakePart(1, snake.body[i]);
        }
        
    }
}

// Draw the Snake
function drawSnakePart(head, snakePart) {
    if (head === 0) {
        gameCanvas01_ctx.fillStyle = snake.headFill;
        gameCanvas01_ctx.strokeStyle = snake.headStroke;
    } else {
        gameCanvas01_ctx.fillStyle = snake.fill;
        gameCanvas01_ctx.strokeStyle = snake.stroke;
    }
    gameCanvas01_ctx.fillRect( snakePart.x, snakePart.y, grid.w, grid.h );
    gameCanvas01_ctx.strokeRect( snakePart.x, snakePart.y, grid.w, grid.h );
}

// Ate Apple
function ateApple() {
    if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
        snake.body.push({x: snake.body[snake.body.length - 1].x, h: snake.body[snake.body.length - 1].y});
        renderApple();
        speed += 0.1;
        return true;
    }
}

// Render Apple
function renderApple() {
    apple.x = Math.floor(Math.random() * 20) *  grid.w;
    apple.y = Math.floor(Math.random() * 20) *  grid.h;
    // Check to see if apple is over lapping the snake body.
    for ( let i = 1; i < snake.body.length; i++ ) {    
        if (snake.body[i].x === apple.x && snake.body[i].y === apple.y) renderApple();
    };
}

// Draw the Apple
function drawApple() {
    gameCanvas01_ctx.fillStyle = apple.fill;
    gameCanvas01_ctx.strokeStyle = apple.stroke;
    gameCanvas01_ctx.fillRect(apple.x, apple.y, grid.w, grid.h);
    gameCanvas01_ctx.strokeRect(apple.x, apple.y, grid.w, grid.h);
}

// Update Score
function updateScore() {
    scoreLabel.innerText = score;
    if (score >= 100) {
        body.style.backgroundColor = "var(--color-theme-04)";
    }
}

// Winner
function winner() {
    if (snake.body.length >= 50) return true;
}

// Game Over
function gameOver() {
    // Check to see if hit oneself.
    for ( let i = 1; i < snake.body.length; i++ ) {    
        if (snake.body[i].x === snake.body[0].x && snake.body[i].y === snake.body[0].y) return true;
    };
    // Check to see if hit a wall.
    if (snake.body[0].x < 0 || snake.body[0].x > gameCanvas01.width - grid.w || snake.body[0].y < 0 || snake.body[0].y > gameCanvas01.height - grid.h) {
        return true;
    }
}

// Reset
function reset() {
    mainNewGameBtn.classList.add("hidden");
    controller.classList.remove("hidden");
    speed = 1;
    score = 0;
    scoreLabel.innerText = 0;
    snake.body.length = 0;
    snake.body.push({x: 10 * grid.w, y: 10 * grid.h });
    snake.body.push({x: 9 * grid.w, y: 10 * grid.h });
    apple.x = Math.floor(Math.random() * 20) *  grid.w;
    apple.y = Math.floor(Math.random() * 20) *  grid.h;
    animate();
}

// Change Direction
function changeDirection(e) {
    let keyPressed = e.keyCode;
    if (e.classList !== undefined) {
        if (e.classList.contains("--btn-up")) keyPressed = 38;
        if (e.classList.contains("--btn-down")) keyPressed = 40;
        if (e.classList.contains("--btn-left")) keyPressed = 37;
        if (e.classList.contains("--btn-right")) keyPressed = 39;
    }
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const goingRight = snake.dx === 50;  
    const goingLeft = snake.dx === -50;
    const goingUp = snake.dy === -50;
    const goingDown = snake.dy === 50;
    
    if (keyPressed === LEFT_KEY && !goingRight) {    
        snake.dx = -50;
        snake.dy = 0;  
    }

    if (keyPressed === UP_KEY && !goingDown) {
        snake.dx = 0;
        snake.dy = -50;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        snake.dx = 50;
        snake.dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        snake.dx = 0;
        snake.dy = 50;
    }
}