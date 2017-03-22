var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");
var ballRadius = 20;
var canRadius = 40;
var dx = 0;
var dy = 1;
var switched = false;
var score = 0;
var elemLeft = canvas.offsetLeft;
var elemTop = canvas.offsetTop;
var paintCans = [];
var paintBalls = [];
var paintScores = [];


var spawnRadius = 40;
var paintTimers = [];

var timerSpeed = 200;


var xChord = [50, 50, 50, 50, 140, 140, 140, 140, 230, 230, 230, 230, 320, 320, 320, 320];
var yChord = [250, 350, 450, 550, 250, 350, 450, 550, 250, 350, 450, 550, 250, 350, 450, 550];

var colours = ["#D32F2F", "#1976D2", "#4CAF50", "#FBC02D"];
var master16Arr = [];


var PaintBall = function(id, colour, x, y, switched, lane) {
    this.id = id;
    this.colour = colour;
    this.x = x;
    this.y = y;
    this.switched = switched;
    this.lane = lane;
};

function makePaintBalls() {
    var xt = 50;
    var startPoint = canvas.height - 520;
    for (var i = 0; i < 4; i++) {
        if (i != 0) xt += 90;
        var newNr = (parseInt(Math.random() * 4));
        var id = i;
        var paintBall = new PaintBall(id, colours[newNr], xt, startPoint, false, i);
        paintBalls.push(paintBall);
    }
}

function drawBall(colour, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

var PaintCan = function(id, colour, xChord, yChord, lane) {
    this.id = id;
    this.colour = colour;
    this.xChord = xChord;
    this.yChord = yChord;
    this.lane = lane;
};

//loop through making the objects
function makePaintCans() {

    function gen4Numbers() {
        var numbers = [];
        while (numbers.length < 4) {
            var newNr = (parseInt(Math.random() * 4));
            if (numbers.indexOf(newNr) == -1) {
                numbers.push(newNr);
            }
        }
        return numbers;
    }
    for (var i = 0; i < 4; i++) {
        master16Arr.push(gen4Numbers());
    }
    master16Arr = master16Arr.join(",").split(",")

    var id = 0;
    var splitCans = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
    for (var i = 0; i < 16; i++) {
        id = i;
        var paintCan = new PaintCan(id, colours[master16Arr[i]], xChord[i], yChord[i], splitCans[i]);
        paintCans.push(paintCan);
    }
}



//print paint cans on screen
function PaintBoard(row) {
    for (var i = row * 4; i < (row * 4) + 4; i++) {
        var c = document.getElementById("Canvas");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.arc(paintCans[i].xChord, paintCans[i].yChord, canRadius, 0, 2 * Math.PI);
        ctx.fillStyle = paintCans[i].colour;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }
}

function laneChange(colourLane, lane) {

    if (colourLane == "#D32F2F") colourLane = "rgba(211, 47, 47, 0.4)";
    if (colourLane == "#1976D2") colourLane = "rgba(25, 118, 210, 0.4)";
    if (colourLane == "#4CAF50") colourLane = "rgba(76, 175, 80, 0.4)";
    if (colourLane == "#FBC02D") colourLane = "rgba(251, 192, 45, 0.4)";

    if (lane == 0) {
        ctx.fillStyle = colourLane;
        ctx.fillRect(7, 200, 87, 425);
    }
    if (lane == 1) {
        ctx.fillStyle = colourLane;
        ctx.fillRect(97, 200, 87, 425);
    }
    if (lane == 2) {
        ctx.fillStyle = colourLane;
        ctx.fillRect(187, 200, 87, 425);
    }
    if (lane == 3) {
        ctx.fillStyle = colourLane;
        ctx.fillRect(277, 200, 87, 425);
    }
}


function PaintArms() {
    var j = 0;
    for (var i = 0; i < paintCans.length / 4; i++) {
        var c = document.getElementById("Canvas");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.arc(50 + j, 143, 38, 0, 2 * Math.PI);
        ctx.fillStyle = "#9E9E9E";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        j += 90;
    }
}



var PaintTimer = function(id, colour, x, y, curPerc, running) {
    this.id = id;
    this.colour = colour;
    this.x = x;
    this.y = y;
    this.curPerc = curPerc;
    this.running = running;
}; 
function makePaintTimers() {
    var xt = 50;
    var startPoint = canvas.height - 520;
    for (var i = 0; i < paintBalls.length; i++) {
        if (i != 0) xt += 90;
        var id = i;
        var paintTimer = new PaintTimer(id, paintBalls[i].colour, xt, startPoint, 0, true);
        paintTimers.push(paintTimer);
    }
} 
function PaintTimers(colour, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, spawnRadius, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = colour;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 10;
    ctx.shadowcolour = '#656565';
    ctx.stroke();
    ctx.closePath();
}


var endPercent = timerSpeed + 1;
var curPerc = 0;
var circ = Math.PI * 2;
var quart = Math.PI / 2;

function animateTimer(i) {
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = paintBalls[i].colour;
    ctx.arc(paintTimers[i].x, paintTimers[i].y, spawnRadius, -(quart), ((circ) * (paintTimers[i].curPerc / timerSpeed)) - quart, false);
    ctx.stroke();
    paintTimers[i].curPerc++;
    if (paintTimers[i].curPerc < endPercent) {
        requestAnimationFrame(function() {
            paintTimers[i].curPerc / timerSpeed
        });
    } else {
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        paintTimers[i].running = false;
        paintTimers[i].curPerc = 0;
    }
}
 
function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Score",8, 30);
    ctx.fillText(score, 8, 55);
}

