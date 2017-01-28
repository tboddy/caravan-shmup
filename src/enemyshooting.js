let enemyShots = {
	small: {seven: []},
	medium: {one: [], two: []}
},
bossShots = {
	oneA: [], oneB: []
};

const missileOneImg = new Image(), missileTwoImg = new Image(), blueBulletImg = new Image();
missileOneImg.src = 'img/missileone.png';
missileTwoImg.src = 'img/missiletwo.png';
blueBulletImg.src = 'img/bluebullet.png';

const spawnShots = {
	small: {
		seven: function(enemy){
			enemyShots.small.seven.push({x: enemy.x + (enemy.width / 2) - 3, y: enemy.y + ((enemy.height / 4) * 3), width: 6, height: 6});
		}
	},
	medium: {
		one: function(enemy){
			enemyShots.medium.one.push({x: enemy.x + (enemy.width / 2) - 3, y: enemy.y + ((enemy.height / 4) * 3), width: 6, height: 6});
		},
		two: function(enemy){
			enemyShots.medium.two.push({x: enemy.x + (enemy.width / 2) - 3, y: enemy.y + ((enemy.height / 4) * 3), width: 12, height: grid});
		}
	}
},

shotAnimations = {
	small: {
		seven: function(){
			const vel = 2;
			enemyShots.small.seven.forEach(function(shotObj, i){
				if(!shotObj.dAngle) shotObj.dAngle = Math.atan2(playerY - shotObj.y, (playerX + (playerWidth / 2) - 3) - shotObj.x);
				shotObj.x += vel * Math.cos(shotObj.dAngle);
				shotObj.y += (vel) * Math.sin(shotObj.dAngle);
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.small.seven);
				if(shotObj.y >= gameHeight) enemyShots.small.seven.splice(i, 1);
			});
		}
	},
	medium: {
		one: function(){
			const vel = 2;
			enemyShots.medium.one.forEach(function(shotObj, i){
				if(!shotObj.dAngle) shotObj.dAngle = Math.atan2(playerY - shotObj.y, (playerX + (playerWidth / 2) - 3) - shotObj.x);
				shotObj.x += vel * Math.cos(shotObj.dAngle);
				shotObj.y += (vel) * Math.sin(shotObj.dAngle);
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.medium.one);
				if(shotObj.y >= gameHeight) enemyShots.medium.one.splice(i, 1);
			});
		},
		two: function(){
			enemyShots.medium.two.forEach(function(shotObj, i){
				shotObj.y += 1.5;
				context.drawImage(missileOneImg, shotObj.x, shotObj.y);
				if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.medium.one);
				checkEnemyPopcorn(shotObj, i, enemyShots.medium.two);
				if(shotObj.y >= gameHeight) enemyShots.medium.two.splice(i, 1);
			});
		}
	}
},

enemyShootingLoop = function(){
	var draw = function(){
		if(enemyShots.small.seven.length) shotAnimations.small.seven();
		if(enemyShots.medium.one.length) shotAnimations.medium.one();
		if(enemyShots.medium.two.length) shotAnimations.medium.two();
		// if(bossShots.oneA.length) animateBossOneAShot();
		// if(bossShots.oneB.length) animateBossOneBShot();
	};
	draw();
},

checkEnemyShotCollision = function(shotObj, i, arr){
	checkCollision(shotObj, {x: playerX, y: playerY, width: grid, height: grid}, function(){
		arr.splice(i, 1);
		getHit(arr, i);
	});
},

checkEnemyPopcorn = function(shotObj, i, arr){
	checkBulletCollision(shotObj, function(){
		explodeEntity(shotObj);
		arr.splice(i, 1);
		score += 20;
	});
};
















// const spawnMediumOneShot = function(enemy){
// 	enemyShots.medium.one.push({x: enemy.x + (grid / 4), y: enemy.y + grid, width: grid, height: grid});
// },

// spawnBossOneAShot = function(enemy){
// 	bossShots.oneA.push({x: enemy.x, y: enemy.y, width: 12, height: grid, direction: 'nw'});
// 	bossShots.oneA.push({x: enemy.x + enemy.width - grid, y: enemy.y, width: grid, height: grid, direction: 'ne'});
// 	bossShots.oneA.push({x: enemy.x, y: enemy.y + enemy.height - grid, width: grid, height: grid, direction: 'sw'});
// 	bossShots.oneA.push({x: enemy.x + enemy.width - grid, y: enemy.y + enemy.height - grid, width: grid, height: grid, direction: 'se'});
// },

