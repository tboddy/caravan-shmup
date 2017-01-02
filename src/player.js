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