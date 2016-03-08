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
var frameNumber;
var pattiesXcor;
var pattiesYcor;

var setUp = function() {
    window.cancelAnimationFrame(requestID);
    ctx.clearRect(0,0,cWidth,cHeight);
    frameNumber = 1;
    pattiesXcor = [];
    pattiesYcor = [];    
    pattiesXcor.push(Math.floor(Math.random() * (cWidth - 50)) + 25);
    pattiesYcor.push(0);
}
setUp();

var updatePatties = function() {
    if (pattiesYcor[0] == cHeight) {
        pattiesXcor.splice(0,1);
        pattiesYcor.splice(0,1);
        pattiesXcor.push(Math.floor(Math.random() * (cWidth - 50)) + 25);
        pattiesYcor.push(0);
    } else if (frameNumber%150 == 0) {
        pattiesXcor.push(Math.floor(Math.random() * (cWidth - 50)) + 25);
        pattiesYcor.push(0);
    }
    
    if (frameNumber%2 == 1) {
        for (i=0;i<pattiesXcor.length;i++) {
            pattiesYcor[i] = pattiesYcor[i] + 1;
        }
    }
}


var drawPatties = function() {
    for (i=0;i<pattiesXcor.length;i++) {
        ctx.beginPath();
        // (pattieXcor[i], pattieYcor[i]) refer to bottom center of each rect
        var pattyType = pattiesXcor[i]%6;
        if (pattyType == 1) {
            // wilted lettuce
            ctx.rect(pattiesXcor[i]-25,pattiesYcor[i]-2,50,4);
            ctx.strokeStyle = "#70B226";
            ctx.fillStyle = "#70B226";
        } else if (pattyType == 2) {
            // slice o' tomato
            ctx.rect(pattiesXcor[i]-25,pattiesYcor[i]-6,50,12);
            ctx.strokeStyle = "#DF3232";
            ctx.fillStyle = "#DF3232";
        } else if (pattyType == 3) {
            // good ol' american cheese
            ctx.rect(pattiesXcor[i]-25,pattiesYcor[i]-4,50,8);
            ctx.strokeStyle = "#FFD700";
            ctx.fillStyle = "#FFD700";
        } else if (pattyType == 4) {
            // carb-y burger bun
            ctx.arc(pattiesXcor[i],pattiesYcor[i],28,Math.PI,0);
            ctx.lineTo(pattiesXcor[i]-28,pattiesYcor[i]);
            ctx.strokeStyle = "#FCB54D";
            ctx.fillStyle = "#FCB54D";
        } else {
            // meaty burger patty 
            ctx.rect(pattiesXcor[i]-25,pattiesYcor[i]-10,50,20);
            ctx.strokeStyle = "#8B4513";
            ctx.fillStyle = "#8B4513";
        }
        ctx.stroke();
        ctx.fill();
    }
}


var play = function() {
    ctx.clearRect(0,0,cWidth,cHeight);
    drawPatties();
    updatePatties();    
    requestID = window.requestAnimationFrame(play);
    frameNumber++;
}

var pause = function() {
    window.cancelAnimationFrame(requestID);
};

playBtn.addEventListener("click",play);
pauseBtn.addEventListener("click",pause);
restartBtn.addEventListener("click",setUp);