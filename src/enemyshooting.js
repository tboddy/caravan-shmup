let enemyShots = {
	medium: {one: []}
},
bossShots = {
	oneA: [], oneB: []
};

const missileOneImg = new Image(), blueBulletImg = new Image();
missileOneImg.src = 'img/missileone.png';
blueBulletImg.src = 'img/bluebullet.png';

const missileTwoNImg = new Image(), missileTwoSImg = new Image(), missileTwoWImg = new Image(), missileTwoEImg = new Image(), missileTwoNWImg = new Image(), missileTwoNEImg = new Image(), missileTwoSWImg = new Image(),
	missileTwoSEImg = new Image();
missileTwoNImg.src = 'img/missiletwon.png';
missileTwoSImg.src = 'img/missiletwo.png';
missileTwoWImg.src = 'img/missiletwow.png';
missileTwoEImg.src = 'img/missiletwoe.png';
missileTwoNWImg.src = 'img/missiletwonw.png';
missileTwoNEImg.src = 'img/missiletwone.png';
missileTwoSWImg.src = 'img/missiletwosw.png';
missileTwoSEImg.src = 'img/missiletwose.png';

const spawnMediumOneShot = function(enemy){
	enemyShots.medium.one.push({x: enemy.x + (grid / 3), y: enemy.y + grid, width: grid / 2, height: grid});
	enemyShots.medium.one.push({x: (enemy.x + (grid * 2)) - ((grid / 3) + (grid / 2)), y: enemy.y + grid, width: grid / 2, height: grid});
},

spawnBossOneAShot = function(enemy){
	bossShots.oneA.push({x: enemy.x, y: enemy.y, width: 12, height: grid, direction: 'nw'});
	bossShots.oneA.push({x: enemy.x + enemy.width - grid, y: enemy.y, width: grid, height: grid, direction: 'ne'});
	bossShots.oneA.push({x: enemy.x, y: enemy.y + enemy.height - grid, width: grid, height: grid, direction: 'sw'});
	bossShots.oneA.push({x: enemy.x + enemy.width - grid, y: enemy.y + enemy.height - grid, width: grid, height: grid, direction: 'se'});
},

spawnBossOneBShot = function(enemy){
	bossShots.oneB.push({x: enemy.x + (enemy.height / 2), y: enemy.y - 6, width: 6, height: 6, direction: 'n'});
	bossShots.oneB.push({x: enemy.x + (enemy.height / 2), y: enemy.y + enemy.height, width: 6, height: 6, direction: 's'});
	bossShots.oneB.push({x: enemy.x - 6, y: enemy.y + (enemy.height / 2), width: 6, height: 6, direction: 'w'});
	bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y + (enemy.height / 2), width: 6, height: 6, direction: 'e'});
	bossShots.oneB.push({x: enemy.x - 6, y: enemy.y - 6, width: 6, height: 6, direction: 'nw'});
	bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y - 6, width: 6, height: 6, direction: 'ne'});
	bossShots.oneB.push({x: enemy.x - 6, y: enemy.y + enemy.height, width: 6, height: 6, direction: 'sw'});
	bossShots.oneB.push({x: enemy.x + enemy.width, y: enemy.y + enemy.height, width: 6, height: 6, direction: 'se'});
},

enemyShootingLoop = function(){
	var draw = function(){
		if(enemyShots.medium.one.length) animateMediumOneShot();
		if(bossShots.oneA.length) animateBossOneAShot();
		if(bossShots.oneB.length) animateBossOneBShot();
	};
	draw();
}, 

animateMediumOneShot = function(){
	enemyShots.medium.one.forEach(function(shotObj, i){
		context.drawImage(missileOneImg, shotObj.x, shotObj.y);
		enemyShots.medium.one[i].y += 3;
		if(enemyShots.medium.one[i].y >= gameHeight) enemyShots.medium.one.splice(i, 1);
		if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.medium.one);
		checkEnemyPopcorn(shotObj, i, enemyShots.medium.one);
	});
},

