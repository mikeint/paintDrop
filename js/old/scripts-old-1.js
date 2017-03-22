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
  var lane = [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3];
  for (var i = 0; i < 16; i++) {
    id = i; 
    var paintCan = new PaintCan(id, colours[master16Arr[i]], xChord[i], yChord[i], lane[i]);
    paintCans.push(paintCan);
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

function drawScore() {
  ctx.font = "24px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 30);
}

function gameOver() {
  ctx.font = "23px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("GAME OVER: " + score, 8, 60);
}


//print paint cans on screen
function PaintBoard() {
  for (var i = 0; i < paintCans.length; i++) {
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

function laneChange(colour, lane) {
  var c = document.getElementById("Canvas");
  var ctx = c.getContext("2d");

  if (lane == 0)
    ctx.fillRect(5, 200, 90, 425);
  if (lane == 1)
    ctx.fillRect(95, 200, 90, 425);
  if (lane == 2)
    ctx.fillRect(185, 200, 90, 425);
  if (lane == 3)
    ctx.fillRect(275, 200, 90, 425); 

  ctx.fillStyle = colour; 
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



var PaintTimer = function(id, colour, x, y) {
  this.id = id;
  this.colour = colour;
  this.x = x;
  this.y = y;
};
  

var spawnRadius = 40; 
var paintTimers = [];
makePaintBalls();
 
function makePaintTimers() {
  var xt = 50;
  var startPoint = canvas.height - 520;
  for (var i = 0; i < paintBalls.length; i++) {
    if (i != 0) xt += 90; 
    var id = i;
    var paintTimer = new PaintTimer(id, paintBalls[i].colour, xt, startPoint);
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
  
 var endPercent = 201;
 var curPerc = 0; 
 var circ = Math.PI * 2;
 var quart = Math.PI / 2;

 var start = true;

 
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
    //console.log("Ball moving: (x,y) ", x, ", ", y, ctx.fillStyle)
  
       //PaintTimers(paintTimers[0].colour, paintTimers[0].x, paintTimers[0].y); 
       PaintTimers(paintTimers[1].colour, paintTimers[1].x, paintTimers[1].y);

       ctx.clearRect(0, 0, canvas.width, canvas.height);
       ctx.beginPath();
       ctx.arc(paintTimers[1].x, paintTimers[1].y, spawnRadius, -(quart), ((circ) * (curPerc / 200)) - quart, false);
       ctx.stroke();
       curPerc++;
       if (curPerc < endPercent) {
           requestAnimationFrame(function () {
               curPerc / 200 
           });
       }else {
         //ctx.clearRect(0, 0, canvas.width, canvas.height);
       }

    PaintArms() 
    PaintBoard();
    drawScore();
 
    for (var i = 0; i < paintBalls.length; i++) {

      if (start) {
        drawBall(paintBalls[i].colour, paintBalls[i].x, paintBalls[i].y, paintBalls[i].switched);
       
       setTimeout(function () {
          start=false;
       }, 2000);

      }


        //PaintTimers(paintTimers[i].colour, paintTimers[i].x, paintTimers[i].y);

        paintBalls[i].x = paintBalls[i].x;

        if (paintBalls[i].y < canvas.height - ballRadius && paintBalls[i].switched == false) {
            paintBalls[i].y += dy;
        } else {
            paintBalls[i].y -= dy;
            paintBalls[i].switched = true;
            // laneChange(paintBalls[i].colour, paintBalls[i].lane);
            // PaintBoard(); 
            // drawBall(paintBalls[i].colour, paintBalls[i].x,  paintBalls[i].y,  paintBalls[i].switched);   
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
/*
    var row = [4, 8, 12, 16]; 
    for (var lane = 0; lane < 4; lane++) {
        if ((xClick > paintBalls[lane].x - ballRadius && xClick < (20 + ballRadius) + paintBalls[lane].x) && (yClick > paintBalls[lane].y - ballRadius && yClick < ballRadius + paintBalls[lane].y)) {
            for (var i = 0; i < row[i]; i++) { 
                if (paintBalls[lane].y > paintCans[i].yChord - canRadius && paintBalls[lane].y < canRadius + paintCans[i].yChord && paintBalls[lane].colour == paintCans[i].colour && paintBalls[lane].lane == paintCans[i].lane) {

                score += 5;

                if (lane == 0) paintBalls.shift();
                else paintBalls.splice(lane, 1);
                var newNr = (parseInt(Math.random() * 4));
                swtiched = true;
                var paintBall = new PaintBall(0, colours[newNr], xChord[(lane) * 4 + 1], canvas.height - 520, switched, lane);
                paintBalls.splice(lane, 0, paintBall);

                }
            }
        }
    }*/

    var newNr = (parseInt(Math.random() * 4));
    swtiched = true;

    if ((xClick > paintBalls[0].x - ballRadius && xClick < (20 + ballRadius) + paintBalls[0].x) && (yClick > paintBalls[0].y - ballRadius && yClick < ballRadius + paintBalls[0].y)) {
        for (var i = 0; i < 4; i++) {
            if (paintBalls[0].y > paintCans[i].yChord - canRadius && paintBalls[0].y < canRadius + paintCans[i].yChord && paintBalls[0].colour == paintCans[i].colour) {
                score += 5; 
                paintBalls.shift();   
                var paintBall = new PaintBall(0, colours[newNr], xChord[(0) * 4 + 1], canvas.height - 520, switched, 0);
                paintBalls.splice(0, 0, paintBall);

                paintTimers.shift();   
                var paintTimer = new PaintTimer(0, colours[newNr], xChord[(0) * 4 + 1], canvas.height - 520);
                paintTimers.splice(0, 0, paintTimer);

            }
        } 
    }
    if ((xClick > paintBalls[1].x - ballRadius && xClick < (20 + ballRadius) + paintBalls[1].x) && (yClick > paintBalls[1].y - ballRadius && yClick < ballRadius + paintBalls[1].y)) {
        for (var i = 4; i < 8; i++) {
            if (paintBalls[1].y > paintCans[i].yChord - canRadius && paintBalls[1].y < canRadius + paintCans[i].yChord && paintBalls[1].colour == paintCans[i].colour) {
                score += 5; 
                paintBalls.splice(1, 1);  
                var paintBall = new PaintBall(1, colours[newNr], xChord[(1) * 4 + 1], canvas.height - 520, switched, 1);
                paintBalls.splice(1, 0, paintBall); 

                paintTimers.splice(1, 1);   
                var paintTimer = new PaintTimer(1, colours[newNr], xChord[(1) * 4 + 1], canvas.height - 520);
                paintTimers.splice(1, 0, paintTimer);

            }
        } 
    }
    if ((xClick > paintBalls[2].x - ballRadius && xClick < (20 + ballRadius) + paintBalls[2].x) && (yClick > paintBalls[2].y - ballRadius && yClick < ballRadius + paintBalls[2].y)) {
        for (var i = 8; i < 12; i++) {
            if (paintBalls[2].y > paintCans[i].yChord - canRadius && paintBalls[2].y < canRadius + paintCans[i].yChord && paintBalls[2].colour == paintCans[i].colour) {
                score += 5; 
                paintBalls.splice(2, 1);  
                var paintBall = new PaintBall(1, colours[newNr], xChord[(2) * 4 + 1], canvas.height - 520, switched, 2);
                paintBalls.splice(2, 0, paintBall); 
            }
        } 
    }
    if ((xClick > paintBalls[3].x - ballRadius && xClick < (20 + ballRadius) + paintBalls[3].x) && (yClick > paintBalls[3].y - ballRadius && yClick < ballRadius + paintBalls[3].y)) {
        for (var i = 12; i < 16; i++) {
            if (paintBalls[3].y > paintCans[i].yChord - canRadius && paintBalls[3].y < canRadius + paintCans[i].yChord && paintBalls[3].colour == paintCans[i].colour) {
                score += 5; 
                paintBalls.splice(3, 1);  
                var paintBall = new PaintBall(1, colours[newNr], xChord[(3) * 4 + 1], canvas.height - 520, switched, 3);
                paintBalls.splice(3, 0, paintBall); 
            }
        } 
    }

 


}, false);





makePaintTimers(); 
makePaintCans();
window.onload = setInterval(draw, 15);

console.log("PAINTCANS: ", paintCans);
console.log("PAINTBALLS: ", paintBalls);
console.log("PAINTTIMERS: ", paintTimers);






/*
var objects = [];
function removeObject(id){
for(o in objects)
if(objects[o].id == id){
objects.splice(o, 1); 
break;
}
}

var PaintBall = function(colour, lane) {
this.id = nextId++;
this.colour = colour;
this.x = 50 + 90*(lane);
this.y = 143;
this.direction = 1;
this.lane = lane;
var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");

this.tick = function(){
this.y+=this.direction;
if(this.y == 600)
this.direction = -1;
if(this.y == 143){
removeObject(this.id);
setGameOver()
} 
};
this.click = function(xClick, yClick){
if ((xClick > this.x - ballRadius && xClick < (20 + ballRadius) + this.x) && (yClick > this.y - ballRadius && yClick < ballRadius + this.y)) {
for (var i = this.lane*4; i < (this.lane+1)*4; i++) {
if (this.y > paintCans[i].y - canRadius && this.y < canRadius + paintCans[i].y && this.colour == paintCans[i].colour) {
increaseScore(5);
removeObject(this.id);
}
}
}
};

this.draw = function(){
ctx.beginPath();
ctx.arc(this.x, this.y, ballRadius, 0, Math.PI * 2);
ctx.fillStyle = this.colour;
ctx.fill();
ctx.strokeStyle = '#003300';
ctx.lineWidth = 1;
ctx.stroke();
ctx.closePath();
};
objects.push(this);
};

var PaintCan = function(colour, x, y, lane) {
this.id = nextId++;
this.colour = colour;
this.x = x;
this.y = y;
this.lane = lane;
var c = document.getElementById("Canvas");
   var ctx = c.getContext("2d");
this.tick = function(){
};
this.draw = function(){
ctx.beginPath();
ctx.arc(this.x, this.y, canRadius, 0, 2 * Math.PI);
ctx.fillStyle = colour;
ctx.fill();
ctx.lineWidth = 5;
ctx.strokeStyle = '#003300';
ctx.stroke();
};
objects.push(this);
};*/