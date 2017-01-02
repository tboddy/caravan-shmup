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