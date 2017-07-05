var name = "";
document.getElementById("start").onclick = function() {

    name = document.getElementById("user").value;
    console.log(name);
    document.getElementById("Canvas").style.display = "block";
    document.getElementById("startPage").style.display = "none";
    startGame();

};

function startGame() {


    var canvas = document.getElementById("Canvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 40;
    var canRadius = 42;
    var spawnRadius = 42;
    var dx = 0;
    var dy = 1;
    var switched = false;
    var score = 0;
    var elemLeft = canvas.offsetLeft;
    var elemTop = canvas.offsetTop;
    var paintCans = [];
    var paintBalls = [];
    var paintScores = [];
    var paintButtons = [];

    var paintTimers = [];

    var timerSpeed = 200;

    var xChord = [50, 50, 50, 50, 140, 140, 140, 140, 230, 230, 230, 230, 320, 320, 320, 320];
    var yChord = [250, 350, 450, 550, 250, 350, 450, 550, 250, 350, 450, 550, 250, 350, 450, 550];

    var colours = ["#D32F2F", "#1976D2", "#4CAF50", "#FBC02D"];



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
        ctx.strokeStyle = colour;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }

    function innerPaintBall(colour, x, y) {
        var innerColour;
        if (colour == colours[0]) innerColour = "#bd2a2a";
        if (colour == colours[1]) innerColour = "#166abd";
        if (colour == colours[2]) innerColour = "#449d48";
        if (colour == colours[3]) innerColour = "#e1ac28";

        ctx.arc(x, y, ballRadius - 2, 0, Math.PI * 2);
        ctx.fillStyle = colour;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = innerColour;
        ctx.stroke();
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

        var master16Arr = [];

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
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#003300';
            ctx.stroke();
            innerPaintCircle(i);
            //whiteInnerPaintCan(i); 
        }
    }

    function innerPaintCircle(i) {
        var innerColour;
        if (paintCans[i].colour == colours[0]) innerColour = "#bd2a2a";
        if (paintCans[i].colour == colours[1]) innerColour = "#166abd";
        if (paintCans[i].colour == colours[2]) innerColour = "#449d48";
        if (paintCans[i].colour == colours[3]) innerColour = "#e1ac28";

        var centerleftX = canvas.width / 4;
        var centerRightX = 3 * canvas.width / 4;
        var centerY = canvas.height / 2;
        var radius = 70;

        ctx.beginPath();
        ctx.arc(paintCans[i].xChord, paintCans[i].yChord, canRadius - 1, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(paintCans[i].xChord, paintCans[i].yChord, canRadius - 4, 0, 2 * Math.PI);
        ctx.fillStyle = paintCans[i].colour;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(paintCans[i].xChord, paintCans[i].yChord, canRadius - 6, 0, 2 * Math.PI);
        ctx.fillStyle = paintCans[i].colour;
        ctx.fill();
        ctx.lineWidth = 7;
        ctx.strokeStyle = innerColour;
        ctx.stroke();
    }

    function laneSwitch(colourLane, lane) {

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
            ctx.fillStyle = "#EFEFF4";
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#EFEFF4";
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
        ctx.arc(paintTimers[i].x, paintTimers[i].y, spawnRadius - 8, -(quart), ((circ) * (paintTimers[i].curPerc / timerSpeed)) - quart, false);
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
            ctx.fillStyle = paintScores[i].colour;
            ctx.fillRect(paintScores[i].x, paintScores[i].y, paintScores[i].width, paintScores[i].height);

            drawPaintScore(paintScores[i].colour, i);
        }
    }

    function addPaintScore(colour, y, height) {

        var increasePaintScoreY = 6;
        var increasePaintScoreHeight = 6;
        var scoreMAX = 5;

        for (var i = 0; i < 4; i++) {
            if (colour == colours[i]) {
                paintScores[i].y = paintScores[i].y - increasePaintScoreY;
                paintScores[i].height = paintScores[i].height + increasePaintScoreHeight;
                if (paintScores[i].amount == scoreMAX) {
                    paintScores[i].amount = 0;
                    paintScores[i].y = 51;
                    paintScores[i].height = 5;
                } else paintScores[i].amount++;
            }
        }
    }


    function drawPaintScore(colour, i) {
        ctx.font = "24px Arial";
        ctx.fillStyle = colour;

        if (i == 0) ctx.fillText(paintScores[0].amount, 133, 48);
        if (i == 1) ctx.fillText(paintScores[1].amount, 133 + 65, 48);
        if (i == 2) ctx.fillText(paintScores[2].amount, 133 + 65 + 65, 48);
        if (i == 3) ctx.fillText(paintScores[3].amount, 133 + 65 + 65 + 65, 48);
    }



    var PaintButton = function(id, colour, x, centerY, pushed) {
        this.id = id;
        this.colour = colour;
        this.x = x;
        this.centerY = centerY;
        this.pushed = pushed;
    };

    function makePaintButtons() {
        var xt = -54;
        var centerY = 622;

        for (var i = 0; i < 4; i++) {
            if (i != 0) xt += 36;
            var id = i;
            var paintButton = new PaintButton(id, colours[i], xt, centerY, false);
            paintButtons.push(paintButton);
        }
    }

    function animateButton(i, reset) {

        if (paintButtons[i].centerY <= 630 && paintButtons[i].pushed) {
            paintButtons[i].centerY += 1;
        } else {
            paintButtons[i].pushed = false;
        }

        if (reset) paintButtons[i].centerY = 622;
    }

    function paintButton(i) {

        var centerYb = 630;
        var radius = 13;

        //-----colour bottom circle static
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(2.5, 0.5);
        ctx.beginPath();
        ctx.arc(paintButtons[i].x, centerYb, radius, 0, 2 * Math.PI, false);
        ctx.restore();
        ctx.fillStyle = paintBalls[i].colour;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#575b5d";
        ctx.stroke();

        //-----colour top circle move down
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(2.5, 0.5);
        ctx.beginPath();
        ctx.arc(paintButtons[i].x, paintButtons[i].centerY, radius, 0, 2 * Math.PI, false);
        ctx.restore();
        ctx.fillStyle = paintBalls[i].colour;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#575b5d";
        ctx.stroke();

    }

    function paintButtonBase(x) {
        var radius = 13;

        //-----grey circle static
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(3, 0.6);
        ctx.beginPath();
        ctx.arc(x, 528, radius, 0, 2 * Math.PI, false);
        ctx.restore();
        ctx.fillStyle = '#aaaaaa';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#9E9E9E";
        // ctx.strokeStyle = "#aaaaaa";   
        ctx.stroke();
    }

    function paintButtonsAll() {
        for (var i = 0; i < paintBalls.length; i++) {
            paintButtonBase(i * 30 - 45);
            paintButton(i);
        }
    }





    // ---------------------- drawScore()/gameOver() 
    // \/ + draw walls 


    function drawScore() {
        ctx.font = "24px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText("Score", 9, 35);
        ctx.fillText(score, 9, 55);
    }

    function gameOver() {
        ctx.font = "23px Arial";
        ctx.fillStyle = "#FF0000";
        ctx.fillText("GAME OVER: " + score, 8, 97);

        document.getElementById("Canvas").style.display = "none";
        document.getElementById("showName").innerHTML = name;
        document.getElementById("showScore").innerHTML = score;
        document.getElementById("startPage").style.display = "block";
        document.getElementById("startPage").style.display = "block";

    }

    function drawWalls() {

        ctx.beginPath();
        ctx.strokeStyle = '#bbbbbb';
        ctx.lineWidth = 2;

        //centerTop1
        ctx.moveTo(371, 72);
        ctx.lineTo(4, 72);
        //centerTop2
        ctx.moveTo(370, 195);
        ctx.lineTo(5, 195);
        //centerTop2
        ctx.moveTo(370, 200);
        ctx.lineTo(5, 200);
        //centerBottom
        ctx.moveTo(360, 630);
        ctx.lineTo(15, 630);

        ctx.stroke();
        ctx.closePath();
    }



    /* ADDED NEW NEED TO CHECK-------------------------------------- */
    var alpha = 1.0;
    var globalPaintCanClickx = 0;
    var globalPaintCanClicky = 0;

    function animatePoint(text, x, y, showPoint) {
        if (showPoint) {
            ctx.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
            ctx.font = "italic 20pt Arial";
            ctx.fillText(text, x - 20, y + 10);
            alpha = alpha - 0.005;
        }
    }
    /* ADDED NEW NEED TO CHECK-------------------------------------- */



    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //console.log("Ball moving: (x,y) ", x, ", ", y, ctx.fillStyle)

        PaintScores();
        drawPaintScore();
        paintBucketDrawer();
        PaintArms();
        drawScore();
        drawWalls();
        paintButtonsAll();

        for (var i = 0; i < paintBalls.length; i++) {

            PaintBoard(paintBalls[i].lane);

            if (paintTimers[i].running == true) {
                animateTimer(i);
            } else {
                drawBall(paintBalls[i].colour, paintBalls[i].x, paintBalls[i].y, paintBalls[i].switched);
                innerPaintBall(paintBalls[i].colour, paintBalls[i].x, paintBalls[i].y, paintBalls[i].switched);

                if (paintBalls[i].y < canvas.height - 18 - ballRadius && paintBalls[i].switched == false) {
                    paintBalls[i].y += dy;
                } else {
                    laneSwitch(paintBalls[i].colour, paintBalls[i].lane);
                    PaintBoard(paintBalls[i].lane);

                    drawBall(paintBalls[i].colour, paintBalls[i].x, paintBalls[i].y, paintBalls[i].switched);
                    innerPaintBall(paintBalls[i].colour, paintBalls[i].x, paintBalls[i].y, paintBalls[i].switched);


                    paintBalls[i].y -= dy;
                    paintBalls[i].switched = true;

                    paintButtons[i].pushed = true;
                }
                animateButton(paintBalls[i].lane, false);
            }


            if (paintBalls[i].y <= 140) {
                console.log("game over")
                y = 0;
                for (var i = 1; i < 99999; i++) window.clearInterval(i);
                gameOver();

                /*  if (name != "") {    
                        console.log(name, score); 

                     }*/

            }
        }
        /* ADDED NEW NEED TO CHECK-------------------------------------- */
        if (alpha >= 1) {
            animatePoint('+5', globalPaintCanClickx, globalPaintCanClicky, false);
            alpha = 1;
        } else {
            animatePoint('+5', globalPaintCanClickx, globalPaintCanClicky, true);
            alpha = alpha - 0.005;
            if (alpha <= 0) alpha = 1.0;
        }
        /* ADDED NEW NEED TO CHECK-------------------------------------- */

    }

    var event = '';
    if (screen.width <= 480) event = 'touchstart';
    else event = 'click';

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    if (isAndroid) {
        event = 'click';
    }

    canvas.addEventListener(event, function(event) {
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
                            /* ADDED NEW NEED TO CHECK-------------------------------------- */
                            animatePoint('+5', paintCans[i].xChord, paintCans[i].yChord, true);
                            globalPaintCanClickx = paintCans[i].xChord;
                            globalPaintCanClicky = paintCans[i].yChord;
                            /* ADDED NEW NEED TO CHECK-------------------------------------- */

                            if (score % 100 == 0) changePaintBoard();
                            if (score % 20 == 0) dy = dy + 0.1;

                            console.log(paintBalls[lane].colour, paintScores[lane].y, paintScores[lane].height);
                            addPaintScore(paintBalls[lane].colour, paintScores[lane].y, paintScores[lane].height);

                            if (lane == 0) paintBalls.shift();
                            else paintBalls.splice(lane, 1);
                            var newNr = (parseInt(Math.random() * 4));
                            swtiched = true;
                            var paintBall = new PaintBall(0, colours[newNr], xChord[(lane) * 4 + 1], canvas.height - 520, switched, lane);
                            paintBalls.splice(lane, 0, paintBall);

                            paintTimers[lane].running = true;


                            paintButtons[lane].pushed = false;
                            animateButton(paintBalls[lane].lane, true);




                        }
                    }
                }
            }
        }
    }, false);





    function paintBucketDrawer() {

        //paintCan 0
        ctx.beginPath();
        ctx.strokeStyle = "#999999";
        ctx.lineWidth = 2;
        ctx.moveTo(113, 55);
        ctx.bezierCurveTo(135, 70, 180, 60, 169, 53);
        ctx.moveTo(113.5, 10);
        ctx.lineTo(113.5, 55);
        ctx.moveTo(170.5, 10);
        ctx.lineTo(170.5, 55);
        ctx.stroke();
        ctx.beginPath();
        //ctx.ellipse(142, 9, 7, 29, 90 * Math.PI/180, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ////ctx.ellipse(142, 9, 2.5, 21, 90 * Math.PI/180, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.rect(154, 20, 9, 35);
        ctx.lineWidth = 1;
        ctx.stroke();

        //paintCan 1
        ctx.beginPath();
        ctx.strokeStyle = "#999999";
        ctx.lineWidth = 2;
        ctx.moveTo(236, 55);
        ctx.bezierCurveTo(225, 70, 175, 60, 179, 54);
        ctx.moveTo(178, 10);
        ctx.lineTo(178, 55);
        ctx.moveTo(235, 10);
        ctx.lineTo(235, 55);
        ctx.stroke();
        ctx.beginPath();
        //ctx.ellipse(242-35, 9, 7, 29, 90 * Math.PI/180, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = 1;
        //ctx.ellipse(242-35, 9, 2.5, 21, 90 * Math.PI/180, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.rect(254 - 35, 20, 9, 35);
        ctx.lineWidth = 1;
        ctx.stroke();

        //paintCan 2 
        ctx.beginPath();
        ctx.strokeStyle = "#999999";
        ctx.lineWidth = 2;
        ctx.moveTo(301, 55);
        ctx.bezierCurveTo(290, 70, 236, 60, 244, 54);
        ctx.moveTo(243, 10);
        ctx.lineTo(243, 55);
        ctx.moveTo(301, 10);
        ctx.lineTo(301, 55);
        ctx.stroke();
        ctx.beginPath();
        //ctx.ellipse(272, 9, 7, 29, 90 * Math.PI/180, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        //ctx.ellipse(272, 9, 2.5, 21, 90 * Math.PI/180, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.rect(284, 20, 9, 35);
        ctx.lineWidth = 1;
        ctx.stroke();

        //paintCan 3 
        ctx.beginPath();
        ctx.strokeStyle = "#999999";
        ctx.lineWidth = 2;
        ctx.moveTo(366, 55);
        ctx.bezierCurveTo(355, 70, 300, 60, 310, 54);
        ctx.moveTo(308, 10);
        ctx.lineTo(308, 55);
        ctx.moveTo(366, 10);
        ctx.lineTo(366, 55);
        ctx.stroke();
        ctx.beginPath();
        //ctx.ellipse(337, 9, 7, 29, 90 * Math.PI/180, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        //ctx.ellipse(337, 9, 2.5, 21, 90 * Math.PI/180, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.rect(350, 20, 9, 35);
        ctx.lineWidth = 1;
        ctx.stroke();

    }




















    function changePaintBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paintCans = [];
        makePaintCans();
    }



    makePaintBalls();
    makePaintTimers();
    makePaintCans();
    makePaintScores();
    makePaintButtons();
    window.onload = setInterval(draw, 10);

    console.log("PAINTCANS: ", paintCans);
    console.log("PAINTBALLS: ", paintBalls);
    console.log("PAINTTIMERS: ", paintTimers);
    console.log("PAINTSCORES: ", paintScores);
    console.log("PAINTBUTTONS: ", paintButtons);

}