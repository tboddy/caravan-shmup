let score = 0, highScore = 0, fullscreenMessageTime = 0, currentFullscreenMessage = 'score attack: 2 min', initialTime = new Date(), canTime = true, livesLeft = 4, canGetHit = true, isGameOver = false, isFinished = false, isDead = false,
	hitClock = 0, scoreSaved = false;
let endTime = new Date(initialTime.getTime() + (2 * 60000));

var setupHighScore = function(){
	if(savedData.highScore) highScore = savedData.highScore;
	else storage.set('savedData', {highScore: 0});
};

var hudLoop = function(){

	var drawScore = function(){
		var tempScore = String(score);
		var addZero = function(input){
			return input.length < 7 ? addZero('0' + input) : input;
		};
		tempScore = addZero(tempScore);
		drawString('score ' + tempScore, grid / 4, grid / 4);
	};

	var drawHighScore = function(){
		if(score > highScore) highScore = score;
		var tempScore = String(highScore);
		var addZero = function(input){
			return input.length < 7 ? addZero('0' + input) : input;
		};
		tempScore = addZero(tempScore);
		drawString('high ' + tempScore, (gameWidth - (grid / 4)) - ((grid / 2) * 12), grid / 4);
	}; 

	var drawTime = function(){
		if(canTime){
			var timeString = '';
			var secondsLeft = 120 - (gameClock / fps);
			var buildTimeString = function(){
				var tempMinutes = secondsLeft > 60 ? '1' : '0';
				var tempSeconds = String(secondsLeft);
				tempSeconds = tempSeconds.substring(0, tempSeconds.indexOf('.'));
				tempSeconds = parseInt(tempSeconds);
				if(tempSeconds > 59) tempSeconds = tempSeconds - 60;
				tempSeconds = String(tempSeconds);
				if(tempSeconds.length < 2) tempSeconds = '0' + tempSeconds;
				var tempMilliseconds = String(secondsLeft);
				tempMilliseconds = tempMilliseconds.substring(tempMilliseconds.indexOf('.') + 1);
				tempMilliseconds = tempMilliseconds.substring(0, 2);
				return tempMinutes + ':' + tempSeconds + ':' + tempMilliseconds;
			};
			if(secondsLeft == 120) timeString = '2:00:00';
			else if(secondsLeft < 120 && secondsLeft > 0) timeString = buildTimeString();
			else {
				document.removeEventListener('keydown', playerKeysDown);
				document.removeEventListener('keyup', playerKeysUp);
				document.addEventListener('playerReloadOnly', playerKeysUp);
				canTime = false;
				isGameOver = true;
				isFinished = true;
				canGetHit = false;
			}
			drawString('time ' + timeString, grid / 4, (grid / 4) * 3);
		} else {
			drawString('time ' + '0:00:00', grid / 4, (grid / 4) * 3);
			if(isFinished) drawFullscreenMessageGameOver('time over');
			else if(isDead) drawFullscreenMessageGameOver('game over');
			if(!scoreSaved) saveHighScore();
		}
	};

	var drawLives = function(){
		// context.drawImage(liveImg, gameWidth - (grid * 1.5) - (grid / 4), gameHeight - (grid / 2) - (grid / 4));
		var stringNum = livesLeft > 0 ? livesLeft - 1 : livesLeft;
		drawString('left:' + String(stringNum), gameWidth - (grid * 3) - (grid / 4), gameHeight - (grid / 2) - (grid / 4));
		if(livesLeft == 0){
			document.removeEventListener('keydown', playerKeysDown);
			document.removeEventListener('keyup', playerKeysUp);
			document.addEventListener('playerReloadOnly', playerKeysUp);
			canTime = false;
			isGameOver = true;
			isDead = true;
			canGetHit = false;
		}
		if(hitClock > 0) hitClock--;
		else if(!canGetHit) canGetHit = true;
	};

	const drawFullscreenMessage = function(){
		drawString(currentFullscreenMessage, (gameWidth / 2) - (currentFullscreenMessage.length * (grid / 4)), (gameHeight / 2) - (grid / 4), true);
		fullscreenMessageTime++;
	};

	const drawFullscreenMessageGameOver = function(message){
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
};

var drawString = function(input, x, y, isRed){
	input.split('').forEach(function(char, i){
		drawChar(char, x + (i * (grid / 2)), y, isRed);
	});
};

const charImg = new Image();
charImg.src = 'img/font.png';

var drawChar = function(input, x, y, isRed){
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
};

var timeString = function(timeInput){
	var buildTimeString = function(){
		var timeChars = '';
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
};

var getHit = function(enemyArr, i, destroysOnlyPlayer){
	if(livesLeft > 0) livesLeft -= 1;
	explodeEntity({x: playerX, y: playerY, width: playerWidth, height: playerHeight});
	playerX = (gameWidth / 2) - (playerWidth / 2), playerY = gameHeight - ((grid * 2.75) + grid);
	currentPowerup = 1;
	canGetHit = false;
	hitClock = fps * 2;
	if(!destroysOnlyPlayer) enemyArr.splice(i, 1);
};

var saveHighScore = function(){
	scoreSaved = true;
	savedData.highScore = highScore;
	storage.set('savedData', {highScore: highScore});
};