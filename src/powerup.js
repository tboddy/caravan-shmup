const powerupWaves = [0, 350, 1000, 2500, 3000, 3750, 4500],
powerupImg = new Image();
powerupImg.src = 'img/powerup.png';

let powerups = [], powerupBonusCount = 1;

const powerupLoop = function(){
	const draw = function(){
		const animatePowerups = function(){
			powerups.forEach(function(powerupObj, i){
				powerupObj.width = grid;
				const increase = 90 / 180 * Math.PI / (grid * 1.5),
					offsetNum = powerupObj.initial >= gameWidth / 2 ? 0.25 : -0.25;
				powerups[i].x = (powerupObj.x - Math.sin(powerupObj.count) * (grid * offsetNum));
				powerups[i].count += increase;
				context.drawImage(powerupImg, powerupObj.x, powerupObj.y);
				powerups[i].y += levelSpeed;
				if(powerupObj.y >= gameHeight) powerups.splice(i, 1);
				checkPowerupCollision(powerupObj, i);
			});
		},
		checkPowerupCollision = function(powerupObj, i){
			const powerupEl = {x: powerupObj.x, y: powerupObj.y, width: grid, height: grid}, playerEl = {x: playerX, y: playerY, width: grid, height: grid};
			checkCollision(powerupEl, playerEl, function(powerupEl, playerEl){
				powerups.splice(i, 1);
				currentPowerup < 4 ? currentPowerup++ : powerupBonus();
			});
		};
		animatePowerups();
	};
	if(powerupWaves.length){
		powerupWaves.forEach(function(waveTime){
			if(gameClock == parseInt(waveTime)) {
				spawnPowerup();
			}
		});
	}
	if(powerups.length) draw();
},

spawnPowerup = function(){
	powerups.push({x: grid * 11, y: -grid, initial: gameWidth / 2, count: 0});
}, powerupBonus = function(){
	score += powerupBonusCount * 1000;
	fullscreenMessageTime = 0;
	currentFullscreenMessage = 'bonus: ' + (powerupBonusCount * 1000);
	powerupBonusCount++;
};