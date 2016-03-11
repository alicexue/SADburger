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

var level = 1;
var score;
var scount;

var originXcor = cWidth/2;
var originYcor = cHeight - 40;

var patties;
var stack;
var stackPointer;

// start new game - clear canvas and set up patties
var setUp = function() {
    ctx.clearRect(0,0,cWidth,cHeight);
    frameNumber = 1;
    gameWon = false;
	patties = [];
	stack = [];
	score = 0;
	stackPointer = null;
	patties.push({xcor: Math.floor(Math.random() * (cWidth - 50)) + 25,	ycor: 0});
	setType(patties[0]);
	originXcor = cWidth/2;
	originYcor = cHeight - 40;
};


var checkWon = function() {
	if (stackPointer != null && stackPointer["ycor"] - stackPointer["height"] <= 0) {
		gameWon = true;
		console.log("WON!");
	}
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
	var delta;
	if (e.keyCode == 37 || e.keyCode == 39){
		if (e.keyCode == 37)
			delta = -10;
		if (e.keyCode == 39)
			delta = 10;
		var nextStep = originXcor + delta + 28*delta/10;
		var canMove = true;
		if (nextStep >= 0 && nextStep <= cWidth) {
			originXcor += delta;
		} else {
			canMove = false;
		}
		updateStack(delta,canMove);
		drawOriginBun();
	}
};

var updateStack = function(delta,canMove){
	var j = 0;
	var h;
	while (j < stack.length){
		if (canMove)
			stack[j]["xcor"] += (stack[j]["ycor"] / cHeight + 0.21) * delta;
		if (Math.abs(stack[j]["xcor"] - originXcor) >= 50){
			patties.push(stack[j]);
			if (stack[j] === stackPointer){
				if (j - 1 < 0)
					stackPointer = null;
				else
					stackPointer = stack[j - 1];
			}
			for (h = j + 1; h < stack.length; h++){
				stack[h]["ycor"] += stack[j]["height"] + 2;
			}
			score -= stack[j]["value"];
			stack.splice(j,1);
		}else 
			j++;
	}
};


// change pattiesXcor and pattiesYcor
var updatePatties = function() {
	/*
		// delete the lowest patty when it hits the bottom and add a new one
		if (patties.length > 0 && patties[0]["ycor"] == cHeight) {
				patties.splice(0,1);
				patties.push({xcor: Math.floor(Math.random() * (cWidth - 50)) + 25,
											ycor: 0});
				setType(patties[patties.length-1]);
				
				
		}*/ if (frameNumber%150 == 0) {
				// add another patty to the top of the canvas (end of array)
				patties.push({xcor: Math.floor(Math.random() * (cWidth - 50)) + 25,
											ycor: 0});
				setType(patties[patties.length-1]);
		}
    
		// move patties down
		if (frameNumber%2 == 1) {
			i = 0;
			while (i<patties.length) {
				patties[i]["ycor"] += fallSpeed;
				//attach first patty to originBun
				if (stackPointer == null &&
					Math.abs(patties[i]["xcor"] - originXcor) < 50 &&
					(patties[i]["ycor"] == originYcor || patties[i]["ycor"] == Math.ceil(originYcor/fallSpeed) * fallSpeed)){
					patties[i]["ycor"] = originYcor-2;
					stack.push(patties[i]);
					score += patties[i]["value"];
					patties.splice(i,1);
					stackPointer = stack[0];
				
				} else if (stackPointer != null &&
							Math.abs(stackPointer["xcor"]-patties[i]["xcor"]) < 50 &&
							Math.abs(stackPointer["ycor"]-stackPointer["height"]-patties[i]["ycor"])<=4){
								 	
					patties[i]["ycor"] = stackPointer["ycor"]-stackPointer["height"]-2;
					stack.push(patties[i]);
					score += patties[i]["value"];
					patties.splice(i,1);
					stackPointer = stack[stack.length - 1];
					//delete when patty hits bottom
				} else if (patties[i]["ycor"] >= cHeight){
					patties.splice(i,1);
				} else 
					i++;
		}
	}
	checkWon();
};

//gives patty a random type defined by height and color style
var setType = function(patty){
	var pattyType = Math.floor(Math.random() * 100)%6;
	switch(pattyType){
	case 1:
		// wilted lettuce
		patty["style"] = "#70B226";
		patty["height"] = 4;
		patty["value"] = 2;
		break;
	case 2:
		// slice o' tomato
		patty["style"] = "#DF3232";
		patty["height"] = 12;    
		patty["value"] = 4;
		break;
	case 3:
		// good ol' american cheese
		patty["style"] = "#FFD700";
		patty["height"] = 8;
		patty["value"] = 3;
		break;
	case 4:
		// repulsive mystery meat
		patty["style"] = "#000000";
		patty["height"] = 10;
		patty["value"] = -2;
		break;
	
	default:
		// meaty burger patty
		patty["style"] = "#8B4513";
		patty["height"] = 20;
		patty["value"] = 5;
		break;
	}
};

// draw different patties depending on patty
// patty is object
var drawPatty = function(patty){
	ctx.beginPath();
	ctx.strokeStyle = patty["style"];
	ctx.fillStyle = patty["style"];
	if (patty.hasOwnProperty("height"))
		ctx.rect(patty["xcor"]-25, patty["ycor"]-patty["height"], 50, patty["height"]);
	
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

var displayNewLevel = function() {
	ctx.font = "30px arial";
	var txt = "You Won! Leveled up to level " + level.toString() + "!";
	ctx.fillText(txt,cWidth/2,cHeight/2);
}


var play = function() {
	ctx.clearRect(0,0,cWidth,cHeight);
	drawPatties();
	drawOriginBun();
	updatePatties();
	document.getElementById("scorenum").innerHTML = "Score: " + score;
	if (gameWon){
		fallSpeed++;
		level++;
		setUp();
	}		
		
	requestID = window.requestAnimationFrame(play);
	frameNumber++;
};

var pause = function() {
	window.cancelAnimationFrame(requestID);
};

playBtn.addEventListener("click",play);
pauseBtn.addEventListener("click",pause);
restartBtn.addEventListener("click",setUp);
window.addEventListener("keydown", moveOriginBun);

setUp();
