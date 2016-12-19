var enemyShots = {
	medium: {one: []}
}

const enemyMediumOneBulletImg = new Image();
enemyMediumOneBulletImg.src = 'img/enemymediumonebullet.png';

var spawnMediumOneShot = function(enemy){
	enemyShots.medium.one.push({x: enemy.x + (grid / 3), y: enemy.y + grid, width: grid / 2, height: grid});
	enemyShots.medium.one.push({x: (enemy.x + (grid * 2)) - ((grid / 3) + (grid / 2)), y: enemy.y + grid, width: grid / 2, height: grid});
};

var enemyShootingLoop = function(){

	var draw = function(){
		if(enemyShots.medium.one.length) animateMediumOneShot();
	};

	draw();

};

var animateMediumOneShot = function(){
	enemyShots.medium.one.forEach(function(shotObj, i){
		context.drawImage(enemyMediumOneBulletImg, shotObj.x, shotObj.y);
		enemyShots.medium.one[i].y += levelSpeed * 4;
		if(enemyShots.medium.one.y >= gameHeight) enemyShots.medium.one.splice(i, 1);
		checkEnemyShotCollision(shotObj, i, enemyShots.medium.one);
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