var canvas = document.getElementById("Canvas");
var ctx = canvas.getContext("2d");
var ballRadius = 20;
var canRadius = 40;
var x = canvas.width/9;
var y = canvas.height-520;
var dx = 0;
var dy = -1;
var score = 0;
var elemLeft = canvas.offsetLeft;
var elemTop = canvas.offsetTop;   
var paintCans = []; 
var paintBalls = []; 

var xChord = [50, 50, 50, 50, 140, 140, 140, 140, 230, 230, 230, 230, 320, 320, 320, 320]  ;
var yChord = [250, 350, 450, 550, 250, 350, 450, 550, 250, 350, 450, 550, 250, 350, 450, 550];

var colours = ["#D32F2F", "#1976D2", "#4CAF50", "#FBC02D"];
var master16Arr = [];


var PaintBall = function (id, color, x, y) {
  this.id = id;
  this.color = color; 
  this.x = x;
  this.y = y;
};
  
function makePaintBalls() {
 	var xt = 50;
	for (var i=0; i<4; i++){ 
		if (i!=0) xt+=90;
		var newNr = (parseInt(Math.random() * 4));
		var id = i;
		var paintBall = new PaintBall(id, colours[newNr], xt, y); 	
		paintBalls.push(paintBall);
	}
}

var PaintCan = function (id, color, xChord, yChord) {
  this.id = id;
  this.color = color; 
  this.xChord = xChord;
  this.yChord = yChord;
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
    for (var i=0; i<16; i++) {
        id = i;  
        var paintCan = new PaintCan(id, colours[master16Arr[i]], xChord[i], yChord[i]); 
        paintCans.push(paintCan);   
    } 
}
 
function drawBall(colour, x, y) { 
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
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
    ctx.fillText("Score: "+score, 8, 30);
}

function gameOver() {
    ctx.font = "23px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("GAME OVER: "+score, 8, 60);
}


//print paint cans on screen
function PaintBoard() { 
    for (var i=0; i<paintCans.length; i++) {
        var c = document.getElementById("Canvas");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.arc(paintCans[i].xChord,paintCans[i].yChord,canRadius,0,2*Math.PI);
        ctx.fillStyle = paintCans[i].color;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }
}

function PaintArms() { 
    var j = 0;
    for (var i=0; i<paintCans.length/4; i++) { 
        var c = document.getElementById("Canvas");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.arc(50+j,140,40,0,2*Math.PI);
        ctx.fillStyle = "#9E9E9E";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        j+=90;
    }
}



   
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    PaintArms();
    PaintBoard();
    drawScore();  
    //console.log("Ball moving: (x,y) ", x, ", ", y, ctx.fillStyle)
      
    for (var i = 0; i < paintBalls.length; i++) {
    	drawBall(paintBalls[i].color, paintBalls[i].x,  paintBalls[i].y);   
	    paintBalls[i].x = paintBalls[i].x;
	    paintBalls[i].y = paintBalls[i].y;
        paintBalls[i].y -= dy;
	}
 
    if(y - dy > canvas.height-ballRadius || y - dy-100 < ballRadius) {
        dy = -dy;
        console.log("SWITCH")
    }  
    if(y==138) { 
        console.log("game over")
        y=0;
        for (var i = 1; i < 99999; i++) window.clearInterval(i);
       		gameOver();
    	}   
    x += dx;
    y -= dy;
}


 
canvas.addEventListener('mousedown', function(event) {
    var xClick = event.pageX - elemLeft;
    var yClick = event.pageY - elemTop;

    console.log("CLICKED------->", xClick, yClick);
    //console.log("ballradius",  ballRadius+x, x-ballRadius,  ballRadius+y, y-ballRadius); 
    
	 		
 
    var row = [4, 8, 12, 16];
    dance:
    for (var lane = 0; lane < 4; lane++) {
        if ((xClick > paintBalls[lane].x-ballRadius && xClick < (20+ballRadius)+paintBalls[lane].x) && (yClick > paintBalls[lane].y-ballRadius && yClick < ballRadius+paintBalls[lane].y)) { 
            for (var i = lane; i < row[lane]; i++) {
                if ((xClick > paintBalls[lane].x-ballRadius && xClick < (20+ballRadius)+paintBalls[lane].x) && (yClick > paintBalls[lane].y-ballRadius && yClick < ballRadius+paintBalls[lane].y)) {
                    if (paintBalls[lane].y > paintCans[i].yChord-canRadius && paintBalls[lane].y < canRadius+paintCans[i].yChord && paintBalls[lane].color == paintCans[i].color) { 

                        score+=5;
                        
                        if (lane==0) paintBalls.shift();
                        else paintBalls.splice(lane,1);
                        var newNr = (parseInt(Math.random() * 4));
                        swtiched = true;
                        var paintBall = new PaintBall(0, colours[newNr], xChord[(lane)*4+1], canvas.height-520, switched, lane);    
                        paintBalls.splice(lane, 0, paintBall);   
                        break dance;
                    }
                } 
            }
        } 
    }

}, false); 


