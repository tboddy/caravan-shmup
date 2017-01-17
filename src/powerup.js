const powerupImg = new Image();
powerupImg.src = 'img/powerup.png';

let powerups = [], powerupBonusCount = 1;

const powerupLoop = function(){
	const draw = function(){
		const animatePowerups = function(){
			powerups.forEach(function(powerupObj, i){

				if(!powerupObj.width) powerupObj.width = grid;



				// const increase = 90 / 180 * Math.PI / (grid * 1.5),
				// 	offsetNum = powerupObj.initial >= gameWidth / 2 ? 0.25 : -0.25;
				// powerups[i].x = (powerupObj.x - Math.sin(powerupObj.count) * (grid * offsetNum));
				// powerups[i].count += increase;
				// context.drawImage(powerupImg, powerupObj.x, powerupObj.y);
				// powerups[i].y += 0.5;



				powerupObj.y += 0.5;
				const increase = 90 / 180 * Math.PI / (grid * 1.75);
				powerupObj.x = powerupObj.initial - Math.sin(powerupObj.count) * (grid * 6.5);
				context.drawImage(powerupImg, powerupObj.x, powerupObj.y);
				powerupObj.count += increase;


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
	if(gameClock < (outroTime / 3) && gameClock % (fps * 8) == 0) spawnPowerup();
	if(gameClock >= (outroTime / 3) && gameClock < (outroTime - (fps * 6)) && gameClock % (fps * 16) == 0) spawnPowerup();
	if(powerups.length) draw();
},

spawnPowerup = function(){
	powerups.push({x: grid * 11, y: -grid, initial: (gameWidth / 2) - (grid / 2), count: 0});
}, powerupBonus = function(){
	score += powerupBonusCount * 1000;
	fullscreenMessageTime = 0;
	currentFullscreenMessage = 'bonus: ' + (powerupBonusCount * 1000);
	powerupBonusCount++;
};