const table = document.querySelector("#table"); //table
const unod = table.getContext("2d"); //context
const scoreboard = document.querySelector("#scoreboard");
const reset = document.querySelector("#reset");
const gamewidth = table.width; 
const gameheight = table.height;
const tablebackground = "black";
const colorpaddle = "red";
const borderpaddle = "white";
const ballcolor = "white";
const ballborder = "red";
const ballradius = 9.5;
const playerspeed = 50; //speed of the paddles
let intervalID;
let speedballz = 1;
let Xballz = gamewidth / 2;
let Yballz = gameheight / 2;
let Xballz_drctn = 0;
let Yballz_drctn = 0;
let scoreP1 = 0;
let scoreP2 = 0;
let paddleWidth = 15;
let paddleHeight = 115;
let scorelimit = 5;
let controlspopup = document.getElementById("controlspopup");

let paused = true;

//audio
let scoresfx = new Audio("audio/hit.mp3");
let paddlesfx = new Audio("audio/paddlehit.mp3");
let bordersfx = new Audio("audio/borderhit.mp3");
let selectsfx = new Audio("audio/select.mp3");
let victorysfx = new Audio("audio/ff1victory.mp3");
let bgm_game = new Audio("audio/meh.mp3");

//volume
bgm_game.volume = 0.05;
victorysfx.volume = 0.2;


let p1 = {
    width: paddleWidth,
    height: paddleHeight,
    x: 25,
    y: (gameheight - paddleHeight) / 2
};

let p2 = {
    width: paddleWidth,
    height: paddleHeight,
    x: gamewidth - 25 - paddleWidth,
    y: (gameheight - paddleHeight) / 2
};


document.getElementById("backtomenu").addEventListener("click", showMainMenu); //event listener for button to go back to the main menu (in game)
document.getElementById("backtomenu-gameover").addEventListener("click",showMainMenu); //event listener for button to go back to the main menu (game over screen)
window.addEventListener("keydown", move);

startgame();

function startgame() { //game start
    makebola();
    update();
}
function pausetoggle(){ //toggle pause
    paused = !paused;
}

function update() {     // Call other functions for ball movement, collision detection, scoring, etc.
    if (!paused){
        intervalID = setTimeout(() => {
            clean();
            PaddleDraw();
            ballmovement();
            drawballz(Xballz, Yballz);
            Collision();
            update();
        },10)
    }
}

function clean() { //cleans the game
    unod.fillStyle = tablebackground;
    unod.fillRect(0, 0, gamewidth, gameheight);

    unod.setLineDash([5, 5]); //dash pattern in the middle of the canvas
    unod.strokeStyle = "red";
    unod.lineWidth = 2;
    unod.beginPath();
    unod.moveTo(gamewidth / 2, 0);
    unod.lineTo(gamewidth / 2, gameheight);
    unod.stroke();
    unod.setLineDash([]);
};

function PaddleDraw() { //makes the paddles
    unod.strokeStyle = borderpaddle;

    unod.fillStyle = colorpaddle;
    unod.fillRect(p1.x, p1.y, p1.width, p1.height);
    unod.strokeRect(p1.x, p1.y, p1.width, p1.height);

    unod.fillStyle = colorpaddle;
    unod.fillRect(p2.x, p2.y, p2.width, p2.height);
    unod.strokeRect(p2.x, p2.y, p2.width, p2.height);
};

function makebola() { //gives the ball random directions of where to move
    speedballz = 1;
    if(Math.round(Math.random()) == 1){
        Xballz_drctn = 1;
    }
    else{
        Xballz_drctn = -1;
    }
    if(Math.round(Math.random()) == 1){
        Yballz_drctn = 1;
    }
    else{
        Yballz_drctn = -1;
    }
    Xballz = gamewidth / 2;
    Yballz = gameheight / 2;
    drawballz(Xballz, Yballz);
};

function ballmovement() { //makes the ball move
    Xballz += (speedballz * Xballz_drctn);
    Yballz += (speedballz * Yballz_drctn);
};

function drawballz(Xballz, Yballz) {
    unod.fillStyle = ballcolor;
    unod.strokeStyle = ballborder;
    unod.lineWidth = 2;
    const ballSize = 2 * ballradius;
    unod.strokeRect(Xballz - ballradius, Yballz - ballradius, ballSize, ballSize);
    unod.fillRect(Xballz - ballradius, Yballz - ballradius, ballSize, ballSize);
}

function Collision() {
    if(Yballz <= 0 + ballradius){
        Yballz_drctn *= -1 //if ball touches the top border, it will change its Y direction (downward)
        bordersfx.play();
    }
    if (Yballz >= gameheight - ballradius){
        Yballz_drctn *= -1 //if ball touches the bottom border, it will change its Y direction (upward)
        bordersfx.play();
    }
    if (Xballz <= 0){ //when the ball touches the left border, player 2 scores, and the game resets
        scoreP2 += 1;
        scoresfx.play();
        NewScore();
        makebola();
        return;
    }
    if (Xballz >= gamewidth){ //when the ball touches the right border, player 1 scores, and the game resets
        scoreP1 += 1;
        scoresfx.play();
        NewScore();
        makebola();
        return;
    }

    if (Xballz <= (p1.x + p1.width + ballradius)){
        if (Yballz > p1.y && Yballz < p1.y + p1.height){
            Xballz = (p1.x + p1.width) + ballradius; //if ball gets stuck inside the left paddle
            paddlesfx.play();
            Xballz_drctn *= -1;
            speedballz += 1; //ball goes faster when it hits p1
        }
    }
    if (Xballz >= (p2.x - ballradius)){
        if (Yballz > p2.y && Yballz < p2.y + p2.height){
            Xballz = (p2.x - ballradius); //if ball gets stuck inside the right paddle
            paddlesfx.play();
            Xballz_drctn *= -1;
            speedballz += 1; //ball goes faster when it hits p2
        }
    }
};