function gameOver() {
    ctx.font = "23px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("GAME OVER: " + score, 8, 90);
}
 
 

var PaintScore = function(id, colour, x, y, width, height, amount) { 
this.id = id;
    this.colour = colour;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.amount = amount;
}; 
function makePaintScores() {
    var xt = 154;
    var yt = 51;
    var width = 9;
    var height = 5;
    var amount = 0;
    for (var i = 0; i < 4; i++) {
        if (i != 0) xt += 65; 
    var id = i;
        var paintScore = new PaintScore(id, colours[i], xt, yt, width, height, amount);
        paintScores.push(paintScore);
    }  
}
function PaintScores() { 
    for (var i = 0; i < 4; i++) {
        ctx.fillStyle=paintScores[i].colour;
        ctx.fillRect(paintScores[i].x,paintScores[i].y,paintScores[i].width, paintScores[i].height); 
    }
}

function addPaintScore(colour, y, height) {

    var increasePaintScoreY = 6;
    var increasePaintScoreHeight = 6;
    var scoreMAX = 5;

    if (colour == "#D32F2F") {  
        paintScores[0].y = paintScores[0].y - increasePaintScoreY;
        paintScores[0].height = paintScores[0].height + increasePaintScoreHeight;
        if (paintScores[0].amount == scoreMAX) {
            paintScores[0].amount = 0;
            paintScores[0].y = 51;
            paintScores[0].height = 5;
        }
        else paintScores[0].amount++;
    } 
    if (colour == "#1976D2") { 
        paintScores[1].y = paintScores[1].y - increasePaintScoreY;
        paintScores[1].height = paintScores[1].height + increasePaintScoreHeight;
        if (paintScores[1].amount == scoreMAX) {
            paintScores[1].amount = 0;
            paintScores[1].y = 51;
            paintScores[1].height = 5;
        }
        else paintScores[1].amount++;
    } 
    if (colour == "#4CAF50") { 
        paintScores[2].y = paintScores[2].y - increasePaintScoreY;
        paintScores[2].height = paintScores[2].height + increasePaintScoreHeight;
        if (paintScores[2].amount == scoreMAX) {
            paintScores[2].amount = 0;
            paintScores[2].y = 51;
            paintScores[2].height = 5;
        } 
        else paintScores[2].amount++;
      } 
    if (colour == "#FBC02D") {  
        paintScores[3].y = paintScores[3].y - increasePaintScoreY;
        paintScores[3].height = paintScores[3].height + increasePaintScoreHeight;
        if (paintScores[3].amount == scoreMAX) {
            paintScores[3].amount = 0;
            paintScores[3].y = 51;
            paintScores[3].height = 5;
        } 
        else paintScores[3].amount++;
    } 




} 

