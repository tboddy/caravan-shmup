var startedGame = false, startLoopInterval;

var initStart = function(){
	// initGame()
	startLoopInterval = setInterval(startLoop, 1000 / fps);
	startControls();
};

var setupGamepad = function(){
	gamepad = navigator.getGamepads()[0];
};

var startControls = function(){

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
	if(!gamepad) setupGamepad()
	if(navigator.getGamepads()[0]) if(gamepad.buttons[9].pressed) checkStartGame();
};

const startLogoImg = new Image(), studiosLogoImg = new Image();
startLogoImg.src = 'img/logo.png';
studiosLogoImg.src = 'img/studioslogo.png';

var drawStart = function(){
	var verString = 'pre alpha 0.04',
		startString = 'press start or enter',
		creditString = '2016 decontrol';
	context.drawImage(startLogoImg, (gameWidth / 2) - 64, grid * 2.5);
	drawString(verString, textCenter(verString), grid * 9.5);
	drawString(creditString, textCenter(creditString), grid * 10);
	drawString(startString, textCenter(startString), grid * 11.5);
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