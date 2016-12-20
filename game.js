var canvas = document.getElementById('canvas'), canvasEl = $('canvas'), fps = 29.97, gameClock = 0, grid = 16, gameHeight = 240, gameWidth = 256, isFullscreen = false, gameLoopInterval, 
	browserWindow = require('electron').remote, dropXSpeed = grid  / 3, dropXMax = grid * 6, storage = require('electron-json-storage'), savedData = {}, fpsmeter;
var context = canvas.getContext('2d'), mainWindow = browserWindow.getCurrentWindow();

var init = function(){
	storage.get('savedData', function(err, data){
		savedData = data;
		initStart();
	});
};

var initGame = function(){
	// fpsmeter = new FPSMeter({decimals: 0, graph: true, theme: 'dark', left: '5px', top: ((gameHeight * 3) - 45) + 'px'});
	$(window).resize(resizeGame);
	setupLevel();
	setupPlayer();
	setupHighScore();
	gameLoopInterval = setInterval(gameLoop, 1000 / fps);
	gameLoop();
};

var gameLoop = function(){
	// fpsmeter.tickStart();
	if(gameClock >= 4000) mainWindow.reload();
	clearGame();
	levelLoop();
	enemiesLoop();
	explosionsLoop();
	enemyShootingLoop();
	pointerLoop();
	powerupLoop();
	shootingLoop();
	playerLoop();
	hudLoop();
	gameClock++;
	// fpsmeter.tick();
};

var resizeGame = function(){
	var canvasWidth = getAspect().width, canvasHeight = getAspect().height;
	canvasEl.css('width', canvasWidth + 'px').css('height', canvasHeight + 'px').css('margin-left', -(canvasWidth / 2) + 'px').css('margin-top', -(canvasHeight / 2) + 'px');
};

var clearGame = function(){
	resizeGame();
	context.clearRect(0, 0, getAspect().width, getAspect().height);
};

var getAspect = function(){
	var newWidth = $(window).width(), newHeight = $(window).height(), remHeight = $(window).width() * 0.9375, remWidth = $(window).height() * 1.066666666667;
	if(newWidth >= remWidth) newWidth = remWidth;
	else if(newHeight > remHeight) newHeight = remHeight;
	return {width: newWidth, height: newHeight};
};

var checkCollision = function(elA, elB, callback){
	if(elA.x + elA.width >= elB.x && elA.x <= elB.x + elB.width && elA.y <= elB.y + elB.height && elA.y + elA.height >= elB.y){
		callback(elA, elB);
	}
};

var checkBulletCollision = function(el, callback){
	for(var group in shots){
		if(shots[group].length){
			shots[group].forEach(function(shot, i){
				var shotObj = {x: shot.x, y: shot.y, width: grid / 2, height: grid / 2};
				if(group == 'twoBottom' || group == 'three' || group == 'threeBottom') shotObj.width = grid / 4;
				checkCollision(el, shotObj, function(el, shotObj){
					shots[group].splice(i, 1);
					callback(el);
				});
			});
		}
	};
};

var sineCurve = function(inputObj, baseSpeed, baseMax){
	if(inputObj.x <= 0 || inputObj.x <= inputObj.initial - baseMax) inputObj.direction = 'right';
	else if(inputObj.x + grid >= gameWidth || inputObj.x >= inputObj.initial + baseMax) inputObj.direction = 'left';
	if(baseMax == grid * 99){

		if((inputObj.x <= gameWidth / 4 && inputObj.x > gameWidth / 8) || 
			(inputObj.x + inputObj.width >= gameWidth - (gameWidth / 4) && inputObj.x + inputObj.width < gameWidth - (gameWidth / 8))){
			baseSpeed = (baseSpeed / 4) * 3;
		} else if(inputObj.x <= (gameWidth / 8) ||
			inputObj.x + inputObj.width >= gameWidth - (gameWidth / 8)){
			baseSpeed = baseSpeed / 2;
		} else {
			baseSpeed = baseSpeed;
		}

	} else {
		if((inputObj.x <= inputObj.initial - (baseMax * 0.25) && inputObj.x > inputObj.initial - (baseMax * 0.75)) ||
			(inputObj.x >= inputObj.initial + (baseMax * 0.25) && inputObj.x < inputObj.initial + (baseMax * 0.75))){
			baseSpeed = (baseSpeed / 4) * 3;
		} else if(inputObj.x <= inputObj.initial - (baseMax * 0.75) ||
			inputObj.x >= inputObj.initial + (baseMax * 0.75)){
			baseSpeed = baseSpeed / 2;
		} else {
			baseSpeed = baseSpeed;
		}
	}

	if(inputObj.direction == 'left') inputObj.x -= baseSpeed;
	else inputObj.x += baseSpeed;
	return inputObj;
};

var toggleFullscreen = function(){
	var openFullscreen = function(){
		mainWindow.setFullScreen(true);
		isFullscreen = true;
	}, closeFullscreen = function(){
		mainWindow.setFullScreen(false);
		isFullscreen = false;
	};
	isFullscreen ? closeFullscreen() : openFullscreen();
};
var startedGame = false, startLoopInterval;

var initStart = function(){
	// initGame()
	startLoopInterval = setInterval(startLoop, 1000 / fps);
	startControls();
};

var startControls = function(){

	var setupGamepad = function(){
		gamepad = navigator.getGamepads()[0];
	};

	var setupKeyboard = function(){
		$(document).keydown(function(e){
			switch(e.which){
				case 13: checkStartGame(); break;
				case 220: toggleFullscreen(); break;
			};
		});
	};

	navigator.getGamepads()[0] ? setupGamepad() : window.addEventListener('gamepadconnected', setupGamepad);
	setupKeyboard();
};

var startLoop = function(){
	clearGame();
	updateStartGamepad();
	drawStart();
};

var updateStartGamepad = function(){
	if(navigator.getGamepads()[0]) if(gamepad.buttons[3].pressed) checkStartGame();
};

var drawStart = function(){
	// var titleString = '2 min caravan shmup',
	// 	subTitleString = 'press start',
	// 	creditString = '2016 trevor boddy';
	// drawString(titleString, textCenter(titleString), grid * 5, true);
	// drawString(subTitleString, textCenter(subTitleString), grid * 6);
	// drawString(creditString, textCenter(creditString), grid * 10);
	// var creditsImg = new Image();
	// creditsImg.src = 'img/studioslogo.png';
	// context.drawImage(creditsImg, (gameWidth / 2) - (grid * 2), grid * 10);
	var logo = new Image();
	logo.src = 'img/logo.png';

	var verString = 'alpha 1: 25 seconds',
		startString = 'press b3 or enter',
		creditString = '2016 trevor boddy';
	context.drawImage(logo, (gameWidth / 2) - 64, grid * 2);
	drawString(verString, textCenter(verString), grid * 9);
	drawString(startString, textCenter(startString), grid * 10);
	drawString(creditString, textCenter(creditString), grid * 13);
};

var textCenter = function(string){
	return (gameWidth / 2) - (string.length * (grid / 4));
};