// --- Fix this into a function some how with drawImages..
for (var someCrazyNum=0; someCrazyNum<4; someCrazyNum++) { 
    var img = new Image();
    img.onload = function () {
       draw();
    }
    img.src = "images/bucket.png";
} 

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //console.log("Ball moving: (x,y) ", x, ", ", y, ctx.fillStyle)
 
    //DrawImages.. fix

    PaintScores();    

    ctx.drawImage(img, 110, 0, 65, 65);
    ctx.drawImage(img, 175, 0, 65, 65);
    ctx.drawImage(img, 240, 0, 65, 65);
    ctx.drawImage(img, 305, 0, 65, 65);
   
    PaintArms();
    drawScore(); 
 

    for (var i = 0; i < paintBalls.length; i++) {

        PaintBoard(paintBalls[i].lane);

        if (paintTimers[i].running == true) {
            animateTimer(i);
        } else {
            drawBall(paintBalls[i].colour, paintBalls[i].x, paintBalls[i].y, paintBalls[i].switched);
            if (paintBalls[i].y < canvas.height - ballRadius && paintBalls[i].switched == false) {
                paintBalls[i].y += dy;
            } else {
                laneChange(paintBalls[i].colour, paintBalls[i].lane);
                PaintBoard(paintBalls[i].lane);
                drawBall(paintBalls[i].colour, paintBalls[i].x, paintBalls[i].y, paintBalls[i].switched);

                paintBalls[i].y -= dy;
                paintBalls[i].switched = true;
            }
        }


        if (paintBalls[i].y == 140) {
            console.log("game over")
            y = 0;
            for (var i = 1; i < 99999; i++) window.clearInterval(i);
            gameOver();

        }
    }
}



canvas.addEventListener('mousedown', function(event) {
    var xClick = event.pageX - elemLeft;
    var yClick = event.pageY - elemTop;

    console.log("CLICKED------->", xClick, yClick);
    //console.log("ballradius",  ballRadius+x, x-ballRadius,  ballRadius+y, y-ballRadius); 

    var newNr = (parseInt(Math.random() * 4));
    var row = [4, 8, 12, 16];

    for (var lane = 0; lane < 4; lane++) {
        if ((xClick > paintBalls[lane].x - ballRadius && xClick < (20 + ballRadius) + paintBalls[lane].x) && (yClick > paintBalls[lane].y - ballRadius && yClick < ballRadius + paintBalls[lane].y)) {

            for (var i = lane * 4; i < ((lane + 1) * 4); i++) {
                if ((xClick > paintBalls[lane].x - ballRadius && xClick < (20 + ballRadius) + paintBalls[lane].x) && (yClick > paintBalls[lane].y - ballRadius && yClick < ballRadius + paintBalls[lane].y)) {
                    if (paintBalls[lane].y > paintCans[i].yChord - canRadius && paintBalls[lane].y < canRadius + paintCans[i].yChord && paintBalls[lane].colour == paintCans[i].colour && paintBalls[lane].lane == paintCans[i].lane) {

                        score += 5; 

                        console.log(paintBalls[lane].colour, paintScores[lane].y, paintScores[lane].height); 
                        addPaintScore(paintBalls[lane].colour, paintScores[lane].y, paintScores[lane].height);


                        if (lane == 0) paintBalls.shift();
                        else paintBalls.splice(lane, 1);
                        var newNr = (parseInt(Math.random() * 4));
                        swtiched = true;
                        var paintBall = new PaintBall(0, colours[newNr], xChord[(lane) * 4 + 1], canvas.height - 520, switched, lane);
                        paintBalls.splice(lane, 0, paintBall);

                        paintTimers[lane].running = true;
                    }
                }
            }
        }
    }
}, false);

 

makePaintBalls();
makePaintTimers();
makePaintCans();
makePaintScores();
window.onload = setInterval(draw, 10);

console.log("PAINTCANS: ", paintCans);
console.log("PAINTBALLS: ", paintBalls);
console.log("PAINTTIMERS: ", paintTimers);
console.log("PAINTSCORE: ", paintScores);