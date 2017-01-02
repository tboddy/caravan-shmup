const fps = 60, canvas = document.getElementById('canvas'), canvasEl = $('canvas'), grid = 16, gameHeight = 240, gameWidth = 256, browserWindow = require('electron').remote, storage = require('electron-json-storage'),
charImg = new Image();
const context = canvas.getContext('2d'), mainWindow = browserWindow.getCurrentWindow();
let gamepad = false, savedData = {}, startedGame = false, isFullscreen = false, loop, canGetHit = true;
charImg.src = 'img/font.png';

const resizeGame = function(){
	var canvasWidth = getAspect().width, canvasHeight = getAspect().height;
	canvasEl.css('width', canvasWidth + 'px').css('height', canvasHeight + 'px').css('margin-left', -(canvasWidth / 2) + 'px').css('margin-top', -(canvasHeight / 2) + 'px');
},

clearGame = function(){
	resizeGame();
	context.clearRect(0, 0, getAspect().width, getAspect().height);
},

getAspect = function(){
	var newWidth = $(window).width(), newHeight = $(window).height(), remHeight = $(window).width() * 0.9375, remWidth = $(window).height() * 1.066666666667;
	if(newWidth >= remWidth) newWidth = remWidth;
	else if(newHeight > remHeight) newHeight = remHeight;
	return {width: newWidth, height: newHeight};
},

drawString = function(input, x, y, isRed){
	input.split('').forEach(function(char, i){
		drawChar(char, x + (i * (grid / 2)), y, isRed);
	});
},

drawChar = function(input, x, y, isRed){
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
},

checkCollision = function(elA, elB, callback){
	if(elA.x + elA.width >= elB.x && elA.x <= elB.x + elB.width && elA.y <= elB.y + elB.height && elA.y + elA.height >= elB.y){
		callback(elA, elB);
	}
};
const start = function(){
	let menu = [
		{label: 'start game', action: 'startGame', active: true, index: 0},
		{label: 'options', action: 'showOptions', active: false, index: 1},
	], optionsMenu = [
		{label: 'toggle fullscreen', action: 'toggleFullscreen', active: true, index: 0},
		{label: 'back', action: 'cancelOptions', active: false, index: 1},
	], currentMenuItem = {}, optionsShowing = false;

	const startLogoImg = new Image(), creditString = '2016 decontrol';
	startLogoImg.src = 'img/logo.png';

	const init = function(){
		$(window).resize(resizeGame);
		controls();
		loop = startLoop();
		canvasEl.show();
		window.requestAnimationFrame(loop);
	},

	startLoop = function(){
		return function(){
			const draw = function(){
				context.drawImage(startLogoImg, (gameWidth / 2) - 64, grid * 2.5);
				if(optionsShowing){
					optionsMenu.forEach(function(item, i){
						const isActive = item.active ? true : false;
						drawString(item.label, textCenter(item.label), grid * (9.5 + (i * .5)), isActive);
					});
				} else {
					menu.forEach(function(item, i){
						const isActive = item.active ? true : false;
						drawString(item.label, textCenter(item.label), grid * (9.5 + (i * .5)), isActive);
					});
					drawString(creditString, textCenter(creditString), grid * 11.5);
				}
			};
			clearGame();
			draw();
			window.requestAnimationFrame(loop);
		};
	},

	textCenter = function(string){
		return (gameWidth / 2) - (string.length * (grid / 4));
	},

	controls = function(){
		setupKeyboard();
	},

	moveUpMenu = function(){
		getCurrentMenuItem();
		const menuArr = optionsShowing ? optionsMenu : menu;
		if(menuArr[currentMenuItem.index - 1]){
			menuArr[currentMenuItem.index].active = false;
			menuArr[currentMenuItem.index - 1].active = true;
		}
	},

	moveDownMenu = function(){
		getCurrentMenuItem();
		const menuArr = optionsShowing ? optionsMenu : menu;
		if(menuArr[currentMenuItem.index + 1]){
			menuArr[currentMenuItem.index].active = false;
			menuArr[currentMenuItem.index + 1].active = true;
		}
	},

	selectMenuItem = function(){
		getCurrentMenuItem();
		eval(currentMenuItem.action + '()');
	},

	getCurrentMenuItem = function(){
		const menuArr = optionsShowing ? optionsMenu : menu;
		menuArr.forEach(function(item, i){
			if(item.active) currentMenuItem = item;
		});
	},

	startGame = function(){
		if(!startedGame){
			stopKeyboard();
			startedGame = true;
			clearGame();
			initGame();
		}
	},

	setupKeyboard = function(){
		document.addEventListener('keydown', keysDown);
	}, 

	stopKeyboard = function(){
		document.removeEventListener('keydown', keysDown);
	},

	keysDown = function(e){
		switch(e.which){
			case 38: moveUpMenu(); break;
			case 40: moveDownMenu(); break;
			case 13: selectMenuItem(); break;
		};
	},

	showOptions = function(){
		optionsShowing = true;
	},

	toggleFullscreen = function(){
		const openFullscreen = function(){
			mainWindow.setFullScreen(true);
			isFullscreen = true;
		}, closeFullscreen = function(){
			mainWindow.setFullScreen(false);
			isFullscreen = false;
		};
		isFullscreen ? closeFullscreen() : openFullscreen();
	},

	cancelOptions = function(){
		optionsShowing = false;
	};

	storage.get('savedData', function(err, data){
		savedData = data;
		init();
	});
	
};