var checkStartGame = function(){
	if(!startedGame){
		startedGame = true;
		clearInterval(startLoopInterval);
		initGame();
	}
};
var levelMap = [
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', 'V', 'B', 'B', 'B', 'B', 'm', 'V', 'B', 'B', 'B', 'B', 'm', ' ', ' '],
	[' ', ' ', 'X', 'B', 'O', 'P', 'B', 'W', 'e', 'B', 'O', 'P', 'B', 'n', ' ', ' '],
	['w', 'w', 'W', 'B', 'o', 'p', 'B', 'n', 'X', 'B', 'o', 'p', 'B', 'e', 'w', 'w'],
	[' ', ' ', 'X', 'B', 'B', 'B', 'B', 'W', 'e', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	[' ', ' ', 'v', 'b', 'b', 'b', 'b', 'N', 'v', 'b', 'b', 'b', 'b', 'N', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' (p)',' ',' ',' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'V', 'g', 'g', 'm', 'V', 'g', 'g', 'm', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'r', 'R', 'n', 'X', 'R', 'r', 'n', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'g', 'g', 'n', 'X', 'g', 'g', 'n', ' ', ' ', ' ', ' '],
	['V', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'm'],
	['e', 'R', 'B', 'r', 'B', 'r', 'B', 'r', 'r', 'B', 'r', 'B', 'r', 'B', 'R', 'W'],
	['X', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'n'],
	['v', 'b', 'b', 'b', 'b', 'b', 'A', 'B', 'B', 'a', 'b', 'b', 'b', 'b', 'b', 'N'],
	[' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'g', 'm', 'V', 'g', 'g', 'g', 'g', 'g', 'g', 'm', 'V', 'g', 'g', 'g'],
	['r', 'R', 'r', 'W', 'e', 'g', 'g', 'g', 'g', 'g', 'g', 'W', 'e', 'r', 'R', 'g'],
	['g', 'r', 'g', 'n', 'X', 'g', 'g', 'g', 'g', 'g', 'g', 'n', 'X', 'g', 'r', 'g'],
	['b', 'b', 'b', 'N', 'X', 'r', 'r', 'g', 'g', 'r', 'r', 'n', 'v', 'b', 'b', 'b'],
	[' ', ' ', ' ', ' ', 'Z', 'M', 'M', 'g', 'g', 'M', 'M', 'z', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'r', 'r', 'g', 'g', 'r', 'r', 'n', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'Z', 'M', 'M', 'G', 'G', 'M', 'M', 'z', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'r', 'r', 'g', 'g', 'r', 'r', 'n', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'Z', 'M', 'M', 'g', 'g', 'M', 'M', 'z', ' ', ' ', ' ', ' '],
	[' ', ' ', 'V', 'K', 'L', 'r', 'r', 'g', 'g', 'r', 'r', 'K', 'L', 'm', ' ', ' '],
	['M', 'M', 'M', 'k', 'l', 'B', 'B', 'B', 'B', 'B', 'B', 'k', 'l', 'M', 'M', 'M'],
	['g', 'g', 'g', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'g', 'g', 'g'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'K', 'L', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'k', 'l', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['g', 'g', 'g', 'B', 'B', 'B', 'B', 'R', 'R', 'B', 'B', 'B', 'B', 'g', 'g', 'g'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B (p)','B','B','B','B', 'B', 'B', 'B', 'B'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['b', 'A', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'a', 'b', 'b'],
	[' ', 'X', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'n', ' ', ' '],
	[' ', 'Z', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'z', ' ', ' '],
	[' ', 'X', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'n', ' ', ' '],
	[' ', 'v', 'b', 'b', 'A', 'r', 'g', 'r', 'g', 'r', 'a', 'b', 'b', 'N', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'g', 'r', 'g', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'Z', 'r', 'g', 'r', 'g', 'r', 'n', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'g', 'r', 'g', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b', 'b', 'b', 'N', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' (p)', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'r', 'g', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'm', ' ', ' '],
	['r', 'G', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'g', 'r', 'g', 'B', 'n', ' ', ' '],
	['g', 'r', 'g', 'B', 'B', 'g', 'g', 'B', 'B', 'r', 'G', 'r', 'B', 'n', ' ', ' '],
	['B', 'B', 'B', 'B', 'r', 'r', 'r', 'r', 'B', 'g', 'r', 'g', 'B', 'z', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'g', 'g', 'B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	['B', 'B', 'B', 'K', 'L', 'K', 'L', 'K', 'L', 'B', 'B', 'B', 'B', 'W', 'w', 'w'],
	['B', 'B', 'B', 'k', 'l', 'k', 'l', 'k', 'l', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'a', 'b', 'b', 'N', ' ', ' '],
	['b', 'b', 'b', 'b', 'b', 'A', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', 'Z', 'g', 'r', 'g', 'r', 'z', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', 'X', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', 'V', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'm', ' ', ' ', ' '],
	[' ', ' ', ' ', 'X', 'B', 'M', 'r', 'g', 'r', 'g', 'M', 'B', 'n', ' ', ' ', ' '],
	[' ', ' ', ' ', 'Z', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'z', ' ', ' ', ' '],
	[' ', ' ', ' ', 'Z', 'B', 'M', 'r', 'g', 'r', 'g', 'M', 'B', 'z', ' ', ' ', ' '],
	[' ', ' ', ' ', 'v', 'b', 'b', 'A', 'B', 'B', 'a', 'b', 'b', 'N', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'r', 'n', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'r', 'g', 'm', ' ', ' ', 'Z', 'K', 'L', 'z', ' ', ' ', 'V', 'g', 'r', 'g'],
	['g', 'r', 'g', 'W', 'w', 'w', 'e', 'k', 'l', 'W', 'w', 'w ', 'e', 'g', 'r','g'],
	['g', 'r', 'g', 'n', ' ', ' ', 'v', 'b', 'b', 'N', ' ', ' ', 'X', 'g', 'r', 'g'],
	['g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'r', 'g'],
	['g', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'g', 'r', 'g'],
	['g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' (p)',' ',' ',' ', 'X', 'g', 'r', 'g'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'r', 'G', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r', 'B'],
	['B', 'g', 'g', 'g', 'g', 'g', 'g', 'B', 'B', 'g', 'g', 'g', 'g', 'g', 'g', 'B'],
	['B', 'r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'G', 'r', 'B'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'M', 'B', 'M', 'B', 'M', 'B', 'M', 'B', 'M', 'a', 'b', 'b', 'b', 'b', 'b'],
	['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'n', ' ', ' ', ' ', ' ', ' '],
	['g', 'K', 'L', 'g', 'g', 'g', 'g', 'K', 'L', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	['r', 'k', 'l', 'r', 'r', 'r', 'r', 'k', 'l', 'r', 'z', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'n', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B (!)', 'B', 'B', 'B', 'B', 'M','g','M','B','B (@)','B','B','B','B'],
	['B', 'g', 'r', 'g', 'r', 'B', 'B', 'g', 'r', 'g', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'g', 'r', 'g', 'r', 'B', 'B', 'M', 'r', 'M', 'B', 'B', 'B', 'B', 'B', 'B'],
	['b', 'b', 'A', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B'],
	[' ', ' ', 'X', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'g', 'R', 'g', 'B'],
	[' ', ' ', 'X', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B', 'B', 'M', 'g', 'M', 'B'],
	[' ', ' ', 'Z', 'B', 'B', 'B', 'B', 'g', 'R', 'g', 'B', 'B', 'B', 'B', 'B', 'B'],
	[' ', ' ', 'Z', 'K', 'L', 'B', 'B', 'M', 'g', 'M', 'B', 'B', 'B', 'B', 'B', 'B'],
	['w', 'w', 'e', 'k', 'l', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B'],
	[' ', ' ', 'v', 'b', 'A', 'K', 'L', 'B', 'B', 'B', 'B', 'B', 'g', 'R', 'g', 'B'],
	[' ', ' ', ' ', ' ', 'X', 'k', 'l', 'B', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B'],
	[' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b', 'b', 'A', 'B', 'B','B (5)','B','B','B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'B', 'B','B (5)','B','B','B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b', 'b','b (5)','b','b','b'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ','  (5)',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ','  (5)',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ','  (5)',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ','  (5)',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ','  (5)',' ','V','r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ','  (5)',' ','X','R'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ','  (5)',' ','Z','r'],
	[' ', ' ', ' ', '  (5)',' ',' ',' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b'],
	[' ', ' ', ' ', '  (5)',' ',' ',' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', '  (5)',' ',' ',' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', '  (5)',' ',' ',' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', '  (5)',' ',' ',' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'r', 'g', 'R (5)','g','r','g','m', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B (5)','B','B','B','z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B (5)','B','B','B','n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B (5)','B','B','B','n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'M', 'r (5)','r', 'B', 'B', 'n ', ' ', ' ',' ',' ',' ', ' ', ' ',' '],
	['g', 'g', 'B', 'r', 'r', 'B', 'B', 'n', ' ', ' ', ' ', ' ','  (5)',' ',' ',' '],
	['g', 'g', 'B', 'r', 'r', 'B', 'B', 'n', ' ', ' ', ' ', ' ','  (5)',' ',' ',' '],
	['g','g', 'M', 'r', 'r', 'B', 'B', 'z', ' ', ' ', ' ', ' ', '  (5)',' ',' ',' '],
	['r','r', 'r', 'r', 'r', 'r', 'r', 'z (p)', ' ',' ',' ',' ','  (5)',' ',' ',' '],
	['B','B', 'B', 'B', 'B', 'B', 'B', 'z', ' ', ' ', ' ', ' ', '  (5)',' ',' ',' '],
	['B','B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' ', 'V', 'K', 'L (5)','r','m',' '],
	['B','r', 'g', 'r', 'B', 'B', 'B', 'n', ' ', ' ', 'X', 'k', 'l (5)','r','n',' '],
	['B','r', 'g', 'B', 'r', 'K', 'L', 'W', 'w', 'w', 'e', 'B', 'M (5)','B','z',' '],
	['B','r', 'g', 'B', 'B', 'k', 'l', 'n', ' ', ' ', 'X', 'B', 'K (5)','L','n',' '],
	['B','r', 'g', 'B', 'B', 'M', 'r', 'z', ' ', ' ', 'Z', 'B', 'k (5)','l','n',' '],
	['b', 'b', 'b', 'A (5)', 'r', 'g', 'r', 'n', ' ', ' ', 'X', 'B',' ','B','n',' '],
	[' ', ' ', ' ', 'X (5)', 'r', 'g', 'r', 'W', 'w', 'w', 'e', 'r','R','r','z',' '],
	[' ', ' ', ' ', 'Z (5)', 'B', 'B', 'B', 'n', ' ', ' ', 'X', 'B','r','B','n',' '],
	[' ', ' ', ' ', 'Z (5)', 'B', 'B', 'B', 'n', ' ', ' ', 'X', 'K','L','r','n',' '],
	[' ', ' ', ' ', 'v (5)', 'b', 'b', 'b', 'N', ' ', ' ', 'X', 'k','l','r','W','w'],
	[' ', ' ', ' ', '  (5)', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'B','M','B','W','w'],
	[' ', ' ', ' ', '  (5)', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b','b','b','N',' '],
	[' ', ' ', ' ', '  (5)', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', '  (5)', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', '  (5)', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ','  (4)',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'V', 'r', 'B','M','B','g','B (4)'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'M', 'B', 'M', 'B', 'M', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'K', 'L','M','g','r (4)','B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'k', 'l', 'M', 'B', 'M', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'M', 'B','M','K','L','B (4)'],
	['r', 'r', 'g', 'r', 'r', 'm', ' ', ' ', ' ', 'X', 'g', 'R', 'M', 'k', 'l', 'B'],
	['g', 'g (4)', 'g', 'g', 'g', 'n', ' ', ' ',' ','X','M','B','M','B','M (4)','B'],
	['r', 'G', 'g', 'r', 'r', 'n', ' ', ' ', ' ', 'X', 'M', 'B ','M', 'B', 'M', 'B'],
	['g (4)', 'r', 'g', 'g', 'g', 'n', ' ',' ',' ','X','M','B ','M','B','M','B (4)'],
	['g', 'r', 'g', 'r', 'a', 'N', 'V', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['g', 'r (4)', 'g', 'r', 'n', ' ', 'X', 'g', 'r', 'g', 'r', 'g','r','g','G','g'],
	['g', 'r', 'g', 'r', 'W', 'w', 'e', 'M', 'g', 'r', 'g', 'M', 'g', 'r', 'g', 'M'],
	['g (4)', 'r', 'G', 'r', 'W', 'w', 'e', 'B', 'B', 'B', 'B', 'B','M','r','M','B'],
	['g', 'r', 'g', 'R', 'n', ' ', 'v', 'b', 'b', 'b', 'A', 'B', 'g', 'M', 'g', 'B'],
	['b ', 'b(4)', 'b', 'b', 'N', ' ', ' ', ' ', ' ', ' ', 'X', 'B','M','r','M','B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'B', 'B', 'B', 'B', 'B'],
	[' (4)', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'g','g','M','r', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' (p)', ' ', 'X (2)', 'g','g','B','r','r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X (2)', 'g','g','M','r','r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X (2)', 'g','G','B','r','r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X (2)', 'g','g','M','r','r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X (2)', 'g','g','B','R','r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z (2)', 'g','g','M','r','r'],
	['r', 'g', 'r', 'm', ' ', ' ', ' ', ' ', ' ', ' ', 'Z (2)', 'g','g','B','r','r'],
	['M', 'B', 'M', 'z', ' ', ' ', ' ', ' ', ' ', ' ', 'X (2)', 'g','g','M','r','r'],
	['r', 'g', 'r', 'n', ' ', ' ', ' ', ' ', ' ', ' ', 'v (2)', 'b','A','B','r','r'],
	['g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' (2)', ' ', 'Z','M','B','M'],
	['r', 'G', 'r', 'n', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', 'v','b','b','b'],
	['g', 'M', 'g', 'n', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	['r', 'g', 'r', 'z', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	['g', 'M', 'g', 'n', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	['r', 'g', 'r', 'n', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	['b', 'b', 'b', 'N', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' (2)', ' ', ' ', ' ', ' ',' ',' ',' ',' (3)',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'm', ' ', ' ', ' '],
	['r', 'r', 'r (3)', 'B', 'g', 'g', 'g', 'B', 'r', 'r', 'r', 'B','n',' ',' ',' '],
	['r', 'G', 'r', 'B', 'g', 'g', 'g', 'B', 'r', 'G', 'r', 'B', 'z', ' ', ' ', ' '],
	['r', 'r', 'r', 'B', 'g', 'g', 'g', 'B', 'r', 'r', 'r', 'B', 'W', 'w', 'w', 'w'],
	['B', 'B', 'B ', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'W', 'w', 'w','w'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' ', ' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'W', 'w', 'w', 'w'],
	['M', 'g', 'M', 'g', 'M', 'g', 'M', 'B', 'M', 'B', 'M', 'B', 'n', ' ', ' ', ' '],
	['r', 'g', 'r', 'g', 'r', 'g', 'a', 'b', 'b', 'b', 'b', 'b', 'N', ' ', ' ', ' '],
	['r', 'g', 'M', 'G', 'r', 'G', 'n', ' ', ' ', ' ', ' ', '  (1)',' ',' ',' ',' '],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ',' ',' ',' '],
	['M', 'g', 'r', 'g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','V','K','L'],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','X','k','l'],
	['R', 'g', 'M', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','Z','K','L'],
	['r', 'g', 'r', 'g', 'r', 'g', 'W (p)','w','w','w','w', 'w (1)','w','e','k','l'],
	['M', 'g', 'M', 'g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','X','K','L'],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','X','k','l'],
	['M', 'g', 'M', 'g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','v','b','b'],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ',' ',' ',' '],
	['M', 'g', 'M', 'g', 'M (1)', 'g', 'n', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	['b', 'b', 'b', 'A', 'r (1)', 'g', 'z', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', 'Z', 'r (1)', 'g', 'z', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', 'X', 'r (1)', 'g', 'n', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', 'v', 'b (1)', 'b', 'N', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', '  (1)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', '  (1)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', '  (1)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', '  (1)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', '  (1)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' (p)', ' ', ' ', ' ',' ',' ',' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
];
var levelRowPositions = [], gridPositions = []; levelStartPos = 0, levelSpeed = 1.5, groundSpeed = 1 / 128, cloudSpeed = 1 / 24, introTime = 90, outroTime = 2700, currentPlatformAnimation = 0;

var setupLevel = function(){
	var rowGridCount = levelMap[0].length,
		levelStartPos = levelMap.length * grid;
	levelMap.forEach(function(levelRow, i){
		var rowY = (i * grid) - (levelStartPos - gameHeight);
		var gridPosition = {y: rowY, groundY: rowY, cloudY: rowY, grids: []};
		levelRow.forEach(function(levelGrid, j){
			gridPosition.grids.push({x: j * grid, char: levelRow[j]});
			if(levelGrid.indexOf('(') > -1){
				entity = levelGrid.substring(levelGrid.indexOf('(') + 1, levelGrid.indexOf('(') + 2);
				var xPos = j * grid, yPos = (i * grid) - (levelStartPos - gameHeight);
				switch(entity){

					// powerup
					case 'p':
						var powerupDirection = (Math.random() >= 0.5) ? 'left' : 'right';
						powerups.push({x: xPos, y: yPos, initial: xPos, direction: powerupDirection, width: grid});
						break;

					// enemies
					case '1': enemies.small.one.push({x: xPos, y: yPos, initial: xPos, width: grid, height: grid}); break;
					case '2': enemies.small.two.push({x: xPos, y: yPos, initial: xPos, width: grid, height: grid}); break;
					case '3': enemies.medium.one.push({x: xPos, y: yPos, width: grid * 2, height: grid * 2, hits: 2}); break;
					case '4': enemies.small.three.push({x: xPos, y: yPos, width: grid, height: grid}); break;
					case '5': enemies.small.four.push({x: xPos, y: yPos, width: grid, height: grid}); break;

					// bosses
					case '!': bosses.oneA.push({x: xPos, y: yPos, width: grid * 3.5, height: grid * 3.5, sYDirection: 'up', sXDirection: 'left'}); break;
					case '@': bosses.oneB.push({x: xPos, y: yPos, width: grid * 3.5, height: grid * 3.5, sYDirection: 'up', sXDirection: 'right'}); break;

				};
			}
		});
		gridPositions.push(gridPosition);
	});
	setupGridImages();
};

const greenBlockImg = new Image(), redBlockImg = new Image(), greenPointImg = new Image(), redPointImg = new Image(), destroyedImg = new Image(),
	platformOneImg = new Image(), platformTwoImg = new Image(), platformBottomImg = new Image(), platformBottomLeftImg = new Image(), platformBottomRightImg = new Image(), platformLeftImg = new Image(), platformTopLeftImg = new Image(),
	platformRightImg = new Image(), platformTopRightImg = new Image(), platformRightNubImg = new Image(), platformLeftNubImg = new Image(), platformIntersectTopLeftImg = new Image(), platformIntersectTopRightImg = new Image(),
	pipeImg = new Image(), pipeLeftImg = new Image(), pipeRightImg = new Image(), bigBlockImg = new Image(), destroyedBigBlockImg = new Image(), bigThingImg = new Image();

const setupGridImages = function(){
	greenBlockImg.src = 'img/greenblock.png';
	redBlockImg.src = 'img/redBlock.png';
	greenPointImg.src = 'img/greenpoint.png';
	redPointImg.src = 'img/greenpoint.png';
	destroyedImg.src = 'img/destroyed.png';

	platformOneImg.src = 'img/platform1.png';
	platformTwoImg.src = 'img/platform2.png';
	platformBottomImg.src = 'img/platformbottom.png';
	platformBottomLeftImg.src = 'img/platformbottomleft.png';
	platformBottomRightImg.src = 'img/platformbottomright.png';
	platformLeftImg.src = 'img/platformleft.png';
	platformTopLeftImg.src = 'img/platformtopleft.png';
	platformRightImg.src = 'img/platformright.png';
	platformTopRightImg.src = 'img/platformtopright.png';
	platformLeftNubImg.src = 'img/platformleftnub.png';
	platformRightNubImg.src = 'img/platformrightnub.png';
	platformIntersectTopLeftImg.src = 'img/platformintersecttopleft.png';
	platformIntersectTopRightImg.src = 'img/platformintersecttopright.png';

	pipeImg.src = 'img/pipe.png';
	pipeLeftImg.src = 'img/pipeleft.png';
	pipeRightImg.src = 'img/piperight.png';

	bigBlockImg.src = 'img/bigblock.png';
	destroyedBigBlockImg.src = 'img/destroyedbigblock.png';

	bigThingImg.src = 'img/bigthing.png';
};

var levelLoop = function(){

	var update = function(){
		if(gameClock % 16 == 0){
			currentPlatformAnimation++;
			if(currentPlatformAnimation == 4) currentPlatformAnimation = 0;
		}
		for(var i in gridPositions){
			gridPositions[i].y += levelSpeed;
			gridPositions[i].groundY += groundSpeed;
			gridPositions[i].cloudY += cloudSpeed;
		}
		updateBlocks();
	};

	var draw = function(){

		var drawForeground = function(row, i){
			var rowY = gridPositions[i].y
			if(rowY + grid >= 0 && rowY <= gameHeight){
				row.forEach(function(levelGrid, j){
					if(levelGrid != ' '){
						var img;
						if(levelGrid.indexOf('(') > -1) levelGrid = levelGrid.substring(0, levelGrid.indexOf('('));
						levelGrid = levelGrid.trim();
						if(levelGrid != ''){
							switch(levelGrid){
								case 'g': img = greenBlockImg; break;
								case 'r': img = redBlockImg; break;
								case 'G': img = greenPointImg; break;
								case 'R': img = redPointImg; break;
								case 't': img = destroyedImg; break;
								case 'B': img = platformOneImg; break;
								case 'M': img = platformTwoImg; break;
								case 'b': img = platformBottomImg; break;
								case 'v': img = platformBottomLeftImg; break;
								case 'N': img = platformBottomRightImg; break;
								case 'X': img = platformLeftImg; break;
								case 'V': img = platformTopLeftImg; break;
								case 'n': img = platformRightImg; break;
								case 'm': img = platformTopRightImg; break;
								case 'Z': img = platformLeftNubImg; break;
								case 'z': img = platformRightNubImg; break;
								case 'a': img = platformIntersectTopLeftImg; break;
								case 'A': img = platformIntersectTopRightImg; break;
								case 'w': img = pipeImg; break;
								case 'W': img = pipeLeftImg; break;
								case 'e': img = pipeRightImg; break;
								case 'k': img = bigBlockImg; break;
								case 'K': img = bigBlockImg; break;
								case 'l': img = bigBlockImg; break;
								case 'L': img = bigBlockImg; break;
								case 'u': img = destroyedBigBlockImg; break;
								case 'U': img = destroyedBigBlockImg; break;
								case 'i': img = destroyedBigBlockImg; break;
								case 'I': img = destroyedBigBlockImg; break;
								case 'o': img = bigThingImg; break;
								case 'O': img = bigThingImg; break;
								case 'p': img = bigThingImg; break;
								case 'P': img = bigThingImg; break;
							}
							if(levelGrid == 'K' || levelGrid == 'O' || levelGrid == 'U') context.drawImage(img, 0, 0, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'k' || levelGrid == 'o' || levelGrid == 'u') context.drawImage(img, 0, grid, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'L' || levelGrid == 'P' || levelGrid == 'I') context.drawImage(img, grid, 0, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'l' || levelGrid == 'p' || levelGrid == 'i') context.drawImage(img, grid, grid, grid, grid, (j * grid), rowY, grid, grid);
							else if(levelGrid == 'b' || levelGrid == 'N' || levelGrid == 'v' || levelGrid == 'a' || levelGrid == 'A'){
								var sX = 0;
								switch(currentPlatformAnimation){
									case 0: sX = 0; break;
									case 1: sX = grid; break;
									case 2: sX = grid * 2; break;
									case 3: sX = grid; break;
								};
								context.drawImage(img, sX, 0, grid, grid, (j * grid), rowY, grid, grid);
							}
							else context.drawImage(img, (j * grid), rowY);
						}
					} else {
						context.fillStyle = 'transparent';
						context.fillRect((j * grid), rowY, grid, grid);
					}
				});
			}
		};

		var drawLayer = function(type){
			levelMap.forEach(function(row, i){
				switch(type){
					case 'ground':
						var groundY = gridPositions[i].groundY * grid;
						if(groundY + (grid * grid) >= 0 && groundY <= gameHeight){
					 		var groundEl = new Image();
					 		groundEl.src = 'img/stars1.png';
					 		context.drawImage(groundEl, 0, groundY);
						}
						break;
					case 'clouds':
						var cloudY = gridPositions[i].cloudY * grid;
						if(cloudY + (grid * grid) >= 0 && cloudY <= gameHeight){
					 		var cloudEl = new Image();
					 		cloudEl.src = 'img/stars2.png';
					 		context.drawImage(cloudEl, 0, cloudY);
						}
						break;
					case 'foreground':
						drawForeground(row, i);
						break;
				};
			});
		};

		var drawIntro = function(){
			var newGround = 1 / 64;
			if(gameClock < introTime - 50) newGround = 1;
			else if(gameClock >= introTime - 50 && gameClock < introTime - 40) newGround = 1 / 2;
			else if(gameClock >= introTime - 40 && gameClock < introTime - 30) newGround = 1 / 4;
			else if(gameClock >= introTime - 30 && gameClock < introTime - 20) newGround = 1 / 8;
			else if(gameClock > introTime - 20 && gameClock < introTime - 10) newGround = 1 / 16;
			else if(gameClock > introTime - 10 && gameClock < introTime || gameClock >= outroTime && gameClock < outroTime + 10) newGround = 1 / 32;
			else if(gameClock >= outroTime + 10 && gameClock < outroTime + 20) newGround = 1 / 16;
			else if(gameClock >= outroTime + 20 && gameClock < outroTime + 30) newGround = 1 / 8;
			else if(gameClock >= outroTime + 30 && gameClock < outroTime + 40) newGround = 1 / 4;
			else if(gameClock >= outroTime + 40 && gameClock < outroTime + 50) newGround = 1 / 2;
			else if(gameClock >= outroTime + 50) newGround = 1;
			groundSpeed = newGround;
			cloudSpeed = newGround * 2;
		};

		drawLayer('ground');
		drawLayer('clouds');
		drawLayer('foreground');
		drawIntro();

	};

	update();
	draw();

};

// var gridItem = function(character){
// 	var image = '', entity = '', entityString = '';
// 	if(character.indexOf('(') > -1) character = character.substring(0, character.indexOf('('));
// 	character = character.trim();

// 	switch(character){

// 		case 'B': image = 'platform1'; break;
// 		case 'M': image = 'platform2'; break;

// 		case 'b': image = 'platformbottom'; break;
// 		case 'N': image = 'platformbottomright'; break;
// 		case 'v': image = 'platformbottomleft'; break;
// 		case 'a': image = 'platformintersecttopleft'; break;
// 		case 'A': image = 'platformintersecttopright'; break;

// 		case 'X': image = 'platformleft'; break;
// 		case 'V': image = 'platformtopleft'; break;
// 		case 'n': image = 'platformright'; break;
// 		case 'm': image = 'platformtopright'; break;

// 		case 'z': image = 'platformrightnub'; break;
// 		case 'Z': image = 'platformleftnub'; break;
// 		case 'w': image = 'pipe'; break;
// 		case 'W': image = 'pipeleft'; break;
// 		case 'e': image = 'piperight'; break;

// 		case 'g': image = 'greenblock'; break;
// 		case 'G': image = 'greenpoint'; break;
// 		case 'r': image = 'redblock'; break;
// 		case 'R': image = 'redpoint'; break;
// 		case 't': image = 'destroyed'; break;
		
// 		case 'k': image = 'bigblock'; break;
// 		case 'K': image = 'bigblock'; break;
// 		case 'l': image = 'bigblock'; break;
// 		case 'L': image = 'bigblock'; break;
// 		case 'u': image = 'destroyedbigblock'; break;
// 		case 'U': image = 'destroyedbigblock'; break;
// 		case 'i': image = 'destroyedbigblock'; break;
// 		case 'I': image = 'destroyedbigblock'; break;

// 		case 'o': image = 'bigthing'; break;
// 		case 'O': image = 'bigthing'; break;
// 		case 'p': image = 'bigthing'; break;
// 		case 'P': image = 'bigthing'; break;

// 	};
// 	return image;
// };
var powerups = [];

const powerupImg = new Image();
powerupImg.src = 'img/powerup.png';

var powerupLoop = function(){
	var draw = function(){
		powerups.forEach(function(powerupObj, i){
			powerupObj.y += levelSpeed;
			if(powerupObj.y + grid >= 0){
				powerupObj = sineCurve(powerupObj, dropXSpeed, dropXMax);
				context.drawImage(powerupImg, powerupObj.x, powerupObj.y);
				var powerupCollisionEl = {x: powerupObj.x, y: powerupObj.y, width: grid, height: grid};
				if(powerupObj.y >= gameHeight + grid) powerups.splice(i, 1);
				powerupCollision(powerupCollisionEl, i);
			}
		});
	};
	if(powerups.length) draw();
};

var powerupCollision = function(powerupObj, i){
	var powerupEl = {x: powerupObj.x, y: powerupObj.y, width: grid, height: grid}, playerEl = {x: playerX, y: playerY, width: grid, height: grid};
	checkCollision(powerupEl, playerEl, function(powerupEl, playerEl){
		powerups.splice(i, 1);
		currentPowerup < 4 ? currentPowerup++ : powerupBonus();
	});
};

var powerupBonus = function(){
	score = score + 1000;
	fullscreenMessageTime = 0;
	currentFullscreenMessage = 'bonus: 1000';
};
var explosions = [];

var explodeEntity = function(entityObj){
	entityObj.time = gameClock;
	explosions.push(entityObj);
};


var explosionAnimateTime = 1, explosionSize = grid * 2;

const explosionImg = new Image();
explosionImg.src = 'img/explosions.png';

var explosionsLoop = function(){

	var draw = function(){
		explosions.forEach(function(explosion, i){
			if(gameClock >= explosion.time + (explosionAnimateTime * 5)){
				explosions.splice(i, 1);
			} else {
				let sX = 0;
				if(gameClock >= explosion.time + explosionAnimateTime && gameClock < explosion.time + (explosionAnimateTime * 2)) sX = explosionSize;
				else if(gameClock >= explosion.time + (explosionAnimateTime * 2) && gameClock < explosion.time + (explosionAnimateTime * 3)) sX = explosionSize * 2;
				else if(gameClock >= explosion.time + (explosionAnimateTime * 3) && gameClock < explosion.time + (explosionAnimateTime * 4)) sX = explosionSize * 3;
				else if(gameClock >= explosion.time + (explosionAnimateTime * 4) && gameClock < explosion.time + (explosionAnimateTime * 5)) sX = explosionSize * 4;
				if(explosionSize > explosion.width){
					if(explosion.width == grid) explosion.x = explosion.x - (grid / 8);
					else explosion.x = explosion.x - (grid / 4);
				}
				if(explosionSize > explosion.width) explosion.y = explosion.y - (grid / 8);
				context.drawImage(explosionImg, sX, 0, explosionSize, explosionSize, explosion.x, explosion.y, explosionSize, explosionSize);
			}
		});
	};

	if(explosions.length) draw()

};
const enemies = {
	small: {one: [], two: [], three: [], four: []},
	medium: {one: []}
};

const enemySmallOneImg = new Image(), enemySmallTwoImg = new Image(), enemySmallFourImg = new Image();
	enemyMediumOneImg = new Image();
enemySmallOneImg.src = 'img/enemysmallone.png';
enemySmallTwoImg.src = 'img/enemysmalltwo.png';
enemyMediumOneImg.src = 'img/enemymediumone.png';
enemySmallFourImg.src = 'img/enemysmallthree.png';

var enemiesLoop = function(){

	var draw = function(){

		var drawEnemy = function(opts){
			opts.arr.forEach(function(enemyObj, i){
				if(enemyObj.y + opts.height < 0 && (enemyObj.direction && (enemyObj.direction != 'up') || !enemyObj.direction)) enemyObj.y += levelSpeed;
				if(enemyObj.y + opts.height >= 0){
				enemyObj = opts.animation(enemyObj, opts.width, opts.height, i, opts.arr);
					context.drawImage(opts.img, enemyObj.x, enemyObj.y);
					var enemyCollisionEl = {x: enemyObj.x, y: enemyObj.y, width: opts.width, height: opts.height};
					checkBulletCollision(enemyCollisionEl, function(){
						explodeEntity(enemyCollisionEl);
						if(opts.hits && !opts.arr['hits']){
							opts.arr['hits'] = opts.hits;
						} else if(opts.arr['hits']) {
							opts.arr.hits -= 1;
							if(opts.arr.hits == 0){
								opts.arr.splice(i, 1);
								score += opts.score;
							}
						} else {
							opts.arr.splice(i, 1);
							score += opts.score;
						}
					});
					if(canGetHit){
						checkCollision({x: playerX, y: playerY, width: playerWidth, height: playerHeight}, enemyCollisionEl, function(){
							opts.onlyDestroysPlayer ? getHit(opts.arr, i, true) : getHit(opts.arr, i);
						});
					}
					if(enemyObj.y + opts.height < 0 && enemyObj.direction){
						if(enemyObj.direction == 'up') opts.arr.splice(i, 1);
					}
					if((enemyObj.y + opts.height >= gameHeight + (opts.height * 2))) opts.arr.splice(i, 1);
				}
			});
		};

		if(enemies.small.one.length) drawEnemySmallOne(drawEnemy);
		if(enemies.small.two.length) drawEnemySmallTwo(drawEnemy);
		if(enemies.small.three.length) drawEnemySmallThree(drawEnemy);
		if(enemies.small.four.length) drawEnemySmallFour(drawEnemy);
		if(enemies.medium.one.length) drawEnemyMediumOne(drawEnemy);

		if(bosses.oneA.length) drawBossOneA(drawEnemy);
		if(bosses.oneB.length) drawBossOneB(drawEnemy);

	};

	draw();

};

// draw farm
var drawEnemySmallOne = function(callback){
	var opts = {
		arr: enemies.small.one,
		img: enemySmallOneImg,
		width: grid,
		height: grid,
		animation: enemyAnimations.smallOne,
		score: 300
	};
	callback(opts);
}, drawEnemySmallTwo = function(callback){
	var opts = {
		arr: enemies.small.two,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		animation: enemyAnimations.smallTwo,
		score: 300
	};
	callback(opts);
}, drawEnemySmallThree = function(callback){
	var opts = {
		arr: enemies.small.three,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		animation: enemyAnimations.smallThree,
		score: 500
	};
	callback(opts);
}, drawEnemySmallFour = function(callback){
	var opts = {
		arr: enemies.small.four,
		img: enemySmallFourImg,
		width: grid,
		height: grid,
		animation: enemyAnimations.smallFour,
		score: 200
	};
	callback(opts);
}, drawEnemyMediumOne = function(callback){
	var opts = {
		arr: enemies.medium.one,
		img: enemyMediumOneImg,
		width: grid * 2,
		height: grid * 2,
		animation: enemyAnimations.mediumOne,
		score: 1000,
		hits: 3
	};
	callback(opts);
};


// animations

var enemyAnimations = {
	smallOne: function(enemyObj){
		if(enemyObj.y + grid >= 0) enemyObj.y += (levelSpeed / 4) * 3;
		enemyObj = sineCurve(enemyObj, grid / 3, grid * 4);
		return enemyObj;
	},
	smallTwo: function(enemyObj, enemyWidth, enemyHeight){
		if(enemyObj.y + grid >= 0) enemyObj.y += levelSpeed;
		enemyObj = sineCurve(enemyObj, grid / 3, grid * 2.5);
		return enemyObj;
	},
	smallThree: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
		if(enemyObj.y + enemyHeight >= 0){
			let ySpeed = levelSpeed;
			if(enemyObj.y + grid > grid){
				if(enemyObj.y + enemyObj.height < playerY){
					if(enemyObj.x + enemyWidth < playerX) enemyObj.x += grid / 3;
					else if(enemyObj.x + enemyObj.width > playerX + playerWidth) enemyObj.x -= grid / 3;
					if(enemyObj.x + enemyWidth >= playerX - grid && enemyObj.x + enemyObj.width < playerX + playerWidth + grid) ySpeed = levelSpeed * 3;
				} else ySpeed = levelSpeed * 3;
			}
			enemyObj.y += ySpeed;
		}
		return enemyObj;
	}, smallFour: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
		if(enemyObj.y + enemyHeight >= 0){
			enemyObj.y += levelSpeed * 2.5;
		}
		return enemyObj;
	}, mediumOne: function(enemyObj){
		if((enemyObj.y + enemyObj.height) >= gameHeight / 2) enemyObj.direction = 'up';
		if(enemyObj.direction == 'up'){
			enemyObj.y -= levelSpeed / 2;
			if(gameClock % (grid / 4) == 0){
				spawnMediumOneShot(enemyObj);
			}
		}
		else enemyObj.y += levelSpeed * 2;
		return enemyObj;
	}
};
const bosses = {
	oneA: [], oneB: []
};

const bossOneAImg = new Image(), bossOneBImg = new Image();
bossOneAImg.src = 'img/bossonea.png';
bossOneBImg.src = 'img/bossoneb.png';

const drawBossOneA = function(callback){
	var opts = {
		arr: bosses.oneA,
		img: bossOneAImg,
		width: 56,
		height: 56,
		animation: bossAnimations.one,
		score: 2000,
		hits: 20,
		onlyDestroysPlayer: true
	};
	callback(opts);
}, drawBossOneB = function(callback){
	var opts = {
		arr: bosses.oneB,
		img: bossOneBImg,
		width: 56,
		height: 56,
		animation: bossAnimations.one,
		score: 2000,
		hits: 10,
		onlyDestroysPlayer: true
	};
	callback(opts);
};

const bossOneSpeed = (levelSpeed / 3) * 2;

const bossAnimations = {
	one: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
		if(enemyObj.y + enemyHeight >= -10 && enemyObj.y + enemyHeight <= 1 && !enemyObj.direction){
			enemyObj.y = gameHeight;
			enemyObj.direction = 'up';
		} else if(enemyObj.direction && (enemyObj.direction == 'up')){

			// game bounds
			// if(enemyObj.x <= 0) enemyObj.sXDirection = 'left';
			// else if(enemyObj.x + enemyWidth >= gameWidth) enemyObj.sXDirection = 'right';
			// if(enemyObj.y <= 0) enemyObj.sYDirection = 'down';
			// else if(enemyObj.y + enemyHeight >= gameHeight) enemyObj.sYDirection = 'up';

			// player tracking
			if(enemyObj.x + enemyWidth < playerX) enemyObj.sXDirection = 'right';
			else if(enemyObj.x >= playerX + playerWidth) enemyObj.sXDirection = 'left';
			else enemyObj.sXDirection = '';

			if(enemyObj.y > playerY + playerHeight) enemyObj.sYDirection = 'up';
			else if(enemyObj.y + enemyHeight < playerY) enemyObj.sYDirection = 'down';
			else enemyObj.sYDirection = '';
			// if(enemyObj.y > playerY + playerHeight) enemyObj.sXDirection = 'up';
			// else enemyObj.sYDirection = '';
			// enemyObj.sYDirection = 'up';

			// assign vals
			if(enemyObj.sXDirection == 'left') enemyObj.x -= bossOneSpeed;
			else if(enemyObj.sXDirection == 'right') enemyObj.x += bossOneSpeed;
			if(enemyObj.sYDirection == 'up') enemyObj.y -= bossOneSpeed;
			else if(enemyObj.sYDirection == 'down') enemyObj.y += bossOneSpeed;
		}
		return enemyObj;
	}
};
var enemyShots = {
	medium: {one: []}
}

const enemyMediumOneBulletImg = new Image();
enemyMediumOneBulletImg.src = 'img/enemymediumonebullet.png';

var spawnMediumOneShot = function(enemy){
	enemyShots.medium.one.push({x: enemy.x + (grid / 3), y: enemy.y + grid, width: grid / 2, height: grid});
	enemyShots.medium.one.push({x: (enemy.x + (grid * 2)) - ((grid / 3) + (grid / 2)), y: enemy.y + grid, width: grid / 2, height: grid});
};

var enemyShootingLoop = function(){

	var draw = function(){
		if(enemyShots.medium.one.length) animateMediumOneShot();
	};

	draw();

};

var animateMediumOneShot = function(){
	enemyShots.medium.one.forEach(function(shotObj, i){
		context.drawImage(enemyMediumOneBulletImg, shotObj.x, shotObj.y);
		enemyShots.medium.one[i].y += levelSpeed * 4;
		if(enemyShots.medium.one.y >= gameHeight) enemyShots.medium.one.splice(i, 1);
		checkEnemyShotCollision(shotObj, i, enemyShots.medium.one);
		checkEnemyPopcorn(shotObj, i, enemyShots.medium.one);
	});
};

var checkEnemyShotCollision = function(shotObj, i, arr){
	checkCollision(shotObj, {x: playerX, y: playerY, width: grid, height: grid}, function(){
		arr.splice(i, 1);
		getHit(arr, i);
	});
};

var checkEnemyPopcorn = function(shotObj, i, arr){
	checkBulletCollision(shotObj, function(){
		explodeEntity(shotObj);
		arr.splice(i, 1);
		score += 20;
	});
};
var updateBlocks = function(){
	levelMap.forEach(function(row, i){
		if(gridPositions[i].y + grid >= 0 && gridPositions[i].y <= gameHeight){
			row.forEach(function(levelGrid, j){ // in the grid
				var gridChar = gridPositions[i].grids[j].char;
				if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
				var gridObj = {x: gridPositions[i].grids[j].x, y: gridPositions[i].y, char: gridChar};
				gridChar = gridChar.trim();
				if(gridChar == 'g' || gridChar == 'G' || gridChar == 'r' || gridChar == 'R') checkBlockCollision(gridObj);
				else if(gridChar == 'k' || gridChar == 'K' || gridChar == 'l' || gridChar == 'L') checkBigBlockCollision(gridObj);
			});
		}
	});
};

var checkBlockCollision = function(block){
	checkBulletCollision({x: block.x, y: block.y, width: grid, height: grid}, function(){
		destroyBlock(block);
	});
};

var destroyBlock = function(block){
	levelMap.forEach(function(row, i){
		row.forEach(function(char, j){
			var gridChar = char;
			if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
			var tempRow = gridPositions[i], gridItem = gridPositions[i].grids[j];
			if(gridItem.x == block.x && tempRow.y == block.y && block.char == gridChar){
				if(block.char == 'G' || block.char == 'R') spawnPointer(block);
				block.width = grid;
				block.height = grid;
				explodeEntity(block);
				levelMap[i][j] = 't';
				gridPositions[i].grids[j].char = 't';
				score += 10;
			}
		});
	});
};

var checkBigBlockCollision = function(bigBlock){
	checkBulletCollision({x: bigBlock.x, y: bigBlock.y, width: grid, height: grid}, function(){
		var gridsToDestroy = {};
		switch(bigBlock.char.trim()){
			case 'k':
				gridsToDestroy.topLeft = {x: bigBlock.x, y: bigBlock.y - grid};
				gridsToDestroy.topRight = {x: bigBlock.x + grid, y: bigBlock.y - grid};
				gridsToDestroy.bottomLeft = bigBlock;
				gridsToDestroy.bottomRight = {x: bigBlock.x + grid, y: bigBlock.y};
				break;
			case 'K':
				gridsToDestroy.topLeft = bigBlock;
				gridsToDestroy.topRight = {x: bigBlock.x + grid, y: bigBlock.y};
				gridsToDestroy.bottomLeft = {x: bigBlock.x, y: bigBlock.y + grid};
				gridsToDestroy.bottomRight = {x: bigBlock.x + grid, y: bigBlock.y + grid};
				break;
			case 'l':
				gridsToDestroy.topLeft = {x: bigBlock.x - grid, y: bigBlock.y - grid};
				gridsToDestroy.topRight = {x: bigBlock.x, y: bigBlock.y - grid};
				gridsToDestroy.bottomLeft = {x: bigBlock.x - grid, y: bigBlock.y};
				gridsToDestroy.bottomRight = bigBlock;
				break;
			case 'L':
				gridsToDestroy.topLeft = {x: bigBlock.x - grid, y: bigBlock.y};
				gridsToDestroy.topRight = bigBlock;
				gridsToDestroy.bottomLeft = {x: bigBlock.x - grid, y: bigBlock.y - grid};
				gridsToDestroy.bottomRight = {x: bigBlock.x, y: bigBlock.y - grid};
				break;
		};
		destroyBigBlock(gridsToDestroy);
	});
};

var destroyBigBlock = function(gridsToDestroy){
	levelMap.forEach(function(row, i){
		row.forEach(function(char, j){
			var gridChar = char;
			if(gridChar.indexOf('(') > -1) gridChar = gridChar.substring(0, gridChar.indexOf('('));
			var tempRow = gridPositions[i], grid = gridPositions[i].grids[j];
			if(gridChar == 'k' || gridChar == 'K' || gridChar == 'l' || gridChar == 'L'){
				var otherRowIndex = (gridChar == 'K' || gridChar == 'L') ? i + 1 : i - 1;
				for(var cord in gridsToDestroy){
					if(grid.x == gridsToDestroy[cord].x && tempRow.y == gridsToDestroy[cord].y){
						var newChar = '', newOtherChar = '';
						switch(levelMap[i][j]){
							case 'k': newChar = 'u'; break;
							case 'K': newChar = 'U'; break;
							case 'l': newChar = 'i'; break;
							case 'L': newChar = 'I'; break;
						};
						switch(levelMap[otherRowIndex][j]){
							case 'k': newOtherChar = 'u'; break;
							case 'K': newOtherChar = 'U'; break;
							case 'l': newOtherChar = 'i'; break;
							case 'L': newOtherChar = 'I'; break;
						};
						levelMap[i][j] = newChar;
						gridPositions[i].grids[j].char = newChar;
						levelMap[otherRowIndex][j] = newOtherChar;
						gridPositions[otherRowIndex].grids[j].char = newOtherChar;
					}
				};
			}
		});
	});
	explodeEntity({x: gridsToDestroy.topLeft.x, y: gridsToDestroy.topLeft.y, width: grid * 2, height: grid * 2});
	score += 200;
};
var movingUp = false, movingDown = false, movingLeft = false, movingRight = false, shot = false, isPaused = false, player, inputStopped = false,  playerSpeed = grid / 2, playerWidth = grid, playerHeight = grid * 1.5, playerIsHidden = false;
var playerX = (gameWidth / 2) - (playerWidth / 2), playerY = gameHeight - (playerHeight + grid);

const playerImg = new Image();

var setupPlayer = function(){

	var setupKeyboard = function(){
		$(document).keydown(function(e){
			switch(e.which){
				case 38: movingUp = true; break;
				case 40: movingDown = true; break;
				case 37: movingLeft = true; break;
				case 39: movingRight = true; break;
				case 90: shot = true; break;
				case 191: mainWindow.reload(); break;
			};
		});
		$(document).keyup(function(e){
			switch(e.which){
				case 38: movingUp = false; break;
				case 40: movingDown = false; break;
				case 37: movingLeft = false; break;
				case 39: movingRight = false; break;
				case 90: shot = false; break;
			};
		});
	};

	var buildPlayer = function(){
		player = new Image();
	};

	setupKeyboard();
	buildPlayer();

};

var stopInput = function(){
	$(document).off('keydown').on('keydown', function(e){
		switch(e.which){
			case 38: movingUp = false; break;
			case 40: movingDown = false; break;
			case 37: movingLeft = false; break;
			case 39: movingRight = false; break;
			case 90: shot = false; break;
		};
	});
	inputStopped = true;
};

var playerLoop = function(){

	var update = function(){

		var updateGamepad = function(){
			if(inputStopped && navigator.getGamepads()[0]){
				gamepad = navigator.getGamepads()[0];
				movingUp = false, movingDown = false, movingDown = false, movingLeft = false, movingRight = false, shot = false;
				if(gamepad.buttons[2].pressed) mainWindow.reload();
			} else if(navigator.getGamepads()[0]){
				gamepad = navigator.getGamepads()[0];
				movingUp = gamepad.axes[1] == -1 ? true : false;
				movingDown = gamepad.axes[1] == 1 ? true : false;
				movingLeft = gamepad.axes[0] == -1 ? true : false;
				movingRight = gamepad.axes[0] == 1 ? true : false;
				shot = gamepad.buttons[0].pressed || gamepad.buttons[1].pressed ? true : false;
				if(gamepad.buttons[2].pressed) mainWindow.reload();
			}
		};

		var move = function(){
			if(movingRight) playerX += playerSpeed;
			else if(movingLeft) playerX -= playerSpeed;
			if(movingUp) playerY -= playerSpeed;
			else if(movingDown) playerY += playerSpeed;
			if(playerX <= 0) playerX = 0;
			else if(playerX + playerWidth >= gameWidth) playerX = gameWidth - playerWidth;
			if(playerY <= 0) playerY = 0;
			else if(playerY + playerHeight >= gameHeight) playerY = gameHeight - playerHeight;
		};

		updateGamepad();
		move();

	};

	var draw = function(){
		if(!isGameOver){
			if(!canGetHit){
				if(gameClock % 10 == 0) player.src = 'img/playerblank.png';
				else if(gameClock % 10 == 5) player.src = 'img/player.png';
			} else if(player.src != 'img/player.png') {
				player.src = 'img/player.png';
			}
			var offset = 0;
			if(movingLeft) offset = grid;
			else if(movingRight) offset = grid * 2;
			context.drawImage(player, offset, 0, grid, grid * 1.5, playerX, playerY, grid, grid * 1.5);
		}
	};

	update();
	draw();

};
var score = 0, highScore = 0, fullscreenMessageTime = 0, currentFullscreenMessage = 'score attack: 2 min', initialTime = new Date(), canTime = true, livesLeft = 3, canGetHit = true, isGameOver = false,
	hitClock = 0, scoreSaved = false;
var endTime = new Date(initialTime.getTime() + (2 * 60000));

const liveImg = new Image();
liveImg.src = 'img/life.png';

var setupHighScore = function(){
	if(savedData.highScore) highScore = savedData.highScore;
	else storage.set('savedData', {highScore: 0});
};

var hudLoop = function(){

	var drawScore = function(){
		var tempScore = String(score);
		var addZero = function(input){
			return input.length < 7 ? addZero('0' + input) : input;
		};
		tempScore = addZero(tempScore);
		drawString('score ' + tempScore, grid / 4, grid / 4);
	};

	var drawHighScore = function(){
		if(score > highScore) highScore = score;
		var tempScore = String(highScore);
		var addZero = function(input){
			return input.length < 7 ? addZero('0' + input) : input;
		};
		tempScore = addZero(tempScore);
		drawString('high ' + tempScore, (gameWidth - (grid / 4)) - ((grid / 2) * 12), grid / 4);
	}; 

	var drawTime = function(){
		if(canTime){
			var timeString = '';
			var secondsLeft = 120 - (gameClock / fps);
			var buildTimeString = function(){
				var tempMinutes = secondsLeft > 60 ? '1' : '0';
				var tempSeconds = String(secondsLeft);
				tempSeconds = tempSeconds.substring(0, tempSeconds.indexOf('.'));
				tempSeconds = parseInt(tempSeconds);
				if(tempSeconds > 59) tempSeconds = tempSeconds - 60;
				tempSeconds = String(tempSeconds);
				if(tempSeconds.length < 2) tempSeconds = '0' + tempSeconds;
				var tempMilliseconds = String(secondsLeft);
				tempMilliseconds = tempMilliseconds.substring(tempMilliseconds.indexOf('.') + 1);
				tempMilliseconds = tempMilliseconds.substring(0, 2);
				return tempMinutes + ':' + tempSeconds + ':' + tempMilliseconds;
			};
			if(secondsLeft == 120) timeString = '2:00:00';
			else if(secondsLeft < 120 && secondsLeft > 0) timeString = buildTimeString();
			else {
				timeString = '0:00:00';
				drawGameOverMessage();
				// stopInput();
				if(!scoreSaved) saveHighScore();
				canTime = false;
				isGameOver = true;
				shot = false;
			}
			drawString('time ' + timeString, grid / 4, (grid / 4) * 3);
		} else {
			drawString('time ' + '0:00:00', grid / 4, (grid / 4) * 3);
		}
	};

	var drawLives = function(){
		context.drawImage(liveImg, gameWidth - (grid * 1.5) - (grid / 4), gameHeight - (grid / 2) - (grid / 4));
		drawString(':' + String(livesLeft), gameWidth - grid - (grid / 4), gameHeight - (grid / 2) - (grid / 4));
		if(livesLeft == 0){
			currentFullscreenMessage = 'game over';
			drawFullscreenMessageNoTime();
			// stopInput();
			if(!scoreSaved) saveHighScore();
			canTime = false;
			isGameOver = true;
			shot = false;
		}
		if(hitClock > 0) hitClock--;
		else if(!canGetHit) canGetHit = true;
	};

	var drawFullscreenMessage = function(){
		drawString(currentFullscreenMessage, (gameWidth / 2) - (currentFullscreenMessage.length * (grid / 4)), (gameHeight / 2) - (grid / 4), true);
		fullscreenMessageTime++;
	};

	var drawFullscreenMessageNoTime = function(){
		drawString(currentFullscreenMessage, (gameWidth / 2) - (currentFullscreenMessage.length * (grid / 4)), (gameHeight / 2) - (grid / 4), true);
	};

	var drawGameOverMessage = function(){
		// currentFullscreenMessage = 'time over';
		var baseYPos = (gameHeight / 2) - (grid / 4);
		var firstString = 'time over', secondString = 'your score ' + score,
			thirdString = (score == highScore) ? 'new high score ' + score : '';
		if(thirdString == ''){
			drawString(firstString, (gameWidth / 2) - (firstString.length * (grid / 4)), baseYPos - (grid / 2));
			drawString(secondString, (gameWidth / 2) - (secondString.length * (grid / 4)), baseYPos + (grid / 2));
		} else {
			drawString(firstString, (gameWidth / 2) - (firstString.length * (grid / 4)), baseYPos - grid);
			drawString(secondString, (gameWidth / 2) - (secondString.length * (grid / 4)), baseYPos);
			drawString(thirdString, (gameWidth / 2) - (thirdString.length * (grid / 4)), baseYPos + grid);
		}
	};

	drawScore();
	drawHighScore();
	drawTime();
	drawLives();
	if(fullscreenMessageTime < fps * 2.5) drawFullscreenMessage();
	// if(gameClock == outroTime){
	// 	currentFullscreenMessage = 'the boss approaches';
	// 	drawFullscreenMessage()
	// };
};

var drawString = function(input, x, y, isRed){
	input.split('').forEach(function(char, i){
		drawChar(char, x + (i * (grid / 2)), y, isRed);
	});
};

const charImg = new Image();
charImg.src = 'img/font.png';

var drawChar = function(input, x, y, isRed){
	var charLeft = 0, charTop = 0, size = grid / 2;

	switch(input){
		// case '0': charLeft = numStart; break;
		case '1': charLeft = size; break;
		case '2': charLeft = size * 2; break;
		case '3': charLeft = size * 3; break;
		case '4': charLeft = size * 4; break;
		case '5': charLeft = size * 5; break;
		case '6': charLeft = size * 6; break;
		case '7': charLeft = size * 7; break;
		case '8': charLeft = size * 8; break;
		case '9': charLeft = size * 9; break;

		case 'a': charLeft = size * 10; break;
		case 'b': charLeft = size * 11; break;
		case 'c': charLeft = size * 12; break;
		case 'd': charLeft = size * 13; break;
		case 'e': charLeft = size * 14; break;
		case 'f': charLeft = size * 15; break;
		case 'g': charLeft = size * 16; break;
		case 'h': charLeft = size * 17; break;
		case 'i': charLeft = size * 18; break;
		case 'j': charLeft = size * 19; break;
		case 'k': charLeft = size * 20; break;
		case 'l': charLeft = size * 21; break;
		case 'm': charLeft = size * 22; break;
		case 'n': charLeft = size * 23; break;
		case 'o': charLeft = size * 24; break;
		case 'p': charLeft = size * 25; break;
		case 'q': charLeft = size * 26; break;
		case 'r': charLeft = size * 27; break;
		case 's': charLeft = size * 28; break;
		case 't': charLeft = size * 29; break;
		case 'u': charLeft = size * 30; break;
		case 'v': charLeft = size * 31; break;
		case 'w': charLeft = size * 32; break;
		case 'x': charLeft = size * 33; break;
		case 'y': charLeft = size * 34; break;
		case 'z': charLeft = size * 35; break;
		case ':': charLeft = size * 36; break;
		case ' ': charLeft = size * 37; break;
		case '.': charLeft = size * 14; break;
	};
	if(isRed) charTop = size;
	context.drawImage(charImg, charLeft, charTop, size, size, x, y, size, size);
};

var timeString = function(timeInput){
	var buildTimeString = function(){
		var timeChars = '';
		timeInput.split('').forEach(function(timeNum){
			if(timeNum == ':'){
				timeChars += '<fontchar class="colon"></fontchar>'
			}	else {
				timeChars += '<fontchar class="num_' + timeNum + '"></fontchar>'
			}	
		});
		return timeChars;
	};
	var output = '<fontchar class="t"></fontchar>\
		<fontchar class="i"></fontchar>\
		<fontchar class="m"></fontchar>\
		<fontchar class="e"></fontchar>\
		<fontchar class="space"></fontchar>' +
		buildTimeString();
	return output;
};

var getHit = function(enemyArr, i, destroysOnlyPlayer){
	if(livesLeft) livesLeft -= 1;
	explodeEntity({x: playerX, y: playerY, width: playerWidth, height: playerHeight});
	playerX = (gameWidth / 2) - (playerWidth / 2), playerY = gameHeight - ((grid * 2.75) + grid);
	currentPowerup = 1;
	canGetHit = false;
	hitClock = fps;
	if(!destroysOnlyPlayer) enemyArr.splice(i, 1);
};

var saveHighScore = function(){
	scoreSaved = true;
	savedData.highScore = highScore;
	storage.set('savedData', {highScore: highScore});
};
var shots = {one: [], two: [], twoBottom: [], three: [], threeBottom: [], threeLeft: [], threeRight: [], four: [], fourTopLeft: [], fourTopRight: [], fourBottomLeft: [], fourBottomRight: []},
	shotSpeed = grid * 1.25, shotClock = grid / 4, shotWidth = grid / 2, shotHeight = grid / 2, canShoot = true, currentPowerup = 1;

var shootingLoop = function(){

	var update = function(){
		if(shot && (gameClock % shotClock == 0)){
			var shotX = playerX + (playerWidth / 2) - (shotWidth / 2);
			var shotObj = {x: shotX, y: playerY - ((grid / 3) * 2)};
			switch(currentPowerup){
				case 1: shots.one.push(shotObj); break;
				case 2:
					shots.two.push(shotObj);
					shots.twoBottom.push({x: shotX + (grid / 8), y: playerY + (grid * 1.5)});
					break;
				case 3:
					shots.three.push({x: shotX + (grid / 8), y: playerY - ((grid / 3) * 2)});
					shots.threeBottom.push({x: shotX + (grid / 8), y: playerY + (grid * 1.5)});
					shots.threeLeft.push({x: shotX - grid, y: playerY - (grid / 4)});
					shots.threeRight.push({x: shotX + grid, y: playerY - (grid / 4)});
					break;
				case 4:
					shots.four.push(shotObj);
					shots.fourTopLeft.push({x: shotX - grid, y: playerY - (grid / 4)});
					shots.fourTopRight.push({x: shotX + grid, y: playerY - (grid / 4)});
					shots.fourBottomLeft.push({x: shotX - grid, y: playerY + (grid * 1.25)});
					shots.fourBottomRight.push({x: shotX + grid, y: playerY + (grid * 1.25)});
					break;
			};
		}
	};

	var draw = function(){
		var typeCount = 0;
		for(var i in shots){
			if(shots[i].length){
				shots[i].forEach(function(shotItem, j){
					shootBullet(shotItem, j, typeCount);
				});
			}
			typeCount++;
		};
	};

	update();
	draw();

};

var checkBulletBounds = function(shotItem){
	return (shotItem.y + shotHeight >= 0 && shotItem.y <= gameHeight && shotItem.x + shotWidth >= 0 && shotItem.x <= gameWidth) ? true : false;
};

var shootBullet = function(shotItem, i, type){
	switch(type){
		case 0: shootBulletOne(shotItem, i); break;
		case 1: shootBulletTwo(shotItem, i); break;
		case 2: shootBulletTwoBottom(shotItem, i); break;
		case 3: shootBulletThree(shotItem, i); break;
		case 4: shootBulletThreeBottom(shotItem, i); break;
		case 5: shootBulletThreeLeft(shotItem, i); break;
		case 6: shootBulletThreeRight(shotItem, i); break;
		case 7: shootBulletFour(shotItem, i); break;
		case 8: shootBulletFourTopLeft(shotItem, i); break;
		case 9: shootBulletFourTopRight(shotItem, i); break;
		case 10: shootBulletFourBottomLeft(shotItem, i); break;
		case 11: shootBulletFourBottomRight(shotItem, i); break;
	};
}

const bulletOneImg = new Image(), bulletTwoImg = new Image(), bulletThreeImg = new Image(), bulletThreeLeftImg = new Image(), bulletThreeRightImg = new Image();
bulletOneImg.src = 'img/playerbullet.png';
bulletTwoImg.src = 'img/playerbullettwo.png';
bulletThreeImg.src = 'img/playerbulletthree.png';
bulletThreeLeftImg.src = 'img/playerbulletthreeleft.png';
bulletThreeRightImg.src = 'img/playerbulletthreeright.png';

var shootBulletOne = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletOneImg, shotItem.x, shotItem.y);
		shots.one[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.one.splice(i, 1)
	}
};

var shootBulletTwo = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletOneImg, shotItem.x, shotItem.y);
		shots.two[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.two.splice(i, 1)
	}
};

var shootBulletTwoBottom = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletTwoImg, shotItem.x, shotItem.y);
		shots.twoBottom[i].y = shotItem.y += shotSpeed;
	} else {
		shots.twoBottom.splice(i, 1)
	}
};

var shootBulletThree = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeImg, shotItem.x, shotItem.y);
		shots.three[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.three.splice(i, 1)
	}
};

var shootBulletThreeBottom = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletTwoImg, shotItem.x, shotItem.y);
		shots.threeBottom[i].y = shotItem.y += shotSpeed;
	} else {
		shots.threeBottom.splice(i, 1)
	}
};

var shootSideSpeed = shotSpeed;

var shootBulletThreeLeft = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeLeftImg, shotItem.x, shotItem.y);
		shots.threeLeft[i].y = shotItem.y -= shotSpeed;
		shots.threeLeft[i].x = shotItem.x -= shootSideSpeed;
	} else {
		shots.threeLeft.splice(i, 1)
	}
};

var shootBulletThreeRight = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeRightImg, shotItem.x, shotItem.y);
		shots.threeRight[i].y = shotItem.y -= shotSpeed;
		shots.threeRight[i].x = shotItem.x += shootSideSpeed;
	} else {
		shots.threeRight.splice(i, 1)
	}
};

var shootBulletFour = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletOneImg, shotItem.x, shotItem.y);
		shots.four[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.four.splice(i, 1)
	}
};

var shootBulletFourTopLeft = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeLeftImg, shotItem.x, shotItem.y);
		shots.fourTopLeft[i].y = shotItem.y -= shotSpeed;
		shots.fourTopLeft[i].x = shotItem.x -= shootSideSpeed;
	} else {
		shots.fourTopLeft.splice(i, 1)
	}
};

var shootBulletFourTopRight = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeRightImg, shotItem.x, shotItem.y);
		shots.fourTopRight[i].y = shotItem.y -= shotSpeed;
		shots.fourTopRight[i].x = shotItem.x += shootSideSpeed;
	} else {
		shots.fourTopRight.splice(i, 1)
	}
};

var shootBulletFourBottomLeft = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeRightImg, shotItem.x, shotItem.y);
		shots.fourBottomLeft[i].y = shotItem.y += shotSpeed;
		shots.fourBottomLeft[i].x = shotItem.x -= shootSideSpeed;
	} else {
		shots.fourBottomLeft.splice(i, 1)
	}
};

var shootBulletFourBottomRight = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeLeftImg, shotItem.x, shotItem.y);
		shots.fourBottomRight[i].y = shotItem.y += shotSpeed;
		shots.fourBottomRight[i].x = shotItem.x += shootSideSpeed;
	} else {
		shots.fourBottomRight.splice(i, 1)
	}
};
var pointers = [];