// spawnBossOneBShot = function(enemy){
// 	bossShots.oneB.push({x: enemy.x + (enemy.height / 2), y: enemy.y - 6, width: 6, height: 6, direction: 'n'});
// 	bossShots.oneB.push({x: enemy.x + (enemy.height / 2), y: enemy.y + enemy.height, width: 6, height: 6, direction: 's'});
// 	bossShots.oneB.push({x: enemy.x - 6, y: enemy.y + (enemy.height / 2), width: 6, height: 6, direction: 'w'});
// 	bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y + (enemy.height / 2), width: 6, height: 6, direction: 'e'});
// 	bossShots.oneB.push({x: enemy.x - 6, y: enemy.y - 6, width: 6, height: 6, direction: 'nw'});
// 	bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y - 6, width: 6, height: 6, direction: 'ne'});
// 	bossShots.oneB.push({x: enemy.x - 6, y: enemy.y + enemy.height, width: 6, height: 6, direction: 'sw'});
// 	bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y + enemy.height, width: 6, height: 6, direction: 'se'});
// },
// animateBossOneAShot = function(){
// 	const shotSpeed = 1.5 * 0.75;
// 	bossShots.oneA.forEach(function(shotObj, i){
// 		switch(shotObj.direction){
// 			case 'nw':
// 				bossShots.oneA[i].y -= shotSpeed;
// 				bossShots.oneA[i].x -= shotSpeed;
// 				context.drawImage(missileTwoNWImg, shotObj.x, shotObj.y);
// 				break;
// 			case 'ne':
// 				bossShots.oneA[i].y -= shotSpeed;
// 				bossShots.oneA[i].x += shotSpeed;
// 				context.drawImage(missileTwoNEImg, shotObj.x, shotObj.y);
// 				break;
// 			case 'sw':
// 				bossShots.oneA[i].y += shotSpeed;
// 				bossShots.oneA[i].x -= shotSpeed;
// 				context.drawImage(missileTwoSWImg, shotObj.x, shotObj.y);
// 				break;
// 			case 'se':
// 				bossShots.oneA[i].y += shotSpeed;
// 				bossShots.oneA[i].x += shotSpeed;
// 				context.drawImage(missileTwoSEImg, shotObj.x, shotObj.y);
// 				break;
// 		};
// 		if(bossShots.oneA[i].y >= gameHeight) bossShots.oneA.splice(i, 1);
// 		else if(bossShots.oneA[i].y + shotObj.height <= 0) bossShots.oneA.splice(i, 1);
// 		if(bossShots.oneA[i]){
// 			if(bossShots.oneA[i].x >= gameWidth) bossShots.oneA.splice(i, 1);
// 			else if(bossShots.oneA[i].x + shotObj.width <= 0) bossShots.oneA.splice(i, 1);
// 		}
// 		if(bossShots.oneA[i]) checkEnemyShotCollision(shotObj, i, bossShots.oneA);
// 		if(bossShots.oneA[i]) checkEnemyPopcorn(shotObj, i, bossShots.oneA);
// 	});
// },

// animateBossOneBShot = function(){
// 	const shotSpeed = 1.5;
// 	const shotSpeedDiag = shotSpeed * 0.75;
// 	bossShots.oneB.forEach(function(shotObj, i){
// 		switch(shotObj.direction){
// 			case 'n':
// 				bossShots.oneB[i].y -= shotSpeed;
// 				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
// 				break;
// 			case 's':
// 				bossShots.oneB[i].y += shotSpeed;
// 				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
// 				break;
// 			case 'w':
// 				bossShots.oneB[i].x -= shotSpeed;
// 				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
// 				break;
// 			case 'e':
// 				bossShots.oneB[i].x += shotSpeed;
// 				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
// 				break;
// 			case 'nw':
// 				bossShots.oneB[i].y -= shotSpeedDiag;
// 				bossShots.oneB[i].x -= shotSpeedDiag;
// 				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
// 				break;
// 			case 'ne':
// 				bossShots.oneB[i].y -= shotSpeedDiag;
// 				bossShots.oneB[i].x += shotSpeedDiag;
// 				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
// 				break;
// 			case 'sw':
// 				bossShots.oneB[i].y += shotSpeedDiag;
// 				bossShots.oneB[i].x -= shotSpeedDiag;
// 				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
// 				break;
// 			case 'se':
// 				bossShots.oneB[i].y += shotSpeedDiag;
// 				bossShots.oneB[i].x += shotSpeedDiag;
// 				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
// 				break;
// 		};
// 		if(bossShots.oneB[i].y >= gameHeight) bossShots.oneB.splice(i, 1);
// 		else if(bossShots.oneB[i].y + shotObj.height <= 0) bossShots.oneB.splice(i, 1);
// 		if(bossShots.oneB[i]){
// 			if(bossShots.oneB[i].x >= gameWidth) bossShots.oneB.splice(i, 1);
// 			else if(bossShots.oneB[i].x + shotObj.width <= 0) bossShots.oneB.splice(i, 1);
// 		}
// 		if(bossShots.oneB[i]) checkEnemyShotCollision(shotObj, i, bossShots.oneB);
// 	});
// };