// var drawStart = function(){
// 	var verString = 'pre alpha 0.04',
// 		startString = 'press start or enter',
// 		creditString = '2016 decontrol';
// 	context.drawImage(startLogoImg, (gameWidth / 2) - 64, grid * 2.5);
// 	drawString(verString, textCenter(verString), grid * 9.5);
// 	drawString(creditString, textCenter(creditString), grid * 10);
// 	drawString(startString, textCenter(startString), grid * 11.5);
// 	// context.drawImage(studiosLogoImg, (gameWidth / 2) - 32, grid * 12);
// };





// var startedGame = false, startLoopInterval;

// var initStart = function(){
// 	// initGame()
// 	startLoopInterval = setInterval(startLoop, 1000 / fps);
// 	startControls();
// };

// var setupGamepad = function(){
// 	gamepad = navigator.getGamepads()[0];
// };

// var startControls = function(){

// 	var setupKeyboard = function(){
// 		$(document).keydown(function(e){
// 			switch(e.which){
// 				case 13: checkStartGame(); break;
// 				case 220: toggleFullscreen(); break;
// 			};
// 		});
// 	};

// 	navigator.getGamepads()[0] ? setupGamepad() : window.addEventListener('gamepadconnected', setupGamepad);
// 	setupKeyboard();
// };

// var startLoop = function(){
// 	clearGame();
// 	updateStartGamepad();
// 	drawStart();
// };

// var updateStartGamepad = function(){
// 	if(!gamepad) setupGamepad()
// 	if(navigator.getGamepads()[0]) if(gamepad.buttons[9].pressed) checkStartGame();
// };

// const startLogoImg = new Image(), studiosLogoImg = new Image();
// startLogoImg.src = 'img/logo.png';
// studiosLogoImg.src = 'img/studioslogo.png';


// var textCenter = function(string){
// 	return (gameWidth / 2) - (string.length * (grid / 4));
// };

// var checkStartGame = function(){
// 	if(!startedGame){
// 		startedGame = true;
// 		clearInterval(startLoopInterval);
// 		initGame();
// 	}
// };
let gameLoopInterval, isGameOver = false, gameClock = 0;

const initGame = function(){
	setupPlayer();
	setupHighScore();
	loop = gameLoop();
},

