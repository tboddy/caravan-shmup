const playerSpeed = 3.5, playerWidth = grid, playerHeight = grid * 1.5;
let movingUp = false, movingDown = false, movingLeft = false, movingRight = false, shot = false, player, playerIsHidden = false, playerX = (gameWidth / 2) - (playerWidth / 2), playerY = gameHeight - (playerHeight + grid);

const setupPlayer = () => {
	const setupKeyboard = () => {
		document.addEventListener('keydown', playerKeysDown);
		document.addEventListener('keyup', playerKeysUp);
	}, buildPlayer = () => {
		player = new Image();
	};
	setupKeyboard();
	buildPlayer();
},

playerKeysDown = (e) => {
	switch(e.which){
		case 38: movingUp = true; break;
		case 40: movingDown = true; break;
		case 37: movingLeft = true; break;
		case 39: movingRight = true; break;
		case 90: shot = true; break;
		case 27: mainWindow.reload(); break;
	};
},

playerKeysUp = (e) => {
	switch(e.which){
		case 38: movingUp = false; break;
		case 40: movingDown = false; break;
		case 37: movingLeft = false; break;
		case 39: movingRight = false; break;
		case 90: shot = false; break;
	};
},

playerLoop = () => {
	const update = () => {
		const updateGamepad = () => {
			if(navigator.getGamepads()[0]){
				gamepad = navigator.getGamepads()[0];
				if(gamepad.axes[9]){
					const hatSwitch = gamepad.axes[9].toFixed(1);
					movingUp = hatSwitch == '-1.0' || hatSwitch == '1.0' || hatSwitch == '-0.7' ? true : false;
					movingDown = hatSwitch == '0.1' || hatSwitch == '-0.1' || hatSwitch == '0.4' ? true : false;
					movingLeft = hatSwitch == '0.7' || hatSwitch == '1.0' || hatSwitch == '0.4' ? true : false;
					movingRight = hatSwitch == '-0.4' || hatSwitch == '-0.1' || hatSwitch == '-0.7' ? true : false; 
				} else {
					movingUp = gamepad.axes[1] < analogThresh * -1 ? true : false;
					movingDown = gamepad.axes[1] > analogThresh ? true : false;
					movingLeft = gamepad.axes[0] < analogThresh * -1 ? true : false;
					movingRight = gamepad.axes[0] > analogThresh ? true : false;
				}
				shot = gamepad.buttons[0].pressed || gamepad.buttons[1].pressed || gamepad.buttons[3].pressed || gamepad.buttons[2].pressed ? true : false;
				if(gamepad.buttons[8].pressed) mainWindow.reload();
			}
		},
		updateKeyboard = () => {
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
		updateKeyboard();
	},
	draw = () => {
		if(!isGameOver){
			if(!canGetHit){
				if(gameClock % 10 == 0) player.src = 'img/playerblank.png';
				else if(gameClock % 10 == 5) player.src = 'img/player.png';
			} else if(player.src != 'img/player.png') {
				player.src = 'img/player.png';
			}
			let offset = 0;
			if(movingLeft) offset = grid;
			else if(movingRight) offset = grid * 2;
			context.drawImage(player, offset, 0, grid, grid * 1.5, playerX, playerY, grid, grid * 1.5);
		}
	};
	update();
	draw();
};