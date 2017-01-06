const start = function(){
	let menu = [
		{label: 'start game', action: 'startGame', active: true, index: 0},
		{label: 'options', action: 'showOptions', active: false, index: 1},
		{label: 'quit', action: 'quitGame', active: false, index: 2}
	], optionsMenu = [
		{label: 'toggle fullscreen', action: 'toggleFullscreen', active: true, index: 0},
		{label: 'back', action: 'cancelOptions', active: false, index: 1},
	], currentMenuItem = {}, optionsShowing = false, canMoveMenu = true; canPickMenu = true;

	const startLogoImg = new Image(),
		creditString = '2016 t.boddy',
		creditStringTwo = 'pre alpha 0.05',
		controlString = 'arrows or joystick:move',
		controlStringTwo = 'z or btns 1 to 4:shoot',
		controlStringThree = 'esc or btn 9: back to menu';
	startLogoImg.src = 'img/logo.png';

	const init = function(){
		$(window).resize(resizeGame);
		controls();
		loop = startLoop();
		canvasEl.show();
		if(savedData.fullscreen){
			mainWindow.setFullScreen(true);
			isFullscreen = true;
		}
		window.requestAnimationFrame(loop);
	},

	startLoop = function(){
		return function(){
			const draw = function(){
				context.drawImage(startLogoImg, (gameWidth / 2) - 64, grid * 1);
				if(optionsShowing){
					optionsMenu.forEach(function(item, i){
						const isActive = item.active ? true : false;
						drawString(item.label, textCenter(item.label), grid * (8 + (i * .5)), isActive);
					});
				} else {
					menu.forEach(function(item, i){
						const isActive = item.active ? true : false;
						drawString(item.label, textCenter(item.label), grid * (8 + (i * .5)), isActive);
					});
					drawString(controlString, textCenter(controlString), grid * 10.5, true);
					drawString(controlStringTwo, textCenter(controlStringTwo), grid * 11, true);
					drawString(controlStringThree, textCenter(controlStringThree), grid * 11.5, true);
					drawString(creditString, textCenter(creditString), grid * 13);
					drawString(creditStringTwo, textCenter(creditStringTwo), grid * 13.5);
				}
			};
			if(!gamepad) setupGamepad()
			clearGame();
			draw();
			updateStartGamepad();
			window.requestAnimationFrame(loop);
		};
	},

	updateStartGamepad = function(){
		if(!gamepad) setupGamepad()
		if(navigator.getGamepads()[0]){
			if(gamepad.axes[9]){
				const hatSwitch = gamepad.axes[9].toFixed(1);
				if(hatSwitch == '-1.0' && canMoveMenu) moveUpMenu();
				else if(hatSwitch == '0.1' && canMoveMenu) moveDownMenu();
				else if(hatSwitch == '3.3' && !canMoveMenu) canMoveMenu = true;
			} else {
				if(gamepad.axes[1] <= analogThresh * -1 && canMoveMenu) moveUpMenu();
				else if(gamepad.axes[1] >= analogThresh && canMoveMenu) moveDownMenu();
				// else if(!canPick) canPick = true;
			}
			if((gamepad.buttons[9].pressed || gamepad.buttons[0].pressed || gamepad.buttons[1].pressed || gamepad.buttons[3].pressed || gamepad.buttons[2].pressed) && canPickMenu) selectMenuItem();
			else if((!gamepad.buttons[9].pressed && !gamepad.buttons[0].pressed && !gamepad.buttons[1].pressed && !gamepad.buttons[3].pressed && !gamepad.buttons[2].pressed) && !canPickMenu) canPickMenu = true;
		}
	},

	textCenter = function(string){
		return (gameWidth / 2) - (string.length * (grid / 4));
	},

	controls = function(){
		setupKeyboard();
		navigator.getGamepads()[0] ? setupGamepad() : window.addEventListener('gamepadconnected', setupGamepad);
	},

	moveUpMenu = function(){
		canMoveMenu = false;
		getCurrentMenuItem();
		const menuArr = optionsShowing ? optionsMenu : menu;
		if(menuArr[currentMenuItem.index - 1]){
			menuArr[currentMenuItem.index].active = false;
			menuArr[currentMenuItem.index - 1].active = true;
		}
	},

	moveDownMenu = function(){
		canMoveMenu = false;
		getCurrentMenuItem();
		const menuArr = optionsShowing ? optionsMenu : menu;
		if(menuArr[currentMenuItem.index + 1]){
			menuArr[currentMenuItem.index].active = false;
			menuArr[currentMenuItem.index + 1].active = true;
		}
	},

	selectMenuItem = function(){
		canPickMenu = false;
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

	setupGamepad = function(){
		gamepad = navigator.getGamepads()[0];
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
			case 90: selectMenuItem(); break;
		};
	},

	showOptions = function(){
		optionsShowing = true;
	},

	toggleFullscreen = function(){
		const openFullscreen = function(){
			mainWindow.setFullScreen(true);
			isFullscreen = true;
			savedData.fullscreen = true;
			storage.set('savedData', savedData);
		}, closeFullscreen = function(){
			mainWindow.setFullScreen(false);
			isFullscreen = false;
			savedData.fullscreen = false;
			storage.set('savedData', savedData);
		};
		isFullscreen ? closeFullscreen() : openFullscreen();
	},

	cancelOptions = function(){
		optionsShowing = false;
		optionsMenu.forEach(function(menuItem, i){
			menuItem.active = i == 0 ? true : false;
		});
	},

	quitGame = function(){
		mainWindow.close();
	};

	storage.get('savedData', function(err, data){
		savedData = data;
		init();
	});
	
};