gameLoop = function(){
	return function(){
		clearGame();
		enemiesLoop();
		shootingLoop();
		enemyShootingLoop();
		playerLoop();
		explosionsLoop();
		hudLoop();
		gameClock++;
		window.requestAnimationFrame(loop);
	};
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
let enemies = {
	small: {one: [], two: [], three: [], four: []},
	medium: {one: []}
};

const enemySmallOneImg = new Image(), enemySmallTwoImg = new Image(), enemySmallFourImg = new Image(), enemySmallFiveImg = new Image(), enemyMediumOneImg = new Image();
enemySmallOneImg.src = 'img/enemysmallone.png';
enemySmallTwoImg.src = 'img/enemysmalltwo.png';
enemyMediumOneImg.src = 'img/enemymediumone.png';
enemySmallFourImg.src = 'img/enemysmallthree.png';
enemySmallFiveImg.src = 'img/enemysmallfive.png';


const enemySmallOneAnimation = function(enemy){
	enemy.y += 1.25;
	const increase = 90 / 180 * Math.PI / (grid * 1.15);
	enemy.x = enemy.initial - Math.sin(enemy.count) * (grid * 5);
	enemy.count += increase;
	return enemy;
},

enemySmallTwoAnimation = function(enemy){
	enemy.y += 1.25;
	const increase = 90 / 180 * Math.PI / (grid * 1);
	enemy.x = enemy.initial - Math.sin(enemy.count) * (grid * 4);
	enemy.count += increase;
	return enemy;
},

enemySmallThreeAnimation = function(enemy){
	if(enemy.x <= playerX - 2 && enemy.y <= playerY + playerHeight && enemy.y <= gameHeight / 3){
		enemy.y += 1;
		enemy.x += 3;
	} else if(enemy.x >= playerX + 2 && enemy.y <= playerY + playerHeight && enemy.y <= gameHeight / 3){
		enemy.y += 1;
		enemy.x -= 3;
	} else {
		enemy.y += 2.5;
	}
	return enemy;
},

enemyMediumOneAnimation = function(enemy){
	if((enemy.y + enemy.height) >= (gameHeight / 4) * 3) enemy.direction = 'up';
	if(enemy.direction == 'up'){
		enemy.y -= 1;
		if(gameClock % 8 == 0) spawnMediumOneShot(enemy);
	}
	else enemy.y += 2.5;
	return enemy;
};

const waveSmallOne = function(initialPos){
	return {
		animation: enemySmallOneAnimation,
		img: enemySmallOneImg,
		width: grid,
		height: grid,
		initial: initialPos,
		score: 300,
		enemies: [
			{count: -0.8, y: grid * -10},
			{count: -0.6, y: grid * -9},
			{count: -0.4, y: grid * -8},
			{count: -0.2, y: grid * -7},
			{count: 0, y: grid * -6},
			{count: 0.2, y: grid * -5},
			{count: 0.4, y: grid * -4},
			{count: 0.6, y: grid * -3},
			{count: 0.8, y: grid * -2},
			{count: 1, y: grid * -1}
		]
	};
},

waveSmallTwo = function(initialPos){
	return {
		animation: enemySmallTwoAnimation,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		initial: initialPos,
		score: 300,
		enemies: [
			{count: -0.4, y: grid * -8},
			{count: -0.2, y: grid * -7},
			{count: 0, y: grid * -6},
			{count: 0.2, y: grid * -5},
			{count: 0.4, y: grid * -4},
			{count: 0.6, y: grid * -3},
			{count: 0.8, y: grid * -2},
			{count: 1, y: grid * -1}
		]
	};
},

waveSmallThree = function(){
	return {
		animation: enemySmallThreeAnimation,
		img: enemySmallTwoImg,
		width: grid,
		height: grid,
		score: 500,
		enemies: [
			{x: -grid, y: grid * -3},
			{x: -grid, y: grid * -1}
		]
	};
};

waveMediumOne = function(){
	return {
		animation: enemyMediumOneAnimation,
		img: enemyMediumOneImg,
		score: 1000,
		hits: 5,
		height: grid * 2,
		width: grid * 2,
		enemies: [
			{x: grid * 2, y: grid * -1},
			{x: gameWidth - (grid * 4), y: grid * -8}
		]
	}
};

const waves = {
	// 0: waveSmallOne(grid * 6),
	// 150: waveSmallOne(grid * 9),
	// 325: waveMediumOne(),
	// 500: waveSmallTwo(grid * 7),
	// 625: waveSmallTwo(grid * 8)
	0: waveSmallThree()
},

enemiesLoop = function(){
	for(waveTime in waves){
		if(gameClock >= parseInt(waveTime)) waveLoop(waveTime);
	};
},

waveLoop = function(waveTime){
	const draw = function(enemy, i){
		enemy.animation = waves[waveTime].animation;
		enemy.img = waves[waveTime].img;
		enemy.width = waves[waveTime].width;
		enemy.height = waves[waveTime].height;
		if(waves[waveTime].initial) enemy.initial = waves[waveTime].initial;
		enemy = enemy.animation(enemy);
		context.drawImage(enemy.img, enemy.x, enemy.y);
		if(enemy.y > gameHeight && i == 0) delete waves[waveTime];
		else if(enemy.y <= -(grid * 8) && (i + 1) == waves[waveTime].enemies.length) delete waves[waveTime];
		const enemyCollisionEl = {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height};
		checkBulletCollision(enemyCollisionEl, function(bulletObj){
			explodeEntity(bulletObj);
			score += waves[waveTime].score;
			waves[waveTime].enemies.splice(i, 1);
		});
		if(canGetHit){
			checkCollision({x: playerX, y: playerY, width: playerWidth, height: playerHeight}, enemyCollisionEl, function(){
				enemy.onlyDestroysPlayer ? getHit(waves[waveTime].enemies, i, true) : getHit(waves[waveTime].enemies, i);
			});
		}
	};
	waves[waveTime].enemies.forEach(function(enemy, i){
		if(waves[waveTime]) draw(enemy, i);
	});
};








// var enemiesLoop = function(){

// 	var draw = function(){

// 		var drawEnemy = function(opts){
// 			opts.arr.forEach(function(enemyObj, i){
// 				if(enemyObj.y + opts.height < 0 && (enemyObj.direction && (enemyObj.direction != 'up') || !enemyObj.direction)) enemyObj.y += levelSpeed;
// 				if(enemyObj.y + opts.height >= 0){
// 				enemyObj = opts.animation(enemyObj, opts.width, opts.height, i, opts.arr);
// 					context.drawImage(opts.img, enemyObj.x, enemyObj.y);
// 					var enemyCollisionEl = {x: enemyObj.x, y: enemyObj.y, width: opts.width, height: opts.height};
// 					checkBulletCollision(enemyCollisionEl, function(){
// 						explodeEntity(enemyCollisionEl);
// 						if(opts.hits && !opts.arr['hits']){
// 							opts.arr['hits'] = opts.hits;
// 						} else if(opts.arr['hits']) {
// 							opts.arr.hits -= 1;
// 							if(opts.arr.hits == 0){
// 								opts.arr.splice(i, 1);
// 								score += opts.score;
// 								if(opts.bossType){
// 									switch(opts.bossType){
// 										case 'bossOneA': bossOneAActive = false; break;
// 										case 'bossOneB': bossOneBActive = false; break;
// 									}
// 								}
// 							}
// 						} else {
// 							opts.arr.splice(i, 1);
// 							score += opts.score;
// 						}
// 					});
// 					if(canGetHit){
// 						checkCollision({x: playerX, y: playerY, width: playerWidth, height: playerHeight}, enemyCollisionEl, function(){
// 							opts.onlyDestroysPlayer ? getHit(opts.arr, i, true) : getHit(opts.arr, i);
// 						});
// 					}
// 					if(enemyObj.y + opts.height < 0 && enemyObj.direction){
// 						if(enemyObj.direction == 'up') opts.arr.splice(i, 1);
// 					}
// 					if((enemyObj.y + opts.height >= gameHeight + (opts.height * 2))) opts.arr.splice(i, 1);
// 				}
// 			});
// 		};

// 		if(!bossOneAActive && !bossOneBActive){
// 			if(enemies.small.one.length) drawEnemySmallOne(drawEnemy);
// 			if(enemies.small.two.length) drawEnemySmallTwo(drawEnemy);
// 			if(enemies.small.three.length) drawEnemySmallThree(drawEnemy);
// 			if(enemies.small.four.length) drawEnemySmallFour(drawEnemy);
// 			if(enemies.medium.one.length) drawEnemyMediumOne(drawEnemy);
// 		}

// 		if(bosses.oneA.length) drawBossOneA(drawEnemy);
// 		if(bosses.oneB.length) drawBossOneB(drawEnemy);

// 	};

// 	draw();

// };

// // draw farm
// var drawEnemySmallOne = function(callback){
// 	var opts = {
// 		arr: enemies.small.one,
// 		img: enemySmallOneImg,
// 		width: grid,
// 		height: grid,
// 		animation: enemyAnimations.smallOne,
// 		score: 300
// 	};
// 	callback(opts);
// }, drawEnemySmallTwo = function(callback){
// 	var opts = {
// 		arr: enemies.small.two,
// 		img: enemySmallTwoImg,
// 		width: grid,
// 		height: grid,
// 		animation: enemyAnimations.smallTwo,
// 		score: 300
// 	};
// 	callback(opts);
// }, drawEnemySmallThree = function(callback){
// 	var opts = {
// 		arr: enemies.small.three,
// 		img: enemySmallTwoImg,
// 		width: grid,
// 		height: grid,
// 		animation: enemyAnimations.smallThree,
// 		score: 500
// 	};
// 	callback(opts);
// }, drawEnemySmallFour = function(callback){
// 	var opts = {
// 		arr: enemies.small.four,
// 		img: enemySmallFourImg,
// 		width: grid,
// 		height: grid,
// 		animation: enemyAnimations.smallFour,
// 		score: 200
// 	};
// 	callback(opts);
// }, drawEnemyMediumOne = function(callback){
// 	var opts = {
// 		arr: enemies.medium.one,
// 		img: enemyMediumOneImg,
// 		width: grid * 2,
// 		height: grid * 2,
// 		animation: enemyAnimations.mediumOne,
// 		score: 1000,
// 		hits: 5
// 	};
// 	callback(opts);
// };


// // animations

// var enemyAnimations = {
// 	smallOne: function(enemyObj){
// 		if(enemyObj.y + grid >= 0) enemyObj.y += (levelSpeed / 4) * 3;
// 		enemyObj = sineCurve(enemyObj, (grid / 5) * 2, grid * 4);
// 		return enemyObj;
// 	},
// 	smallTwo: function(enemyObj, enemyWidth, enemyHeight){
// 		if(enemyObj.y + grid >= 0) enemyObj.y += levelSpeed;
// 		enemyObj = sineCurve(enemyObj, (grid / 5) * 2, grid * 2.5);
// 		return enemyObj;
// 	},
// 	smallThree: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
// 		if(enemyObj.y + enemyHeight >= 0){
// 			let ySpeed = levelSpeed;
// 			if(enemyObj.y + grid > grid){
// 				if(enemyObj.y + enemyObj.height < playerY){
// 					if(enemyObj.x + enemyWidth < playerX) enemyObj.x += grid / 3;
// 					else if(enemyObj.x + enemyObj.width > playerX + playerWidth) enemyObj.x -= grid / 3;
// 					if(enemyObj.x + enemyWidth >= playerX - grid && enemyObj.x + enemyObj.width < playerX + playerWidth + grid) ySpeed = levelSpeed * 2.5;
// 				} else ySpeed = levelSpeed * 2.5;
// 			}
// 			enemyObj.y += ySpeed;
// 		}
// 		return enemyObj;
// 	}, smallFour: function(enemyObj, enemyWidth, enemyHeight, i, enemyArr){
// 		if(enemyObj.y + enemyHeight >= 0){
// 			enemyObj.y += levelSpeed * 3;
// 		}
// 		return enemyObj;
// 	}, mediumOne: function(enemyObj){
// 		if((enemyObj.y + enemyObj.height) >= gameHeight / 2) enemyObj.direction = 'up';
// 		if(enemyObj.direction == 'up'){
// 			enemyObj.y -= levelSpeed / 2;
// 			if(gameClock % 6 == 0){
// 				spawnMediumOneShot(enemyObj);
// 			}
// 		}
// 		else enemyObj.y += levelSpeed * 2;
// 		return enemyObj;
// 	}
// };
const playerSpeed = 4, playerWidth = grid, playerHeight = grid * 1.5;
let movingUp = false, movingDown = false, movingLeft = false, movingRight = false, shot = false, player, playerIsHidden = false, playerX = (gameWidth / 2) - (playerWidth / 2), playerY = gameHeight - (playerHeight + grid);

const setupPlayer = function(){
	const setupKeyboard = function(){
		document.addEventListener('keydown', playerKeysDown);
		document.addEventListener('keyup', playerKeysUp);
	}, buildPlayer = function(){
		player = new Image();
	};
	setupKeyboard();
	buildPlayer();
},

playerKeysDown = function(e){
	switch(e.which){
		case 38: movingUp = true; break;
		case 40: movingDown = true; break;
		case 37: movingLeft = true; break;
		case 39: movingRight = true; break;
		case 90: shot = true; break;
	};
},

playerKeysUp = function(e){
	switch(e.which){
		case 38: movingUp = false; break;
		case 40: movingDown = false; break;
		case 37: movingLeft = false; break;
		case 39: movingRight = false; break;
		case 90: shot = false; break;
	};
};

playerLoop = function(){
	const update = function(){
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
		move();
	},
	draw = function(){
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






// var movingUp = false, movingDown = false, movingLeft = false, movingRight = false, shot = false, isPaused = false, player, inputStopped = false,  playerSpeed = grid / 2, playerWidth = grid, playerHeight = grid * 1.5, playerIsHidden = false;
// var playerX = (gameWidth / 2) - (playerWidth / 2), playerY = gameHeight - (playerHeight + grid);

// const playerImg = new Image();

// const playerKeysDown = function(e){
// 	switch(e.which){
// 		case 38: movingUp = true; break;
// 		case 40: movingDown = true; break;
// 		case 37: movingLeft = true; break;
// 		case 39: movingRight = true; break;
// 		case 90: shot = true; break;
// 		case 191: mainWindow.reload(); break;
// 	};
// }, playerKeysUp = function(e){
// 	switch(e.which){
// 		case 38: movingUp = false; break;
// 		case 40: movingDown = false; break;
// 		case 37: movingLeft = false; break;
// 		case 39: movingRight = false; break;
// 		case 90: shot = false; break;
// 	};
// }, playerReloadOnly = function(e){
// 	switch(e.which){
// 		case 191: mainWindow.reload(); break;
// 	};
// };

// const setupPlayer = function(){
// 	const setupKeyboard = function(){
// 		document.addEventListener('keydown', playerKeysDown);
// 		document.addEventListener('keyup', playerKeysUp);
// 	}, buildPlayer = function(){
// 		player = new Image();
// 	};
// 	setupKeyboard();
// 	buildPlayer();
// };

// var stopInput = function(){
// 	document.removeEventListener('keydown', playerKeysDown);
// 	document.removeEventListener('keyup', playerKeysUp);
// 	document.addEventListener('playerReloadOnly', playerKeysUp);
// 	inputStopped = true;
// };

// const analogThresh = 0.15;

// var playerLoop = function(){

// 	var update = function(){

// 		var updateGamepad = function(){
// 			if(inputStopped && navigator.getGamepads()[0]){
// 				gamepad = navigator.getGamepads()[0];
// 				movingUp = false, movingDown = false, movingDown = false, movingLeft = false, movingRight = false, shot = false;
// 				if(gamepad.buttons[2].pressed) mainWindow.reload();
// 			} else if(navigator.getGamepads()[0]){
// 				gamepad = navigator.getGamepads()[0];
// 				if(gamepad.axes[9]){
// 					var hatSwitch = gamepad.axes[9].toFixed(1);
// 					movingUp = hatSwitch == '-1.0' || hatSwitch == '1.0' || hatSwitch == '-0.7' ? true : false;
// 					movingDown = hatSwitch == '0.1' || hatSwitch == '-0.1' || hatSwitch == '0.4' ? true : false;
// 					movingLeft = hatSwitch == '0.7' || hatSwitch == '1.0' || hatSwitch == '0.4' ? true : false;
// 					movingRight = hatSwitch == '-0.4' || hatSwitch == '-0.1' || hatSwitch == '-0.7' ? true : false; 
// 				} else {
// 					movingUp = gamepad.axes[1] < analogThresh * -1 ? true : false;
// 					movingDown = gamepad.axes[1] > analogThresh ? true : false;
// 					movingLeft = gamepad.axes[0] < analogThresh * -1 ? true : false;
// 					movingRight = gamepad.axes[0] > analogThresh ? true : false;
// 				}
// 				shot = gamepad.buttons[0].pressed || gamepad.buttons[1].pressed || gamepad.buttons[3].pressed || gamepad.buttons[2].pressed ? true : false;
// 				if(gamepad.buttons[8].pressed) mainWindow.reload();
// 			}
// 		};

// 		var move = function(){
// 			if(movingRight) playerX += playerSpeed;
// 			else if(movingLeft) playerX -= playerSpeed;
// 			if(movingUp) playerY -= playerSpeed;
// 			else if(movingDown) playerY += playerSpeed;
// 			if(playerX <= 0) playerX = 0;
// 			else if(playerX + playerWidth >= gameWidth) playerX = gameWidth - playerWidth;
// 			if(playerY <= 0) playerY = 0;
// 			else if(playerY + playerHeight >= gameHeight) playerY = gameHeight - playerHeight;
// 		};

// 		updateGamepad();
// 		move();

// 	};

// 	var draw = function(){
// 		if(!isGameOver){
// 			if(!canGetHit){
// 				if(gameClock % 10 == 0) player.src = 'img/playerblank.png';
// 				else if(gameClock % 10 == 5) player.src = 'img/player.png';
// 			} else if(player.src != 'img/player.png') {
// 				player.src = 'img/player.png';
// 			}
// 			var offset = 0;
// 			if(movingLeft) offset = grid;
// 			else if(movingRight) offset = grid * 2;
// 			context.drawImage(player, offset, 0, grid, grid * 1.5, playerX, playerY, grid, grid * 1.5);
// 		}
// 	};

// 	update();
// 	draw();

// };
let enemyShots = {
	medium: {one: []}
};

const missileOneImg = new Image(), blueBulletImg = new Image();
missileOneImg.src = 'img/missileone.png';
blueBulletImg.src = 'img/bluebullet.png';

const spawnMediumOneShot = function(enemy){
	enemyShots.medium.one.push({x: enemy.x + (grid / 3), y: enemy.y + grid, width: grid / 2, height: grid});
	enemyShots.medium.one.push({x: (enemy.x + (grid * 2)) - ((grid / 3) + (grid / 2)), y: enemy.y + grid, width: grid / 2, height: grid});
},

enemyShootingLoop = function(){
	var draw = function(){
		if(enemyShots.medium.one.length) animateMediumOneShot();
		// if(bossShots.oneA.length) bossBulletAnimations.oneA();
		// if(bossShots.oneB.length) bossBulletAnimations.oneB();
	};
	draw();
}, 

animateMediumOneShot = function(){
	enemyShots.medium.one.forEach(function(shotObj, i){
		context.drawImage(missileOneImg, shotObj.x, shotObj.y);
		enemyShots.medium.one[i].y += 4;
		if(enemyShots.medium.one[i].y >= gameHeight) enemyShots.medium.one.splice(i, 1);
		if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.medium.one);
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
let shots = {one: [], two: [], twoBottom: [], three: [], threeBottom: [], threeLeft: [], threeRight: [], four: [], fourTopLeft: [], fourTopRight: [], fourBottomLeft: [], fourBottomRight: []}, canShoot = true, currentPowerup = 4;
const shotSpeed = 12, shotClock = 6, shotWidth = grid / 2, shotHeight = grid / 2, bulletOneImg = new Image(), bulletTwoImg = new Image(), bulletThreeImg = new Image(), bulletThreeLeftImg = new Image(), bulletThreeRightImg = new Image();
bulletOneImg.src = 'img/playerbullet.png';
bulletTwoImg.src = 'img/playerbullettwo.png';
bulletThreeImg.src = 'img/playerbulletthree.png';
bulletThreeLeftImg.src = 'img/playerbulletthreeleft.png';
bulletThreeRightImg.src = 'img/playerbulletthreeright.png';

const shootingLoop = function(){
	const update = function(){
		if(shot && (gameClock % shotClock == 0)){
			const shotX = playerX + (playerWidth / 2) - (shotWidth / 2);
			const shotObj = {x: shotX, y: playerY - ((grid / 3) * 2)};
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
	const draw = function(){
		let typeCount = 0;
		for(let i in shots){
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
},

checkBulletBounds = function(shotItem){
	return (shotItem.y + shotHeight >= 0 && shotItem.y <= gameHeight && shotItem.x + shotWidth >= 0 && shotItem.x <= gameWidth) ? true : false;
},

shootBullet = function(shotItem, i, type){
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
},

shootBulletOne = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletOneImg, shotItem.x, shotItem.y);
		shots.one[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.one.splice(i, 1)
	}
},

shootBulletTwo = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletOneImg, shotItem.x, shotItem.y);
		shots.two[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.two.splice(i, 1)
	}
},

shootBulletTwoBottom = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletTwoImg, shotItem.x, shotItem.y);
		shots.twoBottom[i].y = shotItem.y += shotSpeed;
	} else {
		shots.twoBottom.splice(i, 1)
	}
},

shootBulletThree = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeImg, shotItem.x, shotItem.y);
		shots.three[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.three.splice(i, 1)
	}
},

