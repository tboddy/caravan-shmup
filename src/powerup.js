var powerups = [];

const powerupImg = new Image();
powerupImg.src = 'img/powerup.png';

var powerupLoop = function(){
	var draw = function(){
		powerups.forEach(function(powerupObj, i){
			powerupObj.y += levelSpeed;
			if(powerupObj.y + grid >= 0){
				powerupObj = sineCurve(powerupObj, dropXSpeed, dropXMax);
				context.drawImage(powerupImg, powerupObj.x, powerupObj.y);
				var powerupCollisionEl = {x: powerupObj.x, y: powerupObj.y, width: grid, height: grid};
				powerupCollision(powerupCollisionEl, i);
				if(powerupObj.y >= gameHeight + grid) powerups.splice(i, 1);
			}
		});
	};
	if(powerups.length) draw();
};

var powerupCollision = function(powerupObj, i){
	var powerupEl = {x: powerupObj.x, y: powerupObj.y, width: grid, height: grid}, playerEl = {x: playerX, y: playerY, width: grid, height: grid};
	checkCollision(powerupEl, playerEl, function(powerupEl, playerEl){
		powerups.splice(i, 1);
		currentPowerup < 4 ? currentPowerup++ : powerupBonus();
	});
};

var powerupBonus = function(){
	score += 1000;
	fullscreenMessageTime = 0;
	currentFullscreenMessage = 'bonus: 1000';
};