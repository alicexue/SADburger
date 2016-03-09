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

var gameWon;

var originXcor = cWidth/2;
var originYcor = cHeight - 40;

var patties;
var stack;
var stackPointer;

// start new game - clear canvas and set up patties
var setUp = function() {
    window.cancelAnimationFrame(requestID);
    ctx.clearRect(0,0,cWidth,cHeight);
    frameNumber = 1;
    gameWon = false;
		patties = [];
		stack = [];
		stackPointer = null;
		patties.push({xcor: Math.floor(Math.random() * (cWidth - 50)) + 25,
									ycor: 0});
		setType(patties[0]);
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
		if (patties[0]["ycor"] == cHeight) {
				patties.splice(0,1);
				patties.push({xcor: Math.floor(Math.random() * (cWidth - 50)) + 25,
											ycor: 0});
				setType(patties[patties.length-1]);
				
				
		} else if (frameNumber%150 == 0) {
				// add another patty to the top of the canvas (end of array)
				patties.push({xcor: Math.floor(Math.random() * (cWidth - 50)) + 25,
											ycor: 0});
				setType(patties[patties.length-1]);
		}
    
		// move patties down
		if (frameNumber%2 == 1) {
				for (i=0;i<patties.length;i++) {
						patties[i]["ycor"] += fallSpeed;
				}
		}
		// checks if patties hit origin bun
		if (stackPointer == null){
				if ((Math.abs(patties[0]["xcor"] - originXcor) < 50)&&(patties[0]["ycor"] == originYcor)){
						stack.push(patties.splice(0,1));
						stackPointer = stack[0];
						//console.log(stack);
				}
		}
		else {
				if ((Math.abs(patties[0]["xcor"] - originXcor) < 50)&&(patties[0]["ycor"]== stackPointer["ycor"])){
						stack.push(patties.splice(0,1));
						stackPointer = stack[stack.length - 1];
						//console.log(stack);
				}
		}				
};

//gives patty a random type defined by height and color style
var setType = function(patty){
		var pattyType = Math.floor(Math.random() * 5);
		switch(pattyType){
		case 1:
				// wilted lettuce
				patty["style"] = "#70B226";
				patty["height"] = 4;
				break;
		case 2:
				// slice o' tomato
				patty["style"] = "#DF3232";
				patty["height"] = 12;           
				break;
		case 3:
				// good ol' american cheese
				patty["style"] = "#FFD700";
				patty["height"] = 8;
				break;
		case 4:
				// carb-y burger bun
				patty["style"] = "#FCB54D";
				patty["radius"] = 28;
				break;
		default:
				// meaty burger patty
				patty["style"] = "#8B4513";
				patty["height"] = 20;
				break;
		}
};

// draw different patties depending on patty
// patty is object
var drawPatty = function(patty){
		ctx.beginPath();
		ctx.strokeStyle = patty["style"];
		ctx.fillStyle = patty["style"];
		if (patty.hasOwnProperty("radius")){
				ctx.arc(patty["xcor"], patty["ycor"], patty["radius"], Math.PI, 0);
				ctx.lineTo(patty["xcor"]-28, patty["ycor"]);
		}
		else if (patty.hasOwnProperty("height")){
				ctx.rect(patty["xcor"]-25, patty["ycor"]-patty["height"]/2, 50, patty["height"]);
		}
		ctx.stroke();
		ctx.fill();
};

// draw all patties in pattiesXcor and stackX
var drawPatties = function() {
		for (i=0;i<patties.length;i++) {
				drawPatty(patties[i]);
		}
		for (i=0;i<stack.length;i++) {
				drawPatty(stack[i]);
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