shootBulletThreeBottom = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletTwoImg, shotItem.x, shotItem.y);
		shots.threeBottom[i].y = shotItem.y += shotSpeed;
	} else {
		shots.threeBottom.splice(i, 1)
	}
},

shootBulletThreeLeft = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeLeftImg, shotItem.x, shotItem.y);
		shots.threeLeft[i].y = shotItem.y -= shotSpeed;
		shots.threeLeft[i].x = shotItem.x -= shotSpeed;
	} else {
		shots.threeLeft.splice(i, 1)
	}
},

shootBulletThreeRight = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeRightImg, shotItem.x, shotItem.y);
		shots.threeRight[i].y = shotItem.y -= shotSpeed;
		shots.threeRight[i].x = shotItem.x += shotSpeed;
	} else {
		shots.threeRight.splice(i, 1)
	}
},

shootBulletFour = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletOneImg, shotItem.x, shotItem.y);
		shots.four[i].y = shotItem.y -= shotSpeed;
	} else {
		shots.four.splice(i, 1)
	}
},

shootBulletFourTopLeft = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeLeftImg, shotItem.x, shotItem.y);
		shots.fourTopLeft[i].y = shotItem.y -= shotSpeed;
		shots.fourTopLeft[i].x = shotItem.x -= shotSpeed;
	} else {
		shots.fourTopLeft.splice(i, 1)
	}
},

