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

const startLogoImg = new Image(), studiosLogoImg = new Image();
startLogoImg.src = 'img/logo.png';
studiosLogoImg.src = 'img/studioslogo.png';

var drawStart = function(){
	var verString = 'pre alpha 0.02',
		startString = 'press b3 or enter',
		creditString = '2016 t.boddy';
	context.drawImage(startLogoImg, (gameWidth / 2) - 64, grid * 2);
	drawString(verString, textCenter(verString), grid * 9);
	drawString(creditString, textCenter(creditString), grid * 10);
	drawString(startString, textCenter(startString), grid * 12);
	// context.drawImage(studiosLogoImg, (gameWidth / 2) - 32, grid * 12);
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