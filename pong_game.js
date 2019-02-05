var canvas = document.getElementById('gameCanvas');;
var canvasContext;
// Score variables
var scorePlayer1 = 0;
var scorePlayer2 = 0;
var scoreToWin = 5; // The maximal score
var start = true;
// Ball dimension
var ballSize = 15;

// Ball position variables
var ballX = 50;
var ballY = 50;
// Ball velocity variables
var ballSpeedX = 10;
var ballSpeedY = 10;
const PADDLE_THICKNESS = 10; // Set the thickness const
// Left Paddle
var paddle1Y = 250;     // The paddle can only move on the Y-axis
const PADDLE1X = 2;     // Const cuz it should not move on the X-axis
var paddle1Height = 100; // Paddle height, not const so it can change later on
// Right Paddle
var paddle2Y = 250;     // The paddle can only move on the Y-axis
const PADDLE2X = canvas.width - PADDLE1X - PADDLE_THICKNESS; // So both left and right paddles have the same shift from the edge (-10 comes from the paddle width)
var paddle2Height = 100; // Paddle height, not const so it can change later on
function calculateMousePos(e){
    var rect = canvas.getBoundingClientRect(); // Get the rectangle object of the Canvas
    var root = document.documentElement;    // Get the Element of the document, here the <html>

    var mouseX = e.clientX - rect.left - root.scrollLeft; 
    var mouseY = e.clientY - rect.top - root.scrollTop;

    return { // Return then an object literal with the mouse position as followed (x,y)
        x: mouseX,
        y: mouseY
    };
}

// Click event to restart a game
function handleMouseClick(e){
    if(!start){
        scorePlayer1 = scorePlayer2 = 0;
        start = true;
    }
}

window.onload = function () {
    canvasContext = canvas.getContext('2d');
    var framesPerSecond = 30;    // 30fps
    setInterval(function(){      // anonymous function
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);     // Call the function each x ms  
    canvas.addEventListener('mousedown', handleMouseClick); // the function but not its instanciation (english ?)

    canvas.addEventListener('mousemove', function(e){
        var mousePos = calculateMousePos(e);
        paddle1Y = mousePos.y - paddle1Height/2; // So the mouse is centered on the paddle
    }); 
}
// Reset function
function ballReset(){
    if(scorePlayer1 >= scoreToWin || scorePlayer2 >= scoreToWin){
        // Stop the game

        start = false;
    }

    // Center the ball
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX *=-1; // Move
}
// Basic AI
function computerMovement(){
    var paddle2YCenter = paddle2Y+(paddle2Height/2); // The lock will be on the center, should be more precise
    if(paddle2YCenter < ballY-15){
        paddle2Y += 6;
    }
    else if(paddle2YCenter > ballY+15) {
        paddle2Y -= 6;
    }
}

// Create the "dynamics" of the ball
function moveEverything(){

    if(!start) return; // Do not execute the belowed code
    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    // Left side
    if(ballX - ballSize < 0){            
        if( ballY > paddle1Y && ballY < paddle1Y+paddle1Height){ // out of the paddle region
            ballSpeedX *=-1; // Revert the direction

            // Ball control = depending where the ball hit the paddle, it reflects it in a different angle
            var deltaY = ballY - (paddle1Y+paddle1Height/2);
            ballSpeedY = deltaY * 0.35;
        }
        else {
            scorePlayer2++;
            ballReset();
        }
    }
             
    // Right side collision
    if(ballX + ballSize > canvas.width ){
        if( ballY > paddle2Y && ballY < paddle2Y+paddle2Height){ // out of the paddle region
            ballSpeedX *=-1; // Revert the direction

            // Ball control = depending where the ball hit the paddle, it reflects it in a different angle
            var deltaY = ballY - (paddle2Y+paddle2Height/2);
            ballSpeedY = deltaY * 0.35;
        }
        else {
            scorePlayer1++;
            ballReset();     
        } 
    }
        
    // Top and bottom collision
    if(ballY + ballSize > canvas.height || ballY -ballSize < 0){
        ballSpeedY *=-1; // Revert the direction
    }
}

function drawNet(){
    for(let i = 0; i < canvas.height; i+=40){
        colorRect(canvas.width/2-1, i, 2, 20, 'white');
    }
}

// Function called to draw everything on the page
function drawEverything(){
    colorRect(0, 0, canvas.width, canvas.height, 'black'); // Fill the canvas color

    // Draw the score
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(scorePlayer1, 100, 100);
    canvasContext.fillText(scorePlayer2, canvas.width-100, 100);
    if(!start){
        if(scorePlayer1 >= scoreToWin){
            canvasContext.fillText("LEFT PLAYER WON", 100, 100);
        }
        if(scorePlayer2 >= scoreToWin){
            canvasContext.fillText("RIGHT PLAYER WON", 100, 100);
        }
        canvasContext.fillText("Click to continue", 350, 500);
        return;
    }

    drawNet();
    // Left paddle
    colorRect(PADDLE1X, paddle1Y, PADDLE_THICKNESS, paddle1Height, 'white');   
    // Right paddle
    colorRect(PADDLE2X, paddle2Y, PADDLE_THICKNESS, paddle2Height, 'white');    
    // Draw the ball
    colorBall(ballX, ballY, ballSize, 'white');
}

// Function to create the shapes
function colorRect(leftX, topY, width, height, drawcolor){
    canvasContext.fillStyle = drawcolor; // Set the graphics color for the next shape, ie a rectangle
    canvasContext.fillRect(leftX, topY, width, height); // Place the rectangle inside the canvas
}

// Function that draws a colored ball
function colorBall(centerX, centerY, radius, color){
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true); // Draw a full circle
    canvasContext.fill(); // fill it of the color
}