shootBulletFourTopRight = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeRightImg, shotItem.x, shotItem.y);
		shots.fourTopRight[i].y = shotItem.y -= shotSpeed;
		shots.fourTopRight[i].x = shotItem.x += shotSpeed;
	} else {
		shots.fourTopRight.splice(i, 1)
	}
},

shootBulletFourBottomLeft = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeRightImg, shotItem.x, shotItem.y);
		shots.fourBottomLeft[i].y = shotItem.y += shotSpeed;
		shots.fourBottomLeft[i].x = shotItem.x -= shotSpeed;
	} else {
		shots.fourBottomLeft.splice(i, 1)
	}
},

shootBulletFourBottomRight = function(shotItem, i){
	if(checkBulletBounds(shotItem)){
		context.drawImage(bulletThreeLeftImg, shotItem.x, shotItem.y);
		shots.fourBottomRight[i].y = shotItem.y += shotSpeed;
		shots.fourBottomRight[i].x = shotItem.x += shotSpeed;
	} else {
		shots.fourBottomRight.splice(i, 1)
	}
},

checkBulletCollision = function(el, callback){
	for(var group in shots){
		if(shots[group].length){
			shots[group].forEach(function(shot, i){
				var shotObj = {x: shot.x, y: shot.y, width: grid / 2, height: grid / 2};
				if(group == 'twoBottom' || group == 'three' || group == 'threeBottom') shotObj.width = grid / 4;
				checkCollision(el, shotObj, function(el, shotObj){
					shots[group].splice(i, 1);
					callback(shotObj);
				});
			});
		}
	};
};
let explosions = [];

