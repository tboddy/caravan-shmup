var canvas = document.getElementById('canvas'), canvasEl = $('canvas'), fps = 29.97, gameClock = 0, grid = 16, gameHeight = 240, gameWidth = 256, isFullscreen = false, gameLoopInterval, 
	browserWindow = require('electron').remote, dropXSpeed = grid  / 2, dropXMax = grid * 8, storage = require('electron-json-storage'), savedData = {}, fpsmeter;
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