let enemyShots = {
	medium: {one: []}
};

const missileOneImg = new Image(), blueBulletImg = new Image();
missileOneImg.src = 'img/missileone.png';
blueBulletImg.src = 'img/bluebullet.png';

const spawnMediumOneShot = function(enemy){
	enemyShots.medium.one.push({x: enemy.x + (grid / 3), y: enemy.y + grid, width: grid / 2, height: grid});
	enemyShots.medium.one.push({x: (enemy.x + (grid * 2)) - ((grid / 3) + (grid / 2)), y: enemy.y + grid, width: grid / 2, height: grid});
},

enemyShootingLoop = function(){
	var draw = function(){
		if(enemyShots.medium.one.length) animateMediumOneShot();
		// if(bossShots.oneA.length) bossBulletAnimations.oneA();
		// if(bossShots.oneB.length) bossBulletAnimations.oneB();
	};
	draw();
}, 

animateMediumOneShot = function(){
	enemyShots.medium.one.forEach(function(shotObj, i){
		context.drawImage(missileOneImg, shotObj.x, shotObj.y);
		enemyShots.medium.one[i].y += 4;
		if(enemyShots.medium.one[i].y >= gameHeight) enemyShots.medium.one.splice(i, 1);
		if(canGetHit) checkEnemyShotCollision(shotObj, i, enemyShots.medium.one);
		checkEnemyPopcorn(shotObj, i, enemyShots.medium.one);
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