/*
//Lane 1 
    if ((xClick > paintBalls[0].x-ballRadius && xClick < (5+ballRadius)+paintBalls[0].x) && (yClick > paintBalls[0].y-ballRadius && yClick < ballRadius+paintBalls[0].y)) { 
        var pcColor1;
        var pcyChord1;
        for (var i = 0; i < 4; i++) {
            if (paintBalls[0].y > paintCans[i].yChord-canRadius && paintBalls[0].y < canRadius+paintCans[i].yChord) {
                pcColor1 = paintCans[i].color;
                pcyChord1 = paintCans[i].yChord;
                console.log(pcColor1, paintCans[i].yChord - canRadius, paintCans[i].yChord + canRadius);
            }
        }
        if ((xClick > paintBalls[0].x-ballRadius && xClick < (5+ballRadius)+paintBalls[0].x) && (yClick > paintBalls[0].y-ballRadius && yClick < ballRadius+paintBalls[0].y)) {
            console.log("ball y: ", paintBalls[0].y); 
            console.log(paintBalls[0].color)
            console.log(pcColor1)

            if (paintBalls[0].y > pcyChord1-canRadius && paintBalls[0].y < canRadius+pcyChord1 && paintBalls[0].color == pcColor1) { 
                score+=5; 

                console.log(paintBalls[0].y);
                console.log("----------------------"); 
 
                paintBalls.shift(); 
                var newNr = (parseInt(Math.random() * 4));
                var paintBall = new PaintBall(0, colours[newNr], 50, canvas.height-520);   
                paintBalls.splice(0, 0, paintBall); 

            }
        }
    }

//Lane 2
    if ((xClick > paintBalls[1].x-ballRadius && xClick < (5+ballRadius)+paintBalls[1].x) && (yClick > paintBalls[1].y-ballRadius && yClick < ballRadius+paintBalls[1].y)) { 
        var pcColor2;
        var pcyChord2;
        for (var i = 4; i < 8; i++) {
            if (paintBalls[1].y > paintCans[i].yChord-canRadius && paintBalls[1].y < canRadius+paintCans[i].yChord) {
                pcColor2 = paintCans[i].color;
                pcyChord2 = paintCans[i].yChord;
                console.log(pcColor2, paintCans[i].yChord - canRadius, paintCans[i].yChord + canRadius);
            }
        }
        if ((xClick > paintBalls[1].x-ballRadius && xClick < (5+ballRadius)+paintBalls[1].x) && (yClick > paintBalls[1].y-ballRadius && yClick < ballRadius+paintBalls[1].y)) {
            console.log("ball y: ", paintBalls[1].y);
            console.log(paintBalls[1].color)
            console.log(pcColor2)

            if (paintBalls[1].y > pcyChord2-canRadius && paintBalls[1].y < canRadius+pcyChord2 && paintBalls[1].color == pcColor2) { 
                score+=50;

                console.log(paintBalls[1].y);
                console.log("----------------------");
 
                paintBalls.splice(1,1);
                var newNr = (parseInt(Math.random() * 4));
                var paintBall = new PaintBall(1, colours[newNr], 140, canvas.height-520);   
                paintBalls.splice(1, 0, paintBall); 

            }
        }
    }
//Lane 3
    if ((xClick > paintBalls[2].x-ballRadius && xClick < (5+ballRadius)+paintBalls[2].x) && (yClick > paintBalls[2].y-ballRadius && yClick < ballRadius+paintBalls[2].y)) { 
        var pcColor3;
        var pcyChord3;
        for (var i = 8; i < 12; i++) {
            if (paintBalls[2].y > paintCans[i].yChord-canRadius && paintBalls[2].y < canRadius+paintCans[i].yChord) {
                pcColor3 = paintCans[i].color;
                pcyChord3 = paintCans[i].yChord;
                console.log(pcColor3, paintCans[i].yChord - canRadius, paintCans[i].yChord + canRadius);
            }
        }
        if ((xClick > paintBalls[2].x-ballRadius && xClick < (5+ballRadius)+paintBalls[2].x) && (yClick > paintBalls[2].y-ballRadius && yClick < ballRadius+paintBalls[2].y)) {
            console.log("ball y: ", paintBalls[2].y);
            console.log(paintBalls[2].color)
            console.log(pcColor3)

            if (paintBalls[2].y > pcyChord3-canRadius && paintBalls[2].y < canRadius+pcyChord3 && paintBalls[2].color == pcColor3) { 
                score+=500;

                console.log(paintBalls[2].y);
                console.log("----------------------");
 
                paintBalls.splice(2,1);
                var newNr = (parseInt(Math.random() * 4));
                var paintBall = new PaintBall(2, colours[newNr], 230, canvas.height-520);   
                paintBalls.splice(2, 0, paintBall); 

            }
        }
    }
 //Lane 4
    if ((xClick > paintBalls[3].x-ballRadius && xClick < (5+ballRadius)+paintBalls[3].x) && (yClick > paintBalls[3].y-ballRadius && yClick < ballRadius+paintBalls[3].y)) { 
        var pcColor3;
        var pcyChord3;
        for (var i = 12; i < 16; i++) {
            if (paintBalls[3].y > paintCans[i].yChord-canRadius && paintBalls[3].y < canRadius+paintCans[i].yChord) {
                pcColor3 = paintCans[i].color;
                pcyChord3 = paintCans[i].yChord;
                console.log(pcColor3, paintCans[i].yChord - canRadius, paintCans[i].yChord + canRadius);
            }
        }
        if ((xClick > paintBalls[3].x-ballRadius && xClick < (5+ballRadius)+paintBalls[3].x) && (yClick > paintBalls[3].y-ballRadius && yClick < ballRadius+paintBalls[3].y)) {
            console.log("ball y: ", paintBalls[3].y);
            console.log(paintBalls[3].color)
            console.log(pcColor3)

            if (paintBalls[3].y > pcyChord3-canRadius && paintBalls[3].y < canRadius+pcyChord3 && paintBalls[3].color == pcColor3) { 
                score+=500;

                console.log(paintBalls[3].y);
                console.log("----------------------");
 
                paintBalls.splice(3,1);
                var newNr = (parseInt(Math.random() * 4));
                var paintBall = new PaintBall(2, colours[newNr], 320, canvas.height-520);   
                paintBalls.splice(3, 0, paintBall); 

            }
        }
    }
}, false);*/









makePaintBalls();
makePaintCans();
window.onload = setInterval(draw, 15);

console.log("PAINTCANS: ", paintCans);  
console.log("PAINTBALLS: ", paintBalls); 