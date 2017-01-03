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
			playerY = gameHeight * 2;
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
		if(gameClock == 12000) mainWindow.reload();
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