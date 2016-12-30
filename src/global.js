const fps = 60, canvas = document.getElementById('canvas'), canvasEl = $('canvas'), grid = 16, gameHeight = 240, gameWidth = 256, browserWindow = require('electron').remote, storage = require('electron-json-storage'),
charImg = new Image();
const context = canvas.getContext('2d'), mainWindow = browserWindow.getCurrentWindow();
let gamepad = false, savedData = {}, startedGame = false;
charImg.src = 'img/font.png';

const resizeGame = function(){
	var canvasWidth = getAspect().width, canvasHeight = getAspect().height;
	canvasEl.css('width', canvasWidth + 'px').css('height', canvasHeight + 'px').css('margin-left', -(canvasWidth / 2) + 'px').css('margin-top', -(canvasHeight / 2) + 'px');
}, clearGame = function(){
	resizeGame();
	context.clearRect(0, 0, getAspect().width, getAspect().height);
}, getAspect = function(){
	var newWidth = $(window).width(), newHeight = $(window).height(), remHeight = $(window).width() * 0.9375, remWidth = $(window).height() * 1.066666666667;
	if(newWidth >= remWidth) newWidth = remWidth;
	else if(newHeight > remHeight) newHeight = remHeight;
	return {width: newWidth, height: newHeight};
}, drawString = function(input, x, y, isRed){
	input.split('').forEach(function(char, i){
		drawChar(char, x + (i * (grid / 2)), y, isRed);
	});
}, drawChar = function(input, x, y, isRed){
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
		case '.': charLeft = size * 37; break;
		case ' ': charLeft = size * 38; break;
	};
	if(isRed) charTop = size;
	context.drawImage(charImg, charLeft, charTop, size, size, x, y, size, size);
};







// var canvas = document.getElementById('canvas'), canvasEl = $('canvas'), fps = 29.97, gameClock = 0, grid = 16, gameHeight = 240, gameWidth = 256, isFullscreen = false, gameLoopInterval, gamepad = false,
// 	browserWindow = require('electron').remote, dropXSpeed = grid  / 2, dropXMax = grid * 8, storage = require('electron-json-storage'), savedData = {};
// var context = canvas.getContext('2d'), mainWindow = browserWindow.getCurrentWindow();

// var init = function(){
// 	storage.get('savedData', function(err, data){
// 		savedData = data;
// 		initStart();
// 	});
// };

// var initGame = function(){
// 	$(window).resize(resizeGame);
// 	setupLevel();
// 	setupPlayer();
// 	setupHighScore();
// 	setupBackgroundMusic();
// 	gameLoopInterval = setInterval(gameLoop, 1000 / fps);
// 	gameLoop();
// };

// var gameLoop = function(){
// 	clearGame();
// 	levelLoop();
// 	secretLoop();
// 	enemiesLoop();
// 	explosionsLoop();
// 	enemyShootingLoop();
// 	pointerLoop();
// 	powerupLoop();
// 	shootingLoop();
// 	playerLoop();
// 	hudLoop();
// 	gameClock++;
// };

// const setupBackgroundMusic = function(){
// 	const musicEl = '<audio autoplay style="display:none;position:absolute;top:-100px;left:-100px;">\
// 		<source src="sound/bg.ogg" type="audio/ogg"></source>\
// 		</audio>';
// 	$('body').append(musicEl);
// };

// var resizeGame = function(){
// 	var canvasWidth = getAspect().width, canvasHeight = getAspect().height;
// 	canvasEl.css('width', canvasWidth + 'px').css('height', canvasHeight + 'px').css('margin-left', -(canvasWidth / 2) + 'px').css('margin-top', -(canvasHeight / 2) + 'px');
// };

// var clearGame = function(){
// 	resizeGame();
// 	context.clearRect(0, 0, getAspect().width, getAspect().height);
// };

// var getAspect = function(){
// 	var newWidth = $(window).width(), newHeight = $(window).height(), remHeight = $(window).width() * 0.9375, remWidth = $(window).height() * 1.066666666667;
// 	if(newWidth >= remWidth) newWidth = remWidth;
// 	else if(newHeight > remHeight) newHeight = remHeight;
// 	return {width: newWidth, height: newHeight};
// };

// var checkCollision = function(elA, elB, callback){
// 	if(elA.x + elA.width >= elB.x && elA.x <= elB.x + elB.width && elA.y <= elB.y + elB.height && elA.y + elA.height >= elB.y){
// 		callback(elA, elB);
// 	}
// };

// var checkBulletCollision = function(el, callback){
// 	for(var group in shots){
// 		if(shots[group].length){
// 			shots[group].forEach(function(shot, i){
// 				var shotObj = {x: shot.x, y: shot.y, width: grid / 2, height: grid / 2};
// 				if(group == 'twoBottom' || group == 'three' || group == 'threeBottom') shotObj.width = grid / 4;
// 				checkCollision(el, shotObj, function(el, shotObj){
// 					shots[group].splice(i, 1);
// 					callback(el);
// 				});
// 			});
// 		}
// 	};
// };

// var sineCurve = function(inputObj, baseSpeed, baseMax){
// 	if(inputObj.x <= 0 || inputObj.x <= inputObj.initial - baseMax) inputObj.direction = 'right';
// 	else if(inputObj.x + grid >= gameWidth || inputObj.x >= inputObj.initial + baseMax) inputObj.direction = 'left';
// 	if(baseMax == grid * 99){

// 		if((inputObj.x <= gameWidth / 4 && inputObj.x > gameWidth / 8) || 
// 			(inputObj.x + inputObj.width >= gameWidth - (gameWidth / 4) && inputObj.x + inputObj.width < gameWidth - (gameWidth / 8))){
// 			baseSpeed = (baseSpeed / 4) * 3;
// 		} else if(inputObj.x <= (gameWidth / 8) ||
// 			inputObj.x + inputObj.width >= gameWidth - (gameWidth / 8)){
// 			baseSpeed = baseSpeed / 2;
// 		} else {
// 			baseSpeed = baseSpeed;
// 		}

// 	} else {
// 		if((inputObj.x <= inputObj.initial - (baseMax * 0.25) && inputObj.x > inputObj.initial - (baseMax * 0.75)) ||
// 			(inputObj.x >= inputObj.initial + (baseMax * 0.25) && inputObj.x < inputObj.initial + (baseMax * 0.75))){
// 			baseSpeed = (baseSpeed / 4) * 3;
// 		} else if(inputObj.x <= inputObj.initial - (baseMax * 0.75) ||
// 			inputObj.x >= inputObj.initial + (baseMax * 0.75)){
// 			baseSpeed = baseSpeed / 2;
// 		} else {
// 			baseSpeed = baseSpeed;
// 		}
// 	}

// 	if(inputObj.direction == 'left') inputObj.x -= baseSpeed;
// 	else inputObj.x += baseSpeed;
// 	return inputObj;
// };

// var toggleFullscreen = function(){
// 	var openFullscreen = function(){
// 		mainWindow.setFullScreen(true);
// 		isFullscreen = true;
// 	}, closeFullscreen = function(){
// 		mainWindow.setFullScreen(false);
// 		isFullscreen = false;
// 	};
// 	isFullscreen ? closeFullscreen() : openFullscreen();
// };