function move(e) { //paddle movement
    const pressed = e.keyCode;
    const p1Up = 87 //87 = key code for W
    const p1Down = 83 //83 = key code for S
    
    const p2Up = 38; //38 = key code for ArrowUP
    const p2Down = 40; //40 = key code for ArrowDown
    
    switch (pressed){
        case(p1Up): //paddle 1 up
            if(p1.y > 0){   //paddle 1 cannot go above the border
                p1.y -= playerspeed;
            }
            break;

        case(p1Down): //paddle 1 down
            if(p1.y < gameheight - p1.height){ //paddle 1 cannot go under the border
                p1.y += playerspeed;
            }
            break;
        case(p2Up): //paddle 2 up
            if(p2.y > 0){ //paddle 2 cannot go above the border
                p2.y -= playerspeed;
            }
            break;
        case(p2Down):
            if(p2.y < gameheight - p2.height){ //paddle 2 cannot go under the border
                p2.y += playerspeed;
            }
            break;
    }
}

function NewScore() {   //updates the scoreboard
    scoreboard.textContent = `${scoreP1} : ${scoreP2}`;
    if (scoreP1 >= scorelimit || scoreP2 >= scorelimit){
        paused = true;
        gameOver();
    }
};

function resetbgm(){ //resets bgm
    bgm_game.currentTime = 0;
    victorysfx.currentTime = 0;
}

function showMainMenu() {

    selectsfx.play();

    let startDiv = document.getElementById("start");
    let gaming = document.getElementById("Game");
    let gameOver = document.getElementById("game-over");
    startDiv.style.display = "block";
    gaming.style.display = "none"; 
    gameOver.style.display = "none";  
    scoreP1 = 0;
    scoreP2 = 0;

    paused = true;

    p1 = {
        width: paddleWidth,
        height: paddleHeight,
        x: 25,
        y: (gameheight - paddleHeight) / 2
    };
    
    p2 = {
        width: paddleWidth,
        height: paddleHeight,
        x: gamewidth - 25 - paddleWidth,
        y: (gameheight - paddleHeight) / 2
    };

    // Resets the ball's speed and position
    speedballz = 1;
    Xballz = 0;
    Yballz = 0;
    Xballz_drctn = 0;
    Yballz_drctn = 0;
    NewScore();
    clearInterval(intervalID);
    bgm_game.pause();
    victorysfx.pause();
    startgame();
}

function mainmenu(){ //main menu and start game button

    selectsfx.play();

    let startDiv = document.getElementById("start");
    let gaming = document.getElementById("Game");
    let gameOver = document.getElementById("game-over");
    startDiv.style.display = "none";
    gaming.style.display = "block";
    gameOver.style.display = "none";
    scoreP1 = 0;
    scoreP2 = 0;

    pausetoggle();

    p1 = { //puts the left paddle back in its default position
        width: paddleWidth,
        height: paddleHeight,
        x: 25,
        y: (gameheight - paddleHeight) / 2
    };
    
    p2 = { //puts the right paddle back in its default position
        width: paddleWidth,
        height: paddleHeight,
        x: gamewidth - 25 - paddleWidth,
        y: (gameheight - paddleHeight) / 2
    };

    //resets the ball's speed and position
    speedballz = 1;
    Xballz = 0;
    Yballz = 0;
    Xballz_drctn = 0;
    Yballz_drctn = 0;
    NewScore();
    clearInterval(intervalID);
    resetbgm();
    bgm_game.play();
    victorysfx.pause();
    startgame();
}

function gameOver(){ //game over menu

    let startDiv = document.getElementById("start");
    let gaming = document.getElementById("Game");
    let gameOver = document.getElementById("game-over");
    startDiv.style.display = "none";
    gaming.style.display = "none";
    gameOver.style.display = "block";
    
    //declares the winner
    let winner = ""; 
    if (scoreP1 > scoreP2){
        winner = "Player 1 Wins!"
        victorysfx.play();
    }
    else if(scoreP2 > scoreP1){
        winner = "Player 2 Wins!"
        victorysfx.play();
    }

    paused = true;

    let winelement= document.getElementById("winner"); //puts who won in the game over menu
    winelement.textContent = winner;

    //resets everything for the "play again" button
    scoreP1 = 0;
    scoreP2 = 0;

    p1 = {
        width: paddleWidth,
        height: paddleHeight,
        x: 25,
        y: (gameheight - paddleHeight) / 2
    };
    
    p2 = {
        width: paddleWidth,
        height: paddleHeight,
        x: gamewidth - 25 - paddleWidth,
        y: (gameheight - paddleHeight) / 2
    };
    speedballz = 1;
    Xballz = 0;
    Yballz = 0;
    Xballz_drctn = 0;
    Yballz_drctn = 0;
    NewScore();
    clearInterval(intervalID);
    bgm_game.pause();
    startgame();
}

//pop ups
function OpenControls(){    //popup for controls
    controlspopup.classList.add("Open_Controls");
    selectsfx.play();
}

function CloseControls(){   //button to close the controls window
    controlspopup.classList.remove("Open_Controls");
    selectsfx.play();
}