const pointerImg = new Image();
pointerImg.src = 'img/pointer.png';

var spawnPointer = function(block){
	var pointerDirection = (Math.random() >= 0.5) ? 'left' : 'right';
	pointers.push({x: block.x + (grid / 4), y: block.y + (grid / 4), direction: pointerDirection, initial: block.x});
};

var pointerLoop = function(){

	var draw = function(){

		var animatePointers = function(){
			pointers.forEach(function(pointerObj, i){
				pointerObj.width = grid / 2;
				powerupObj = sineCurve(pointerObj, dropXSpeed, dropXMax);
				context.drawImage(pointerImg, pointerObj.x, pointerObj.y);
				pointers[i].y += levelSpeed;
				if(pointerObj.y >= gameHeight) pointers.splice(i, 1);
				checkPointerCollision(pointerObj, i);
			});
		};

		var checkPointerCollision = function(pointerObj, i){
			var pointerEl = {x: pointerObj.x, y: pointerObj.y, width: grid, height: grid}, playerEl = {x: playerX, y: playerY, width: grid, height: grid};
			checkCollision(pointerEl, playerEl, function(pointerEl, playerEl){
				pointers.splice(i, 1);
				score += 150;
			});
		};

		animatePointers();

	};

	if(pointers.length) draw();

};
