console.log("burger.js");

var c = document.getElementById("playground");
var ctx = c.getContext("2d");
var cWidth = c.width;
var cHeight = c.height;
var playBtn = document.getElementById("play");
var pauseBtn = document.getElementById("pause");
var restartBtn = document.getElementById("restart");

var requestID;
var i;
var fallSpeed = 2;
var frameNumber;
var pattiesXcor;
var pattiesYcor;

var gameWon;

var originXcor;
var originYcor;
originYcor = cHeight - 40;
originXcor = cWidth/2;

var stackX;
var stackY;

// start new game - clear canvas and set up patties
var setUp = function() {
    window.cancelAnimationFrame(requestID);
    ctx.clearRect(0,0,cWidth,cHeight);
    frameNumber = 1;
    gameWon = false;
    pattiesXcor = [];
    pattiesYcor = [];    
    stackX = [];
    stackY = [];
    pattiesXcor.push(Math.floor(Math.random() * (cWidth - 50)) + 25);
    pattiesYcor.push(0);
};



var drawOriginBun = function() {
    ctx.beginPath();
    ctx.arc(originXcor,originYcor,28,0,Math.PI);
    ctx.closePath();
    ctx.strokeStyle = "#FCB54D";
    ctx.fillStyle = "#FCB54D";
    ctx.stroke();
    ctx.fill();
};

var moveOriginBun = function(e) {
    switch(e.keyCode){
    case 37:
        // Key left.console.log("left");
        originXcor -= 5; 
        break;
    case 39:
        // Key right.
        console.log("right"); 
        originXcor += 5; 
        break;
    default:
        break;
  }
  drawOriginBun();
};


// change pattiesXcor and pattiesYcor
var updatePatties = function() {
    // delete the lowest patty when it hits the bottom and add a new one
    if (pattiesYcor[0] == cHeight) {
        pattiesXcor.splice(0,1);
        pattiesYcor.splice(0,1);
        pattiesXcor.push(Math.floor(Math.random() * (cWidth - 50)) + 25);
        pattiesYcor.push(0);
    } else if (frameNumber%150 == 0) {
        // add another patty to the top of the canvas (end of array)
        pattiesXcor.push(Math.floor(Math.random() * (cWidth - 50)) + 25);
        pattiesYcor.push(0);
    }
    
    // move patties down
    if (frameNumber%2 == 1) {
        for (i=0;i<pattiesXcor.length;i++) {
            pattiesYcor[i] = pattiesYcor[i] + fallSpeed;
        }
    }
    // checks if patties hit origin bun
    if ((pattiesXcor[0] > originXcor - 5 && pattiesXcor[0] < originXcor + 5)&&(pattiesYcor[0] == originYcor)){
        if (stackX[stackX.length - 1] != pattiesXcor[0]){
            stackX.push(pattiesXcor[0]);
        }
        if (stackY[stackY.length - 1] != pattiesYcor[0]){
        stackY.push(pattiesYcor[0]);
        }
        console.log(stackX);
        //originYcor += cHeight - pattiesYcor[0];
    }
};

// draw different patties depending on pattyType
var drawPatty = function(pattyType){
  ctx.beginPath();
  switch (pattyType){
    case 1:
        // wilted lettuce
        ctx.rect(pattiesXcor[i]-25,pattiesYcor[i]-2,50,4);
        ctx.strokeStyle = "#70B226";
        ctx.fillStyle = "#70B226";
        break;
    case 2:
        // slice o' tomato
        ctx.rect(pattiesXcor[i]-25,pattiesYcor[i]-6,50,12);
        ctx.strokeStyle = "#DF3232";
        ctx.fillStyle = "#DF3232";            
        break;
    case 3:
        // good ol' american cheese
        ctx.rect(pattiesXcor[i]-25,pattiesYcor[i]-4,50,8);
        ctx.strokeStyle = "#FFD700";
        ctx.fillStyle = "#FFD700";
        break;
    case 4:
        // carb-y burger bun
        ctx.arc(pattiesXcor[i],pattiesYcor[i],28,Math.PI,0);
        ctx.lineTo(pattiesXcor[i]-28,pattiesYcor[i]);
        ctx.strokeStyle = "#FCB54D";
        ctx.fillStyle = "#FCB54D";
        break;
    default:
        // meaty burger patty 
        ctx.rect(pattiesXcor[i]-25,pattiesYcor[i]-10,50,20);
        ctx.strokeStyle = "#8B4513";
        ctx.fillStyle = "#8B4513";
        break;
    }
    ctx.stroke();
    ctx.fill();
};

// draw all patties in pattiesXcor and stackX
var drawPatties = function() {
    for (i=0;i<pattiesXcor.length;i++) {
      drawPatty(pattiesXcor[i]%6);
    }
    for (i=0;i<stackX.length;i++) {
      drawPatty(stackX[i]%6);
    }
};


var play = function() {
    ctx.clearRect(0,0,cWidth,cHeight);
    drawPatties();
    drawOriginBun();
    updatePatties(); 
    requestID = window.requestAnimationFrame(play);
    frameNumber++;
    
   if (gameWon){
        fallSpeed++;
        setup();
    }
};

var pause = function() {
    window.cancelAnimationFrame(requestID);
};

playBtn.addEventListener("click",play);
pauseBtn.addEventListener("click",pause);
restartBtn.addEventListener("click",setUp);
window.addEventListener("keydown", moveOriginBun);

setUp();