animateBossOneAShot = function(){
	const shotSpeed = 1.5 * 0.75;
	bossShots.oneA.forEach(function(shotObj, i){
		switch(shotObj.direction){
			case 'nw':
				bossShots.oneA[i].y -= shotSpeed;
				bossShots.oneA[i].x -= shotSpeed;
				context.drawImage(missileTwoNWImg, shotObj.x, shotObj.y);
				break;
			case 'ne':
				bossShots.oneA[i].y -= shotSpeed;
				bossShots.oneA[i].x += shotSpeed;
				context.drawImage(missileTwoNEImg, shotObj.x, shotObj.y);
				break;
			case 'sw':
				bossShots.oneA[i].y += shotSpeed;
				bossShots.oneA[i].x -= shotSpeed;
				context.drawImage(missileTwoSWImg, shotObj.x, shotObj.y);
				break;
			case 'se':
				bossShots.oneA[i].y += shotSpeed;
				bossShots.oneA[i].x += shotSpeed;
				context.drawImage(missileTwoSEImg, shotObj.x, shotObj.y);
				break;
		};
		if(bossShots.oneA[i].y >= gameHeight) bossShots.oneA.splice(i, 1);
		else if(bossShots.oneA[i].y + shotObj.height <= 0) bossShots.oneA.splice(i, 1);
		if(bossShots.oneA[i]){
			if(bossShots.oneA[i].x >= gameWidth) bossShots.oneA.splice(i, 1);
			else if(bossShots.oneA[i].x + shotObj.width <= 0) bossShots.oneA.splice(i, 1);
		}
		if(bossShots.oneA[i]) checkEnemyShotCollision(shotObj, i, bossShots.oneA);
		if(bossShots.oneA[i]) checkEnemyPopcorn(shotObj, i, bossShots.oneA);
	});
},

animateBossOneBShot = function(){
	const shotSpeed = 1.5;
	const shotSpeedDiag = shotSpeed * 0.75;
	bossShots.oneB.forEach(function(shotObj, i){
		switch(shotObj.direction){
			case 'n':
				bossShots.oneB[i].y -= shotSpeed;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 's':
				bossShots.oneB[i].y += shotSpeed;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'w':
				bossShots.oneB[i].x -= shotSpeed;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'e':
				bossShots.oneB[i].x += shotSpeed;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'nw':
				bossShots.oneB[i].y -= shotSpeedDiag;
				bossShots.oneB[i].x -= shotSpeedDiag;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'ne':
				bossShots.oneB[i].y -= shotSpeedDiag;
				bossShots.oneB[i].x += shotSpeedDiag;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'sw':
				bossShots.oneB[i].y += shotSpeedDiag;
				bossShots.oneB[i].x -= shotSpeedDiag;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
			case 'se':
				bossShots.oneB[i].y += shotSpeedDiag;
				bossShots.oneB[i].x += shotSpeedDiag;
				context.drawImage(blueBulletImg, shotObj.x, shotObj.y);
				break;
		};
		if(bossShots.oneB[i].y >= gameHeight) bossShots.oneB.splice(i, 1);
		else if(bossShots.oneB[i].y + shotObj.height <= 0) bossShots.oneB.splice(i, 1);
		if(bossShots.oneB[i]){
			if(bossShots.oneB[i].x >= gameWidth) bossShots.oneB.splice(i, 1);
			else if(bossShots.oneB[i].x + shotObj.width <= 0) bossShots.oneB.splice(i, 1);
		}
		if(bossShots.oneB[i]) checkEnemyShotCollision(shotObj, i, bossShots.oneB);
	});
};

var checkEnemyShotCollision = function(shotObj, i, arr){
	checkCollision(shotObj, {x: playerX, y: playerY, width: grid, height: grid}, function(){
		arr.splice(i, 1);
		getHit(arr, i);
	});
};

var checkEnemyPopcorn = function(shotObj, i, arr){
	checkBulletCollision(shotObj, function(){
		explodeEntity(shotObj);
		arr.splice(i, 1);
		score += 20;
	});
};