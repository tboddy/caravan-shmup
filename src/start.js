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