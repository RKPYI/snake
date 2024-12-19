var audio1 = new Audio('death.mp3');
var popSound = new Audio('pop.mp3');
var clickSound = new Audio('button.mp3');
clickSound.volume = 0.3;

const gameBoard = document.querySelector('#gameBoard');
const c = gameBoard.getContext('2d');
const scoreText = document.querySelector('#scoreText');
const mainMenuBtn = document.querySelector('#mainMenuBtn');
const startGameBtn = document.querySelector('#startGameBtn');
const difficultyBtn = document.querySelector('#difficultyBtn');
const difficultyModal = document.querySelector('#difficultyModal');
const easyBtn = document.querySelector('#easyBtn');
const normalBtn = document.querySelector('#normalBtn');
const hardBtn = document.querySelector('#hardBtn');
const viewLeaderboardBtn = document.querySelector('#viewLeaderboardBtn');
const leaderboard = document.querySelector('#leaderboard');
const upBtn = document.querySelector('#upBtn');
const leftBtn = document.querySelector('#leftBtn');
const rightBtn = document.querySelector('#rightBtn');
const downBtn = document.querySelector('#downBtn');

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "black";
const snakeColor = "#6FC";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;

let count = parseInt(localStorage.getItem("count") || 0);
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize*4, y:0},
    {x:unitSize*3, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
]
let numFood = 2;
let foodItems = [];

upBtn.addEventListener("click", () => simulateKeyPress(38));
leftBtn.addEventListener("click", () => simulateKeyPress(37));
rightBtn.addEventListener("click", () => simulateKeyPress(39));
downBtn.addEventListener("click", () => simulateKeyPress(40));
window.addEventListener("keydown", changeDirection);
mainMenuBtn.addEventListener("click", () => {mainMenu(); clickSound.play()});
startGameBtn.addEventListener("click", () => {startGame(); clickSound.play()});
difficultyBtn.addEventListener("click", () => {showDifficultyModal(); clickSound.play()});
easyBtn.addEventListener("click", () => {setEasyDifficulty(); clickSound.play()});
normalBtn.addEventListener("click", () => {setNormalDifficulty(); clickSound.play()});
hardBtn.addEventListener("click", () => {setHardDifficulty(); clickSound.play()});
viewLeaderboardBtn.addEventListener("click", () => {displayLeaderboard(); clickSound.play()});


function startGame(){
    startGameBtn.disabled = true;
    viewLeaderboardBtn.disabled = true;
    difficultyBtn.disabled = true;
    mainMenuBtn.style.display = 'none';
    menu.style.display = 'none';
    leaderboard.style.display = 'none';
    difficultyModal.style.display = 'none';
    gameContainer.style.display = 'block';
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize*4, y:0},
        {x:unitSize*3, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ]

    gameStart();
}
function gameStart(){
    count += 1;
    localStorage.setItem("count", count);
    running = true;
    scoreText.textContent = score;

    foodItems = []; // Reset food items.
    for (let i = 0; i < numFood; i++) {
        createFood(); // Generate the initial food items.
    }
    nextTick();
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    }
    else{
        displayGameOver();
    }
};
function clearBoard(){
    c.fillStyle = boardBackground;
    c.fillRect(0, 0, gameWidth, gameHeight);
};
function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max-min) + min) / unitSize) * unitSize;
        return randNum;
    }

    let foodPosition;
    do {
        foodPosition = {
            x: randomFood(0, gameWidth - unitSize),
            y: randomFood(0, gameWidth - unitSize),
        };
    } while (
        foodItems.some(item => item.x === foodPosition.x && item.y === foodPosition.y) ||
        snake.some(part => part.x === foodPosition.x && part.y === foodPosition.y)
    );
    foodItems.push(foodPosition);
};
function drawFood(){
    c.fillStyle = foodColor;
    foodItems.forEach(food => {
        c.fillRect(food.x, food.y, unitSize, unitSize);
    });
};
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};

    snake.unshift(head);
    // if food is eaten
    const foodIndex = foodItems.findIndex(food => food.x === snake[0].x && food.y === snake[0].y)
    if(foodIndex !== -1){
        popSound.play();
        score+=1;
        scoreText.textContent = score;
        foodItems.splice(foodIndex, 1);
        createFood();
    }else{
        snake.pop();
    }
};
function drawSnake(){
    c.fillStyle = snakeColor;
    c.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        c.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        c.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    
    const LEFT = 37;
    const A = 65;
    const UP = 38;
    const W = 87;
    const RIGHT = 39;
    const D = 68;
    const DOWN = 40;
    const S = 83;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);
    const goingRight = (xVelocity == unitSize);

    switch(true){
        case((keyPressed == LEFT || keyPressed == A)&& !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case((keyPressed == RIGHT || keyPressed == D)&& !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case((keyPressed == UP || keyPressed == W)&& !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case((keyPressed == DOWN || keyPressed == S)&& !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
        
    }
};
function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};
function displayGameOver(){
    audio1.play();
    c.font = "50px MV Boli";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText("GAME OVER!", gameWidth / 2, gameHeight/2);
    const username = `user${count}`;
    localStorage.setItem(username, score);
    startGameBtn.disabled = false;
    viewLeaderboardBtn.disabled = false;
    difficultyBtn.disabled = false;
    mainMenuBtn.style.display = 'block';
};
function mainMenu(){
    menu.style.display = 'block';
    gameContainer.style.display = 'none';
};
function showDifficultyModal() {
    gameContainer.style.display = 'none';
    leaderboard.style.display = 'none';
    menu.style.display = 'none';
    difficultyModal.style.display = 'block';
}
function closeDifficultyModalFunc() {
    menu.style.display = 'block';
    difficultyModal.style.display = 'none';
}
function setEasyDifficulty() {
    numFood = 3;
    closeDifficultyModalFunc();
}
function setNormalDifficulty() {
    numFood = 2;
    closeDifficultyModalFunc();
}
function setHardDifficulty() {
    numFood = 1;
    closeDifficultyModalFunc();
}
function displayLeaderboard() {
    gameContainer.style.display = 'none';
    difficultyModal.style.display = 'none';
    if (leaderboard.style.display == 'block'){
        leaderboard.style.display = 'none';
    }else{
        leaderboard.style.display = 'block';
    }

    scoreList.innerHTML = '';

    count = parseInt(localStorage.getItem('count')) || 0;
    if (count > 0) {
        const scores = [];
        for (let i = 1; i <= count; i++){
            const user = `user${i}`;
            const userScore = parseInt(localStorage.getItem(user));
            scores.push({user, score: userScore});
        }
        const topScores = scores.sort((a, b) => b.score - a.score).slice(0,10);
        topScores.forEach((entry,index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${entry.user}: ${entry.score}`;
            scoreList.appendChild(listItem);
        })
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'Belum ada score.';
        scoreList.appendChild(listItem);
    }
}
function simulateKeyPress(keyCode) {
    const event = new KeyboardEvent("keydown", { keyCode, which: keyCode });
    window.dispatchEvent(event);
    console.log(keyCode);
}