const explodeEntity = function(entityObj){
	entityObj.time = gameClock;
	explosions.push(entityObj);
};


const explosionAnimateTime = 1, explosionSize = grid * 2;

const explosionImg = new Image();
explosionImg.src = 'img/explosions.png';

const explosionsLoop = function(){
	const draw = function(){
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
	if(explosions.length) draw();
};
let score = 0, highScore = 0, fullscreenMessageTime = 0, currentFullscreenMessage = 'score attack: 2 min', initialTime = new Date(), canTime = true, livesLeft = 4, isFinished = false, isDead = false,
	hitClock = 0, scoreSaved = false;
let endTime = new Date(initialTime.getTime() + (2 * 60000));

const setupHighScore = function(){
	if(savedData.highScore) highScore = savedData.highScore;
	else storage.set('savedData', {highScore: 0});
},

hudLoop = function(){

	const drawScore = function(){
		let tempScore = String(score);
		const addZero = function(input){
			return input.length < 7 ? addZero('0' + input) : input;
		};
		tempScore = addZero(tempScore);
		drawString('score ' + tempScore, grid / 4, grid / 4);
	},

	drawHighScore = function(){
		if(score > highScore) highScore = score;
		let tempScore = String(highScore);
		const addZero = function(input){
			return input.length < 7 ? addZero('0' + input) : input;
		};
		tempScore = addZero(tempScore);
		drawString('high ' + tempScore, (gameWidth - (grid / 4)) - ((grid / 2) * 12), grid / 4);
	},

	drawTime = function(){
		if(canTime){
			let timeString = '';
			const secondsLeft = 120 - (gameClock / fps),
			buildTimeString = function(){
				var tempMinutes = secondsLeft > 60 ? '1' : '0';
				var tempSeconds = String(secondsLeft);
				if(tempSeconds.indexOf('.') > -1) tempSeconds = tempSeconds.substring(0, tempSeconds.indexOf('.'));
				if(tempSeconds > 59) tempSeconds = tempSeconds - 60;
				tempSeconds = String(tempSeconds);
				if(tempSeconds.length < 2) tempSeconds = '0' + tempSeconds;
				var tempMilliseconds = String(secondsLeft);
				tempMilliseconds = tempMilliseconds.substring(tempMilliseconds.indexOf('.') + 1);
				tempMilliseconds = tempMilliseconds.substring(0, 2);
				if(tempMilliseconds.length < 2) tempMilliseconds = '0' + tempMilliseconds;
				return tempMinutes + ':' + tempSeconds + ':' + tempMilliseconds;
			};
			if(secondsLeft == 120) timeString = '2:00:00';
			else if(secondsLeft < 120 && secondsLeft > 0) timeString = buildTimeString();
			else {
				document.removeEventListener('keydown', playerKeysDown);
				document.removeEventListener('keyup', playerKeysUp);
				document.addEventListener('playerReloadOnly', playerKeysUp);
				canTime = false;
				isFinished = true;
			}
			drawString('time ' + timeString, grid / 4, (grid / 4) * 3);
		} else {
			drawString('time ' + '0:00:00', grid / 4, (grid / 4) * 3);
			isGameOver = true;
			shot = false;
			canGetHit = false;
			playerX = (gameWidth / 2) - (grid / 2);
			playerY = gameHeight * -1;
			if(isFinished) drawFullscreenMessageGameOver('time over');
			else if(isDead) drawFullscreenMessageGameOver('game over');
			if(!scoreSaved) saveHighScore();
		}
	},

	drawLives = function(){
		const stringNum = livesLeft > 0 ? livesLeft - 1 : livesLeft;
		drawString('left:' + String(stringNum), gameWidth - (grid * 3) - (grid / 4), gameHeight - (grid / 2) - (grid / 4));
		if(livesLeft == 0){
			document.removeEventListener('keydown', playerKeysDown);
			document.removeEventListener('keyup', playerKeysUp);
			document.addEventListener('playerReloadOnly', playerKeysUp);
			canTime = false;
			isDead = true;
		}
		if(hitClock > 0) hitClock--;
		else if(!canGetHit) canGetHit = true;
	},

	drawFullscreenMessage = function(){
		drawString(currentFullscreenMessage, (gameWidth / 2) - (currentFullscreenMessage.length * (grid / 4)), (gameHeight / 2) - (grid / 4), true);
		fullscreenMessageTime++;
	},

	drawFullscreenMessageGameOver = function(message){
		if(gameClock == 4100) mainWindow.reload();
		const baseYPos = (gameHeight / 2) - (grid / 4);
		const firstString = message, secondString = 'your score ' + score,
			thirdString = (score == highScore) ? 'new high score ' + score : '';
		if(thirdString == ''){
			drawString(firstString, (gameWidth / 2) - (firstString.length * (grid / 4)), baseYPos - (grid / 2), true);
			drawString(secondString, (gameWidth / 2) - (secondString.length * (grid / 4)), baseYPos + (grid / 2), true);
		} else {
			drawString(firstString, (gameWidth / 2) - (firstString.length * (grid / 4)), baseYPos - grid, true);
			drawString(secondString, (gameWidth / 2) - (secondString.length * (grid / 4)), baseYPos, true);
			drawString(thirdString, (gameWidth / 2) - (thirdString.length * (grid / 4)), baseYPos + grid, true);
		}
	};

	drawScore();
	drawHighScore();
	drawTime();
	drawLives();
	if(fullscreenMessageTime < fps * 2.5) drawFullscreenMessage();
}, 

timeString = function(timeInput){
	const buildTimeString = function(){
		let timeChars = '';
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
},

getHit = function(enemyArr, i, destroysOnlyPlayer){
	if(livesLeft > 0) livesLeft -= 1;
	explodeEntity({x: playerX, y: playerY, width: playerWidth, height: playerHeight});
	playerX = (gameWidth / 2) - (playerWidth / 2), playerY = gameHeight - ((grid * 2.75) + grid);
	currentPowerup = 1;
	canGetHit = false;
	hitClock = fps * 2;
	if(!destroysOnlyPlayer) enemyArr.splice(i, 1);
},

saveHighScore = function(){
	scoreSaved = true;
	savedData.highScore = highScore;
	storage.set('savedData', {highScore: highScore});
};